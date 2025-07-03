<script lang="ts">
    import LineChart from "$lib/components/common/line-chart/line-chart.svelte";
    import type { ITrendingData } from "../chart-footer/type";
    import * as Chart from "$lib/components/ui/chart/index.js";
    import { stakeEventsStore } from "$lib/stores/stakeEventsStore";
    import { weekVisConfig } from "../../const";
    import ChartFooter from "../chart-footer/chart-footer.svelte";
    import {
        calculateStakeAmount,
        generateLatestWeeks,
        generateWeekTrendingData,
    } from "../../utils";

    let weekChartData: { date: Date; amount: number }[] = $state(
        generateLatestWeeks()
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
        if (!state.stakeEventsInWeeks) {
            return;
        }

        const stakeAmountInWeeks = calculateStakeAmount(
            state.stakeEventsInWeeks || []
        );

        weekChartData = weekChartData.map((item, index) => ({
            ...item,
            amount: stakeAmountInWeeks[index] || 0,
        }));

        weekTrendingData = generateWeekTrendingData(weekChartData);
    });
</script>

<LineChart
    className="h-[300px] w-full"
    title="Staking Through Time"
    description={`Showing total staking amount for the last 4 weeks`}
    chartConfig={ChartConfig}
    data={weekChartData}
    props={weekVisConfig}
    {series}
    {isLoading}
>
    <ChartFooter slot="footer" trendingData={weekTrendingData} />
</LineChart>
