<script lang="ts">
    import { onMount } from "svelte";
    import LineChart from "$lib/components/common/line-chart/line-chart.svelte";
    import DatePicker from "$lib/components/common/date-picker/date-picker.svelte";
    import { generateDailyChartData, getDateGap } from "$lib/utils.js";
    import { ChartConfig, series, monthVisConfig } from "../../const";
    import { fetchStakingEventForDate } from "../../../../api/fetchStakingEventForDate";
    import {
        stakeEventsActions,
        stakeEventsStore,
    } from "$lib/stores/stakeEventsStore";
    import { daysPerMonth, fromIndex } from "$lib/const";

    let chartData = $state(generateDailyChartData(fromIndex, daysPerMonth));

    const store = $stakeEventsStore;
    let isLoading = $state(false);
    let selectedDateIndex = $state<number>(0);

    const onChooseDate = (date: string) => {
        if (!date) return;

        const dateGap = getDateGap(new Date(), new Date(date));

        if (dateGap !== selectedDateIndex) {
            selectedDateIndex = dateGap;
            store.stakeOnMonth = null;
        }
    };

    const fetchData = async (selectedDateIndex: number) => {
        if (store.stakeOnMonth) {
            chartData = store.stakeOnMonth;
            return;
        }

        try {
            isLoading = true;

            let chartMonthData = generateDailyChartData(
                selectedDateIndex,
                selectedDateIndex + daysPerMonth
            );

            const mid = Math.ceil(chartMonthData.length / 2);

            const [firstHalf, secondHalf] = [
                chartMonthData.slice(0, mid),
                chartMonthData.slice(mid),
            ];

            const promises = firstHalf.map((item) =>
                fetchStakingEventForDate(item.date)
            );

            const monthData = await Promise.all(promises);

            const nextPromises = secondHalf.map((item) =>
                fetchStakingEventForDate(item.date)
            );

            const nextMonthData = await Promise.all(nextPromises);

            const mergedMonthData = [...monthData, ...nextMonthData];

            chartMonthData = chartMonthData.map((item, index) => ({
                ...item,
                amount: mergedMonthData[index].totalStake || 0,
            }));

            stakeEventsActions.setStakeOnMonth(chartMonthData);
            chartData = chartMonthData;
        } catch (error) {
            throw error;
        } finally {
            isLoading = false;
        }
    };

    $effect(() => {
        fetchData(selectedDateIndex);
    });

    onMount(async () => {});
</script>

<div>
    <div class="flex justify-end mb-4 items-center">
        <span class="mr-2 text-muted-foreground"
            >Data shown 30 days back from
        </span>

        <DatePicker {onChooseDate} disabled={isLoading} />
    </div>

    <LineChart
        className="h-[300px] w-full"
        title="Staking Token Movement Through A Month"
        description="Total staking token movement per day"
        chartConfig={ChartConfig}
        data={chartData}
        props={monthVisConfig}
        {series}
        {isLoading}
    />
</div>
