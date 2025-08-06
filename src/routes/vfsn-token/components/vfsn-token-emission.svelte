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

      const currentDate = new Date();

      const thirtyDaysAgo = new Date(currentDate);
      thirtyDaysAgo.setDate(currentDate.getDate() - (Number(daysFilter) - 1));
      thirtyDaysAgo.setHours(0, 0, 0, 0);
      const startOfNDaysAgo = thirtyDaysAgo.getTime();
      currentDate.setHours(23, 59, 59, 0);
      const endOfCurrentDate = currentDate.getTime();

      const DLP_QUERY = `{
                rewardRequesteds(first: 5) {
                    id
                    contributorAddress
                    fileId
                    proofIndex
                }
                dailyRewardMetrics(
                    where: {
                        date_gt: ${startOfNDaysAgo / 1000},
                        date_lt: ${endOfCurrentDate / 1000}
                    }
                    orderBy: date
                    orderDirection: asc
                ) {
                    date
                    totalRewardAmount
                }
            }`;
      const data = await fetchDlpGraph({ query: DLP_QUERY });

      chartData = data.data.dailyRewardMetrics.map((item) => ({
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
      <VfsnTokenEmissionChart data={chartData} />
    </Card.Content>

    <Card.Footer>
      <slot name="footer" />
    </Card.Footer>
  </Card.Root>
</div>
