<script lang="ts">
    import LineChart from "$lib/components/common/line-chart/line-chart.svelte";
    import {
        tokenEmissionActions,
        tokenEmissionStore,
    } from "$lib/stores/tokenEmissionStore";
    import { onMount } from "svelte";
    import { generateDailyChartData } from "$lib/utils";
    import { fromIndex, lastWeekDayInx } from "$lib/const";
    import Button from "$lib/components/ui/button/button.svelte";
    import { RefreshCwIcon } from "@lucide/svelte";
    import { fetchRewardRequestForDate } from "../../../../api/fetchRewardRequestForDate";
    import { ChartConfig, series, weekVisConfig } from "../../const";

    let chartData = $state(generateDailyChartData(fromIndex, lastWeekDayInx));

    let isLoading = $state(false);

    const store = $tokenEmissionStore;

    const fetchData = async () => {
        let chartWeekData = generateDailyChartData(fromIndex, lastWeekDayInx);

        try {
            isLoading = true;

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
            chartData = chartWeekData;
            throw error;
        } finally {
            isLoading = false;
            tokenEmissionActions.setLoading(false);
        }
    };

    onMount(() => {
        if (store.rewardOnWeek) {
            chartData = store.rewardOnWeek;
            return;
        }
        fetchData();
    });
</script>

<div class="relative">
    <LineChart
        className="h-[300px] w-full"
        title="Token Emission Through A Week (7 latest days)"
        description="Total token rewards distributed per day"
        chartConfig={ChartConfig}
        data={chartData}
        props={weekVisConfig}
        {series}
        {isLoading}
    />

    <Button
        class="bg-transparent cursor-pointer hover:bg-background absolute top-4 right-4"
        disabled={isLoading}
        onclick={() => fetchData()}
    >
        <RefreshCwIcon class="h-4 w-4 text-foreground" />
    </Button>
</div>
