<script lang="ts">
    import LineChart from "$lib/components/common/line-chart/line-chart.svelte";
    import type { ITrendingData } from "../chart-footer/type";
    import * as Chart from "$lib/components/ui/chart/index.js";
    import { rewardEventsStore } from "$lib/stores/rewardEventsStore";
    import ChartFooter from "../chart-footer/chart-footer.svelte";
    import {
        calculateStakeAmount,
        generateRewardLatestWeeks,
        generateWeekTrendingData,
    } from "../../utils";
    import { weekVisConfig } from "../../const";

    let weekChartData: { date: Date; amount: number }[] = $state(
        generateRewardLatestWeeks()
    );

    let weekTrendingData: ITrendingData = $state({
        percent: "0",
        isUp: false,
        timeDuration: {
            from: "",
            to: "",
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
        if (!state.contributorRewardEventsInWeeks) return;

        const contributorRewardAmount = calculateStakeAmount(
            state.contributorRewardEventsInWeeks || []
        );
        weekChartData = weekChartData.map((item, index) => ({
            ...item,
            amount: contributorRewardAmount[index] || 0,
        }));
        weekTrendingData = generateWeekTrendingData(weekChartData);
    });
</script>

<LineChart
    className="h-[300px] w-full"
    title="Reward Contributor"
    description={`Showing total reward contributor for the last 4 weeks`}
    chartConfig={ChartConfig}
    data={weekChartData}
    props={weekVisConfig}
    {series}
    {isLoading}
>
    <ChartFooter slot="footer" trendingData={weekTrendingData} />
</LineChart>
