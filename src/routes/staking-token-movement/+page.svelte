<script lang="ts">
    import StatisticGrid from "./components/statistic-grid/statistic-grid.svelte";
    import StakingMovementChartWeek from "./components/staking-movement-chart-week/staking-movement-chart-week.svelte";
    import StakingMovementChartMonth from "./components/staking-movement-chart-month/staking-movement-chart-month.svelte";
</script>

<div>
    <div class="mb-8"><StatisticGrid /></div>
    <div class="flex flex-col gap-8">
        <StakingMovementChartWeek />
        <StakingMovementChartMonth />
    </div>
</div>