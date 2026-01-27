<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { stakeEventsActions } from "$lib/stores/stakeEventsStore";
  import { RefreshCwIcon } from "@lucide/svelte";
  import dayjs from "dayjs";
  import { onMount } from "svelte";
  import { fetchDlpGraph } from "../../../api/subgraph-dlp";
  import VfsnTokenEmissionChart from "./vfsn-token-emission-chart.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { ToggleGroup } from "bits-ui";

  let isLoading = $state(false);
  let isLoadingDailyEvents = $state(false);
  let selectedDate = $state<Date | null>(null);
  let dailyEvents = $state<
    Array<{
      id: string;
      contributorAddress: string;
      fileId: string;
      proofIndex: string;
      rewardAmount: number;
      blockNumber: string;
      blockTimestamp: string;
      transactionHash: string;
    }>
  >([]);

  let chartData = $state<
    Array<{
      date: Date;
      rewardAmount: number;
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
      const thirtyDaysAgo = new Date(currentDate);
      thirtyDaysAgo.setUTCDate(currentDate.getUTCDate() - (Number(daysFilter) - 1));
      thirtyDaysAgo.setUTCHours(0, 0, 0, 0);
      const startOfNDaysAgo = Math.floor(thirtyDaysAgo.getTime() / 1000); // Convert to seconds (UTC)
      currentDate.setUTCHours(23, 59, 59, 999);
      const endOfCurrentDate = Math.floor(currentDate.getTime() / 1000); // Convert to seconds (UTC)

      // Fetch all records using pagination (max 1000 per query)
      const allDailyMetrics: Array<{ date: string; totalRewardAmount: string }> = [];
      const pageSize = 1000;
      let skip = 0;
      let hasMore = true;

      while (hasMore) {
        const DLP_QUERY = `{
                    dailyRewardMetrics(
                        where: {
                            date_gt: ${startOfNDaysAgo},
                            date_lt: ${endOfCurrentDate}
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
      }));

      // stakeEventsActions.setStakeOnWeek(chartData);
    } catch (error) {
      console.error("Error fetching staking metrics:", error);
    } finally {
      isLoading = false;
      stakeEventsActions.setLoading(false);
    }
  };

  const handleDateSelect = async (date: Date) => {
    selectedDate = date;
    await fetchDailyEvents(date);
  };

  const fetchDailyEvents = async (date: Date) => {
    try {
      isLoadingDailyEvents = true;
      
      // Calculate UTC day start and end for the selected date
      const dayStart = new Date(date);
      dayStart.setUTCHours(0, 0, 0, 0);
      const dayStartTimestamp = Math.floor(dayStart.getTime() / 1000);
      
      const dayEnd = new Date(date);
      dayEnd.setUTCHours(23, 59, 59, 999);
      const dayEndTimestamp = Math.floor(dayEnd.getTime() / 1000);

      // Fetch all rewardRequested events for this day with pagination
      const allEvents: Array<{
        id: string;
        contributorAddress: string;
        fileId: string;
        proofIndex: string;
        rewardAmount: string;
        blockNumber: string;
        blockTimestamp: string;
        transactionHash: string;
      }> = [];
      const pageSize = 1000;
      let skip = 0;
      let hasMore = true;

      while (hasMore) {
        const EVENTS_QUERY = `{
                    rewardRequesteds(
                        where: {
                            blockTimestamp_gte: ${dayStartTimestamp},
                            blockTimestamp_lte: ${dayEndTimestamp}
                        }
                        orderBy: blockTimestamp
                        orderDirection: asc
                        first: ${pageSize}
                        skip: ${skip}
                    ) {
                        id
                        contributorAddress
                        fileId
                        proofIndex
                        rewardAmount
                        blockNumber
                        blockTimestamp
                        transactionHash
                    }
                }`;
        
        const data = await fetchDlpGraph({ query: EVENTS_QUERY });
        
        if (data.data && data.data.rewardRequesteds) {
          const events = data.data.rewardRequesteds;
          allEvents.push(...events);
          
          if (events.length < pageSize) {
            hasMore = false;
          } else {
            skip += pageSize;
          }
        } else {
          hasMore = false;
        }
      }

      dailyEvents = allEvents.map((event) => ({
        id: event.id,
        contributorAddress: event.contributorAddress,
        fileId: event.fileId,
        proofIndex: event.proofIndex,
        rewardAmount: parseFloat(event.rewardAmount) / 1e18,
        blockNumber: event.blockNumber,
        blockTimestamp: event.blockTimestamp,
        transactionHash: event.transactionHash,
      }));
    } catch (error) {
      console.error("Error fetching daily events:", error);
      dailyEvents = [];
    } finally {
      isLoadingDailyEvents = false;
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
      <VfsnTokenEmissionChart data={chartData} onDateSelect={handleDateSelect} />
      
      {#if selectedDate}
        <div class="mt-8 border-t pt-6">
          <div class="flex flex-col gap-4">
            <div class="flex flex-row justify-between items-center">
              <h3 class="text-lg font-semibold">
                Individual Rewards for {dayjs(selectedDate).format("MMMM D, YYYY")}
              </h3>
              <Button 
                class="bg-transparent cursor-pointer hover:bg-background"
                onclick={() => {
                  selectedDate = null;
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
                      <th class="text-left p-2">Proof Index</th>
                      <th class="text-right p-2">Reward Amount</th>
                      <th class="text-left p-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each dailyEvents as event}
                      <tr class="border-b hover:bg-muted/50">
                        <td class="p-2 font-mono text-sm">
                          {event.contributorAddress.slice(0, 6)}...{event.contributorAddress.slice(-4)}
                        </td>
                        <td class="p-2">{event.fileId}</td>
                        <td class="p-2">{event.proofIndex}</td>
                        <td class="p-2 text-right font-semibold">{event.rewardAmount.toFixed(4)} VFSN</td>
                        <td class="p-2 text-sm text-muted-foreground">
                          {dayjs.unix(parseInt(event.blockTimestamp)).format("HH:mm:ss")}
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                  <tfoot>
                    <tr class="border-t font-semibold">
                      <td colspan="3" class="p-2 text-right">Total:</td>
                      <td class="p-2 text-right">
                        {dailyEvents.reduce((sum, e) => sum + e.rewardAmount, 0).toFixed(4)} VFSN
                      </td>
                      <td class="p-2"></td>
                    </tr>
                  </tfoot>
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
