<script lang="ts">
    import TokenEmissionChartMonth from "./components/token-emission-chart-month/token-emission-chart-month.svelte";
    import TokenEmissionChartWeek from "./components/token-emission-chart-week/token-emission-chart-week.svelte";
    import StatisticsGrid from "./components/statistic-grid/statistic-grid.svelte";
    import DailyUniqueContributors from "./components/daily-unique-contributors/daily-unique-contributors.svelte";
    import ChatStats from "./components/chat-stats/chat-stats.svelte";
  import CurrentRewardPool from "../staking-token-movement/components/statistic-grid/current-reward-pool.svelte";
  import VfsnTokenEmission from "./components/vfsn-token-emission/vfsn-token-emission.svelte";
</script>

<div class="flex flex-col justify-start items-stretch gap-8">
    <!-- <StatisticsGrid />
    <ChatStats />
    <DailyUniqueContributors />
    <TokenEmissionChartMonth />
    <TokenEmissionChartWeek /> -->

    <div class="w-1/2">
        <CurrentRewardPool />
    </div>

    <div>
        <VfsnTokenEmission />
    </div>
</div>
