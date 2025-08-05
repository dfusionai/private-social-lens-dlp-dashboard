<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { stakeEventsActions } from "$lib/stores/stakeEventsStore";
  import { RefreshCwIcon } from "@lucide/svelte";
  import dayjs from "dayjs";
  import { onMount } from "svelte";
  import { fetchStakingGraph } from "../../../../api/subgraph-staking";
  import StakingMovementChart from "./staking-movement-chart.svelte";

  let isLoading = $state(false);

  let chartData = $state<
    Array<{
      date: Date;
      stakedAmount: number;
      unstakedAmount: number;
      netMovement: number;
    }>
  >([]);

  // const store = $stakeEventsStore;

  // Update this to handle all three metrics
  const fetchData = async () => {
    try {
      isLoading = true;
      const STAKING_QUERY = `{
    tokensStakeds(first: 5, orderBy: blockTimestamp, orderDirection: desc) {
        id
        user
        amount
        startTime
    }
    tokensUnstakeds(first: 5, orderBy: blockTimestamp, orderDirection: desc) {
        id
        user
        amount
        blockNumber
    }
    stakeEntries(where: { hasWithdrawn: false }) {
        id
        user {
            id
        }
        amount
        startTime
        duration
        createdAtTimestamp
    }
    dailyStakingMetrics(orderBy: date, orderDirection: desc, first: 30) {
        id
        date
        stakedAmount
        unstakedAmount
        netMovement
    }
}`;
      // TODO
      const data = await fetchStakingGraph({ query: STAKING_QUERY });

      chartData = data.data.dailyStakingMetrics.map((item) => ({
        date: dayjs.unix(parseInt(item.date)).toDate(),
        stakedAmount: parseFloat(item.stakedAmount) / 1e18,
        unstakedAmount: parseFloat(item.unstakedAmount) / 1e18,
        netMovement: parseFloat(item.netMovement) / 1e18,
      }));

      // stakeEventsActions.setStakeOnWeek(chartData);
    } catch (error) {
      console.error("Error fetching staking metrics:", error);
    } finally {
      isLoading = false;
      stakeEventsActions.setLoading(false);
    }
  };

  onMount(async () => {
    await fetchData();
  });
</script>

<div class="flex flex-col justify-start items-stretch gap-8">
  <div class="absolute top-24 right-10">
    <Button class="bg-transparent cursor-pointer hover:bg-background" disabled={isLoading} onclick={() => fetchData()}>
      <RefreshCwIcon class="h-4 w-4 text-foreground" />
    </Button>
  </div>
  <StakingMovementChart data={chartData} />
</div>
