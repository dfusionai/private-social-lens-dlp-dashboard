<script lang="ts">
    import LineChart from "$lib/components/common/line-chart/line-chart.svelte";
    import type { LineChartPropsObjProp } from "layerchart";
    import { defaultVisConfig } from "$lib/components/common/line-chart/const";
    import {
        tokenEmissionActions,
        tokenEmissionStore,
    } from "$lib/stores/tokenEmissionStore";
    import { onMount } from "svelte";
    import { fetchRewardRequestForDate } from "../../../../api/fetchRewardRequestForDate";
    import { generateDailyChartData } from "../../utils";
    import { ChartConfig, series } from "../../const";

    let chartData = $state(generateDailyChartData(0, 6));

    const weekVisConfig: LineChartPropsObjProp = {
        ...defaultVisConfig,
        xAxis: {
            format: (v: Date) => {
                return v.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                });
            },
            ticks: 7,
        },
    };

    let isLoading = $state(false);
    const store = $tokenEmissionStore;

    onMount(async () => {
        if (store.rewardOnWeek) {
            return;
        }

        try {
            isLoading = true;

            let chartWeekData = generateDailyChartData(0, 6);

            const mid = Math.ceil(chartWeekData.length / 2);

            const [firstHalf, secondHalf] = [
                chartWeekData.slice(0, mid),
                chartWeekData.slice(mid),
            ];

            const promises = firstHalf.map((item) =>
                fetchRewardRequestForDate(item.date)
            );

            const weekData = await Promise.all(promises);

            const nextPromises = secondHalf.map((item) =>
                fetchRewardRequestForDate(item.date)
            );

            const nextWeekData = await Promise.all(nextPromises);

            const mergedWeekData = [...weekData, ...nextWeekData];

            chartWeekData = chartWeekData.map((item, index) => ({
                ...item,
                amount: mergedWeekData[index].totalReward || 0,
            }));

            chartData = chartWeekData;
            tokenEmissionActions.setRewardOnWeek(chartWeekData);
        } catch (error) {
            throw error;
        } finally {
            isLoading = false;
            tokenEmissionActions.setLoading(false);
        }
    });
</script>

<LineChart
    className="h-[300px] w-full"
    title="Token Emission Through A Week"
    description="Total token rewards distributed per day"
    chartConfig={ChartConfig}
    data={chartData}
    props={weekVisConfig}
    {series}
    {isLoading}
/>
