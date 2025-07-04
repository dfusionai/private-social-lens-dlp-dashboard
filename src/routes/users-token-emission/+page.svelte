<script lang="ts">
    import TokenEmissionChartMonth from "./components/token-emission-chart-month/token-emission-chart-month.svelte";
    import TokenEmissionChartWeek from "./components/token-emission-chart-week/token-emission-chart-week.svelte";
</script>

<div class="flex flex-col gap-8">
    <TokenEmissionChartWeek />
    <TokenEmissionChartMonth />
</div>
