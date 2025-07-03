<script lang="ts">
    import LineChart from "$lib/components/common/line-chart/line-chart.svelte";
    import ChartFooter from "../chart-footer/chart-footer.svelte";
    import {
        calculateStakeAmount,
        generateRewardLatestMonths,
        generateTrendingData,
    } from "../../utils";
    import type { ITrendingData } from "../chart-footer/type";
    import * as Chart from "$lib/components/ui/chart/index.js";
    import { defaultVisConfig } from "$lib/components/common/line-chart/const";
    import { rewardEventsStore } from "$lib/stores/rewardEventsStore";

    let chartData: { date: Date; amount: number }[] = $state(
        generateRewardLatestMonths()
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
        amount: { label: "Reward Amount", color: "var(--chart-1)" },
    } satisfies Chart.ChartConfig;

    const series = [
        {
            key: "amount",
            label: "Reward Amount",
            color: ChartConfig.amount.color,
        },
    ];

    let isLoading = $state(false);

    rewardEventsStore.subscribe((state) => {
        isLoading = state.loading;

        if (!state.contributorRewardEvents) return;

        const rewardAmount = calculateStakeAmount(
            state.contributorRewardEvents || []
        );

        // Update chart data with calculated amounts
        chartData = chartData.map((item, index) => ({
            ...item,
            amount: rewardAmount[index] || 0,
        }));

        trendingData = generateTrendingData(chartData);
    });
</script>

<LineChart
    className="h-[300px] w-full"
    title="Reward Contributor"
    description={`Showing total reward contributor for the last 6 months`}
    chartConfig={ChartConfig}
    data={chartData}
    props={defaultVisConfig}
    {series}
    {isLoading}
>
    <ChartFooter slot="footer" {trendingData} />
</LineChart>
