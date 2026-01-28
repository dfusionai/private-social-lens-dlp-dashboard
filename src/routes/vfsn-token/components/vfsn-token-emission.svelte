<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { stakeEventsActions } from "$lib/stores/stakeEventsStore";
  import { RefreshCwIcon } from "@lucide/svelte";
  import dayjs from "dayjs";
  import utc from "dayjs/plugin/utc";
  import { onMount } from "svelte";
  
  dayjs.extend(utc);
  import { fetchDlpGraph } from "../../../api/subgraph-dlp";
  import VfsnTokenEmissionChart from "./vfsn-token-emission-chart.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { ToggleGroup } from "bits-ui";

  let isLoading = $state(false);
  let isLoadingDailyEvents = $state(false);
  let selectedDate = $state<Date | null>(null);
  let currentRequestId = $state<number | null>(null);
  let dailyEvents = $state<
    Array<{
      id: string;
      contributorAddress: string;
      fileId: string;
      rewardAmount: number;
      blockNumber: string;
      blockTimestamp: string;
      transactionHash: string;
      hasRewardAmount: boolean;
      hasBlockTimestamp: boolean;
    }>
  >([]);

  let chartData = $state<
    Array<{
      date: Date;
      rewardAmount: number;
      maxRewardAmount: number;
    }>
  >([]);

  let daysFilter = $state("30");

  function getDaysFilter() {
    return daysFilter;
  }

  async function setDaysFilter(newValue: string) {
    daysFilter = newValue;
    await fetchData();
  }

  const fetchData = async () => {
    try {
      isLoading = true;

      // Use UTC for date calculations to match subgraph's UTC day start
      const currentDate = new Date();
      const endDate = new Date(currentDate);
      endDate.setUTCHours(23, 59, 59, 999);
      const endOfCurrentDate = Math.floor(endDate.getTime() / 1000); // Convert to seconds (UTC)
      
      // Calculate start date: subtract (daysFilter - 1) days to get N days total including today
      // e.g., for 30 days: today - 29 days = 30 days total (Dec 28 to Jan 27 if today is Jan 27)
      // Use milliseconds for reliable date arithmetic across month boundaries
      const daysToSubtract = Number(daysFilter) - 1;
      const nDaysAgo = new Date(currentDate.getTime() - daysToSubtract * 24 * 60 * 60 * 1000);
      nDaysAgo.setUTCHours(0, 0, 0, 0);
      const startOfNDaysAgo = Math.floor(nDaysAgo.getTime() / 1000); // Convert to seconds (UTC)

      // Fetch all records using pagination (max 1000 per query)
      const allDailyMetrics: Array<{ date: string; totalRewardAmount: string }> = [];
      const pageSize = 1000;
      let skip = 0;
      let hasMore = true;

      while (hasMore) {
        const DLP_QUERY = `{
                    dailyRewardMetrics(
                        where: {
                            date_gte: ${startOfNDaysAgo},
                            date_lte: ${endOfCurrentDate}
                        }
                        orderBy: date
                        orderDirection: asc
                        first: ${pageSize}
                        skip: ${skip}
                    ) {
                        date
                        totalRewardAmount
                    }
                }`;
        
        const data = await fetchDlpGraph({ query: DLP_QUERY });
        
        if (data.data && data.data.dailyRewardMetrics) {
          const metrics = data.data.dailyRewardMetrics;
          allDailyMetrics.push(...metrics);
          
          // If we got fewer than pageSize, we've fetched all records
          if (metrics.length < pageSize) {
            hasMore = false;
          } else {
            skip += pageSize;
          }
        } else {
          hasMore = false;
        }
      }

      // Sort by date to ensure correct order (in case of any edge cases)
      allDailyMetrics.sort((a, b) => parseInt(a.date) - parseInt(b.date));

      chartData = allDailyMetrics.map((item) => ({
        date: dayjs.unix(parseInt(item.date)).toDate(),
        rewardAmount: parseFloat(item.totalRewardAmount) / 1e18,
        maxRewardAmount: 0, // Not needed - users can see max when clicking datapoint
      }));

      // stakeEventsActions.setStakeOnWeek(chartData);
    } catch (error) {
      console.error("Error fetching staking metrics:", error);
    } finally {
      isLoading = false;
    }
  };

  const handleDateSelect = async (date: Date) => {
    // Generate a unique request ID for this fetch
    const requestId = Date.now();
    currentRequestId = requestId;
    selectedDate = date;
    // Clear previous events immediately to show loading state
    dailyEvents = [];
    await fetchDailyEvents(date, requestId);
  };

  const fetchDailyEvents = async (date: Date, requestId: number) => {
    try {
      isLoadingDailyEvents = true;
      
      // Calculate UTC day start and end for the selected date
      const dayStart = new Date(date);
      dayStart.setUTCHours(0, 0, 0, 0);
      const dayStartTimestamp = Math.floor(dayStart.getTime() / 1000);
      
      const dayEnd = new Date(date);
      dayEnd.setUTCHours(23, 59, 59, 999);
      const dayEndTimestamp = Math.floor(dayEnd.getTime() / 1000);

      // Fetch top 20 events ordered by rewardAmount descending
      // Trust The Graph's API to return the correct top 20 records
      const EVENTS_QUERY = `{
                rewardRequesteds(
                    where: {
                        blockTimestamp_gte: ${dayStartTimestamp},
                        blockTimestamp_lte: ${dayEndTimestamp}
                    }
                    orderBy: rewardAmount
                    orderDirection: desc
                    first: 20
                ) {
                    id
                    contributorAddress
                    fileId
                    rewardAmount
                    blockNumber
                    blockTimestamp
                    transactionHash
                }
            }`;
      
      // Check if this request is still current before fetch
      if (currentRequestId !== requestId) {
        return;
      }
      
      const data = await fetchDlpGraph({ query: EVENTS_QUERY });
      
      // Check again after async operation
      if (currentRequestId !== requestId) {
        return;
      }
      
      // Only update state if this is still the current request
      if (currentRequestId === requestId) {
        // Map events - no sorting needed, The Graph API already returns them in the correct order
        const mappedEvents = (data.data?.rewardRequesteds || [])
          .map((event) => ({
            id: event.id,
            contributorAddress: event.contributorAddress,
            fileId: event.fileId,
            rewardAmount: event.rewardAmount ? parseFloat(event.rewardAmount) / 1e18 : 0,
            blockNumber: event.blockNumber || "",
            blockTimestamp: event.blockTimestamp || "",
            transactionHash: event.transactionHash || "",
            hasRewardAmount: !!event.rewardAmount,
            hasBlockTimestamp: !!event.blockTimestamp,
          }));
        
        dailyEvents = mappedEvents;
      }
    } catch (error) {
      console.error("Error fetching daily events:", error);
      // Only clear events if this is still the current request
      if (currentRequestId === requestId) {
        dailyEvents = [];
      }
    } finally {
      // Only update loading state if this is still the current request
      if (currentRequestId === requestId) {
        isLoadingDailyEvents = false;
      }
    }
  };

  onMount(() => {
    fetchData();
  });
</script>

<div class="flex flex-col justify-start items-stretch gap-8">
  <Card.Root>
    <Card.Header>
      <div class="w-full flex flex-row justify-between items-center">
        <div class="flex flex-col gap-2">
          <Card.Title>VFSN Token Emission</Card.Title>
          <Card.Description>Total VFSN rewards per day (last {getDaysFilter()} days)</Card.Description>
        </div>
        <div class="flex flex-row justify-start items-center gap-x-8">
          <ToggleGroup.Root type="single" bind:value={getDaysFilter, setDaysFilter} class="h-input rounded-xl border-border flex items-center gap-x-2 border px-2 py-1">
            <ToggleGroup.Item
              value="7"
              class="rounded-xl hover:cursor-pointer p-2 active:bg-dark-10 data-[state=on]:bg-muted data-[state=off]:text-foreground-alt data-[state=on]:text-foreground active:data-[state=on]:bg-dark-10 transition-all active:scale-[0.98]"
            >
              Last 7 days
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="30"
              class="rounded-xl hover:cursor-pointer p-2 active:bg-dark-10 data-[state=on]:bg-muted data-[state=off]:text-foreground-alt data-[state=on]:text-foreground active:data-[state=on]:bg-dark-10 transition-all active:scale-[0.98]"
            >
              Last 30 days
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="60"
              class="rounded-xl hover:cursor-pointer p-2 active:bg-dark-10 data-[state=on]:bg-muted data-[state=off]:text-foreground-alt data-[state=on]:text-foreground active:data-[state=on]:bg-dark-10 transition-all active:scale-[0.98]"
            >
              Last 60 days
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="90"
              class="rounded-xl hover:cursor-pointer p-2 active:bg-dark-10 data-[state=on]:bg-muted data-[state=off]:text-foreground-alt data-[state=on]:text-foreground active:data-[state=on]:bg-dark-10 transition-all active:scale-[0.98]"
            >
              Last 90 days
            </ToggleGroup.Item>
          </ToggleGroup.Root>
          <Button class="bg-transparent cursor-pointer hover:bg-background" disabled={isLoading} onclick={() => fetchData()}>
            <RefreshCwIcon class="h-4 w-4 text-foreground" />
          </Button>
        </div>
      </div>
    </Card.Header>

    <Card.Content>
      <div class="mb-4 text-sm text-muted-foreground">
        Click on any data point in the chart to view the top 20 reward events for that day, sorted by reward amount (most recent transactions shown first when amounts are equal).
      </div>
      <VfsnTokenEmissionChart data={chartData} onDateSelect={handleDateSelect} />
      
      {#if selectedDate}
        <div class="mt-8 border-t pt-6">
          <div class="flex flex-col gap-4">
            <div class="flex flex-row justify-between items-center">
              <div class="flex flex-col gap-1">
                <h3 class="text-lg font-semibold">
                  Top 20 Rewards for {(() => {
                    // Calculate UTC day start (same logic as fetchDailyEvents) and format in UTC
                    const utcDayStart = new Date(selectedDate);
                    utcDayStart.setUTCHours(0, 0, 0, 0);
                    // Use UTC timestamp to ensure UTC formatting
                    return dayjs.unix(Math.floor(utcDayStart.getTime() / 1000)).utc().format("MMMM D, YYYY");
                  })()}
                </h3>
                <p class="text-sm text-muted-foreground">
                  Sorted by reward amount (most recent shown first when amounts are equal)
                </p>
              </div>
              <Button 
                class="bg-transparent cursor-pointer hover:bg-background"
                onclick={() => {
                  selectedDate = null;
                  currentRequestId = null;
                  dailyEvents = [];
                }}
              >
                Close
              </Button>
            </div>
            
            {#if isLoadingDailyEvents}
              <div class="text-center py-4">Loading events...</div>
            {:else if dailyEvents.length === 0}
              <div class="text-center py-4 text-muted-foreground">No reward events found for this day.</div>
            {:else}
              <div class="overflow-x-auto">
                <table class="w-full border-collapse">
                  <thead>
                    <tr class="border-b">
                      <th class="text-left p-2">Contributor</th>
                      <th class="text-left p-2">File ID</th>
                      <th class="text-right p-2">Reward Amount</th>
                      <th class="text-left p-2">Time (UTC)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each dailyEvents as event}
                      <tr class="border-b hover:bg-muted/50">
                        <td class="p-2 font-mono text-sm">
                          {event.contributorAddress.slice(0, 6)}...{event.contributorAddress.slice(-4)}
                        </td>
                        <td class="p-2">{event.fileId}</td>
                        <td class="p-2 text-right font-semibold">
                          {event.hasRewardAmount ? event.rewardAmount.toFixed(4) : "N/A"} VFSN
                        </td>
                        <td class="p-2 text-sm text-muted-foreground">
                          {event.hasBlockTimestamp ? dayjs.unix(parseInt(event.blockTimestamp)).utc().format("HH:mm:ss") : "N/A"}
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </Card.Content>

    <Card.Footer>
      <slot name="footer" />
    </Card.Footer>
  </Card.Root>
</div>
