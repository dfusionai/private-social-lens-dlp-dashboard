<script lang="ts">
    import { fromIndex, lastWeekDayInx, daysPerWeek } from "$lib/const";
    import { Button } from "$lib/components/ui/button";
    import { RefreshCwIcon } from "@lucide/svelte";
    import LineChart from "$lib/components/common/line-chart/line-chart.svelte";
    import { onMount } from "svelte";
    import DateJump from "$lib/components/common/date-jump/date-jump.svelte";
    import { formatDate, getDateGap } from "$lib/utils";
    import { chatStore, chatActions } from "$lib/stores/chatStore";
    import {
        ChartConfigChatStats,
        seriesChatStats,
        weekVisConfig,
    } from "../../const";
    import {
        generateChatStatsData,
        generateChatStatsParams,
    } from "../../utils";
    import { fetchChatStats } from "../../../../api/fetchChatStats";
    import type { DateValue } from "@internationalized/date";
    import {
        getLocalTimeZone,
        parseDate,
        today,
        type CalendarDate,
    } from "@internationalized/date";

    let chartData = $state(generateChatStatsData(fromIndex, lastWeekDayInx));
    let currentDate = $state(today(getLocalTimeZone()));
    let selectedDateIndex = $state<number>(0);
    let isLoading = $state(false);

    const store = $chatStore;

    const queryHandler = async (dateIndex: number) => {
        const newChartData = generateChatStatsData(
            dateIndex,
            dateIndex + lastWeekDayInx
        );

        try {
            isLoading = true;

            const params = generateChatStatsParams(
                dateIndex,
                dateIndex + daysPerWeek
            );

            const chatData: { newChats: number; refreshedChats: number }[] = [];

            for (let i = 0; i < params.length; i++) {
                const chatStats = await fetchChatStats(params[i]);
                chatData.push({
                    newChats: chatStats.NewChats,
                    refreshedChats: chatStats.RefreshChats,
                });
            }

            chartData = newChartData.map((item, index) => ({
                date: item.date,
                newChats: chatData[index].newChats,
                refreshedChats: chatData[index].refreshedChats,
            }));

            chatActions.setChatData(chartData);
        } catch (error) {
            chartData = newChartData;
            throw error;
        } finally {
            isLoading = false;
        }
    };

    onMount(() => {
        if (store.chatData) {
            chartData = store.chatData;
            const lastDate = formatDate(
                chartData[chartData.length - 1].date,
                "YMD_DASH"
            );
            currentDate = parseDate(lastDate);
            return;
        }

        queryHandler(selectedDateIndex);
    });

    const handleDateChange = (date: DateValue) => {
        const gap = getDateGap(new Date(), date.toDate(getLocalTimeZone()));
        selectedDateIndex = gap;
        currentDate = date as CalendarDate;
        queryHandler(gap);
    };
</script>

<div>
    <div class="flex justify-end items-center mb-4">
        <span class="mr-2 text-muted-foreground"
            >Data shown 7 days back from
        </span>

        <DateJump
            jumpDay={7}
            onChooseDate={handleDateChange}
            disabled={isLoading}
            value={currentDate}
        />
    </div>

    <div class="relative">
        <LineChart
            title="Chats stats"
            description="Number of chats stats on a daily basis"
            className="h-[300px] w-full"
            data={chartData}
            chartConfig={ChartConfigChatStats}
            props={weekVisConfig}
            series={seriesChatStats}
            {isLoading}
        />

        <Button
            class="bg-transparent cursor-pointer hover:bg-background absolute top-4 right-4"
            disabled={isLoading}
            onclick={() => queryHandler(selectedDateIndex)}
        >
            <RefreshCwIcon class="h-4 w-4 text-foreground" />
        </Button>
    </div>
</div>
