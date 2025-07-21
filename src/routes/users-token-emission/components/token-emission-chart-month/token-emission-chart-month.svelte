<script lang="ts">
    import { onMount } from "svelte";
    import LineChart from "$lib/components/common/line-chart/line-chart.svelte";
    import {
        tokenEmissionActions,
        tokenEmissionStore,
    } from "$lib/stores/tokenEmissionStore";
    import DatePicker from "$lib/components/common/date-picker/date-picker.svelte";
    import {
        formatDate,
        generateDailyChartData,
        getDateGap,
    } from "$lib/utils.js";
    import { daysPerMonth, fromIndex } from "$lib/const";
    import { fetchRewardRequestForDate } from "../../../../api/fetchRewardRequestForDate";
    import { ChartConfig, series, monthVisConfig } from "../../const";
    import Button from "$lib/components/ui/button/button.svelte";
    import { RefreshCwIcon } from "@lucide/svelte";
    import {
        today,
        getLocalTimeZone,
        parseDate,
        type DateValue,
        CalendarDate,
    } from "@internationalized/date";

    let chartData = $state(generateDailyChartData(fromIndex, daysPerMonth));

    const store = $tokenEmissionStore;
    // date index from today, ex: 30 --> 30 days ago
    let selectedDateIndex = $state<number>(0);
    let currentDate = $state(today(getLocalTimeZone()));
    let isLoading = $state(false);

    const onChooseDate = (date: DateValue) => {
        if (!date) return;

        const dateValue = date.toDate(getLocalTimeZone());
        const dateGap = getDateGap(new Date(), dateValue);

        if (dateGap !== selectedDateIndex) {
            selectedDateIndex = dateGap;
            currentDate = date as CalendarDate;
            fetchData(dateGap);
        }
    };

    const fetchData = async (selectedDateIndex: number) => {
        let chartMonthData = generateDailyChartData(
            selectedDateIndex,
            selectedDateIndex + daysPerMonth
        );

        try {
            isLoading = true;

            const mid = Math.ceil(chartMonthData.length / 2);

            const [firstHalf, secondHalf] = [
                chartMonthData.slice(0, mid),
                chartMonthData.slice(mid),
            ];

            const promises = firstHalf.map((item) =>
                fetchRewardRequestForDate(item.date)
            );

            const monthData = await Promise.all(promises);

            const nextPromises = secondHalf.map((item) =>
                fetchRewardRequestForDate(item.date)
            );

            const nextMonthData = await Promise.all(nextPromises);

            const mergedMonthData = [...monthData, ...nextMonthData];

            chartMonthData = chartMonthData.map((item, index) => ({
                ...item,
                amount: mergedMonthData[index].totalReward || 0,
            }));

            tokenEmissionActions.setRewardOnMonth(chartMonthData);
            chartData = chartMonthData;
        } catch (error) {
            chartData = chartMonthData;
            throw error;
        } finally {
            isLoading = false;
        }
    };

    onMount(() => {
        if (store.rewardOnMonth) {
            chartData = store.rewardOnMonth;
            const lastDate = formatDate(
                chartData[chartData.length - 1].date,
                "YMD_DASH"
            );
            currentDate = parseDate(lastDate);
            return;
        }
        fetchData(selectedDateIndex);
    });
</script>

<div>
    <div class="flex justify-end mb-4 items-center">
        <span class="mr-2 text-muted-foreground"
            >Data shown 30 days back from
        </span>

        <DatePicker
            {onChooseDate}
            disabled={isLoading}
            value={currentDate as DateValue}
        />
    </div>

    <div class="relative">
        <LineChart
            className="h-[300px] w-full"
            title="Token Emission Through A Month"
            description="Total token rewards distributed per day"
            chartConfig={ChartConfig}
            data={chartData}
            props={monthVisConfig}
            {series}
            {isLoading}
        />

        <Button
            class="bg-transparent cursor-pointer hover:bg-background absolute top-4 right-4"
            disabled={isLoading}
            onclick={() => fetchData(selectedDateIndex)}
        >
            <RefreshCwIcon class="h-4 w-4 text-foreground" />
        </Button>
    </div>
</div>
