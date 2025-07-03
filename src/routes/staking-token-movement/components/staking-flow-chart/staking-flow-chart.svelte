<script lang="ts">
    import LineChart from "$lib/components/common/line-chart/line-chart.svelte";
    import ChartFooter from "../chart-footer/chart-footer.svelte";
    import {
        calculateStakeAmount,
        generateLatestMonths,
        generateTrendingData,
    } from "../../utils";
    import * as Chart from "$lib/components/ui/chart/index.js";
    import { stakeEventsStore } from "$lib/stores/stakeEventsStore";
    import { defaultVisConfig } from "$lib/components/common/line-chart/const";
    import type { ITrendingData } from "../../type";

    let chartData: { date: Date; amount: number }[] = $state(
        generateLatestMonths()
    );

    let trendingData: ITrendingData = $state({
        percent: "0",
        isUp: false,
        timeDuration: {
            from: "",
            to: "",
            year: "",
        },
    });

    const ChartConfig = {
        amount: { label: "Staking Amount", color: "var(--chart-1)" },
    } satisfies Chart.ChartConfig;

    const series = [
        {
            key: "amount",
            label: "Staking Amount",
            color: ChartConfig.amount.color,
        },
    ];

    let isLoading = $state(false);

    stakeEventsStore.subscribe((state) => {
        isLoading = state.loading;

        if (!state.stakeEvents) return;

        const stakeAmount = calculateStakeAmount(state.stakeEvents || []);

        // Update chart data with calculated amounts
        chartData = chartData.map((item, index) => ({
            ...item,
            amount: stakeAmount[index] || 0,
        }));

        trendingData = generateTrendingData(chartData);
    });
</script>

<LineChart
    className="h-[300px] w-full"
    title="Staking Through Time"
    description={`Showing total staking amount for the last 6 months`}
    chartConfig={ChartConfig}
    data={chartData}
    props={defaultVisConfig}
    {series}
    {isLoading}
>
    <ChartFooter slot="footer" {trendingData} />
</LineChart>
