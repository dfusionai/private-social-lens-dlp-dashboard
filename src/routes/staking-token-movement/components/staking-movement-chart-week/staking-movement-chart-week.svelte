<script lang="ts">
    import LineChart from "$lib/components/common/line-chart/line-chart.svelte";
    import { onMount } from "svelte";
    import { generateDailyChartData } from "$lib/utils";
    import { fetchStakingEventForDate } from "../../../../api/fetchStakingEventForDate";
    import { ChartConfig, series, weekVisConfig } from "../../const";
    import {
        stakeEventsActions,
        stakeEventsStore,
    } from "$lib/stores/stakeEventsStore";

    let chartData = $state(generateDailyChartData(0, 6));

    let isLoading = $state(false);

    const store = $stakeEventsStore;

    onMount(async () => {
        if (store.stakeOnWeek) {
            chartData = store.stakeOnWeek;
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
                fetchStakingEventForDate(item.date)
            );

            const weekData = await Promise.all(promises);

            const nextPromises = secondHalf.map((item) =>
                fetchStakingEventForDate(item.date)
            );

            const nextWeekData = await Promise.all(nextPromises);

            const mergedWeekData = [...weekData, ...nextWeekData];

            chartWeekData = chartWeekData.map((item, index) => ({
                ...item,
                amount: mergedWeekData[index].totalStake || 0,
            }));

            chartData = chartWeekData;
            stakeEventsActions.setStakeOnWeek(chartWeekData);
        } catch (error) {
            throw error;
        } finally {
            isLoading = false;
            stakeEventsActions.setLoading(false);
        }
    });
</script>

<LineChart
    className="h-[300px] w-full"
    title="Staking Token Movement Through A Week"
    description="Total staking token movement per day"
    chartConfig={ChartConfig}
    data={chartData}
    props={weekVisConfig}
    {series}
    {isLoading}
/>
