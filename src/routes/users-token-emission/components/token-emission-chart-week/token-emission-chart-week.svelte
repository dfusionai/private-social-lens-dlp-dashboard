<script lang="ts">
    import LineChart from "$lib/components/common/line-chart/line-chart.svelte";
    import {
        tokenEmissionActions,
        tokenEmissionStore,
    } from "$lib/stores/tokenEmissionStore";
    import { onMount } from "svelte";
    import { fetchRewardRequestForDate } from "../../../../api/fetchRewardRequestForDate";
    import { ChartConfig, series, weekVisConfig } from "../../const";
    import { generateDailyChartData } from "$lib/utils";
    import { fromIndex, lastWeekDayInx } from "$lib/const";

    let chartData = $state(generateDailyChartData(fromIndex, lastWeekDayInx));

    let isLoading = $state(false);

    const store = $tokenEmissionStore;

    onMount(async () => {
        if (store.rewardOnWeek) {
            chartData = store.rewardOnWeek;
            return;
        }

        try {
            isLoading = true;

            let chartWeekData = generateDailyChartData(
                fromIndex,
                lastWeekDayInx
            );

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
