<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { stakeEventsActions } from "$lib/stores/stakeEventsStore";
  import { RefreshCwIcon } from "@lucide/svelte";
  import dayjs from "dayjs";
  import { onMount } from "svelte";
  import { fetchDlpGraph } from "../../../../api/subgraph-dlp";
  import VfsnTokenEmissionChart from "./vfsn-token-emission-chart.svelte";

  let isLoading = $state(false);

  let chartData = $state<
    Array<{
      date: Date;
      rewardAmount: number;
    }>
  >([]);

  const fetchData = async () => {
    try {
      isLoading = true;

      const currentDate = new Date();

      const thirtyDaysAgo = new Date(currentDate);
      thirtyDaysAgo.setDate(currentDate.getDate() - 29);
      thirtyDaysAgo.setHours(0, 0, 0, 0);
      const startOfThirtyDaysAgo = thirtyDaysAgo.getTime();
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
                        date_gt: ${startOfThirtyDaysAgo / 1000},
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
  <div class="absolute top-64 right-10">
    <Button class="bg-transparent cursor-pointer hover:bg-background" disabled={isLoading} onclick={() => fetchData()}>
      <RefreshCwIcon class="h-4 w-4 text-foreground" />
    </Button>
  </div>
  <VfsnTokenEmissionChart data={chartData} />
</div>
