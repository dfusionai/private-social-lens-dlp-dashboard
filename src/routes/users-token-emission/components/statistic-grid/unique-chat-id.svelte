<script lang="ts">
    import { daysPerMonth, fromIndex } from "$lib/const";
    import * as Chart from "$lib/components/ui/chart/index.js";
    import { onMount } from "svelte";
    import DonutChart from "$lib/components/common/donut-chart/donut-chart.svelte";
    import EmptyDonutChart from "$lib/components/common/empty-donut-chart/empty-donut-chart.svelte";
    import { Text } from "layerchart";
    import {
        formatDate,
        generateDailyChartData,
        formatNumberIntoShort,
    } from "$lib/utils";
    import {
        fetchNewChatsPerDay,
        type INewChatsPerDayItem,
    } from "../../../../api/fetchNewChatsPerDay";
    import { fetchRefreshedChatsCount } from "../../../../api/fetchRefreshedChatsCount";
    import { Button } from "$lib/components/ui/button";
    import { RefreshCwIcon } from "@lucide/svelte";

    const getSum = (data: INewChatsPerDayItem[]) => {
        return data.reduce((acc, curr) => acc + (curr.newChats || 0), 0);
    };

    let monthData = generateDailyChartData(fromIndex, daysPerMonth);

    let params = {
        startDate: formatDate(monthData[0].date, "YMD_DASH"),
        endDate: formatDate(monthData[monthData.length - 1].date, "YMD_DASH"),
    };

    let chatData = $state({
        totalUniqueChats: 0,
        newChats: 0,
        refreshChats: 0,
    });

    const isEmpty = $derived(chatData.totalUniqueChats === 0);

    let isLoading = $state(false);

    const queryHandler = async () => {
        try {
            isLoading = true;
            const refreshedChatCount = await fetchRefreshedChatsCount(params);
            const newChatsPerDay = await fetchNewChatsPerDay(params);
            const sumOfNewChats = getSum(newChatsPerDay.data);
            const totalUniqueChats = refreshedChatCount.data + sumOfNewChats;
            chatData.totalUniqueChats = totalUniqueChats;
            chatData.newChats = sumOfNewChats;
            chatData.refreshChats = refreshedChatCount.data;
        } catch (error) {
            throw error;
        } finally {
            isLoading = false;
        }
    };

    onMount(() => {
        queryHandler();
    });

    const chartData = $derived([
        {
            key: "newChats",
            value: chatData.newChats,
            color: "var(--color-newChats)",
        },
        {
            key: "refreshChats",
            value: chatData.refreshChats,
            color: "var(--color-refreshChats)",
        },
    ]);

    const chartConfig = {
        newChats: { label: "New Chats", color: "var(--chart-1)" },
        refreshChats: { label: "Refresh Chats", color: "var(--chart-2)" },
    } satisfies Chart.ChartConfig;
</script>

<div class="relative">
    {#if isEmpty && !isLoading}
        <EmptyDonutChart title="Total Unique Chat IDs" />
    {:else}
        <DonutChart
            {isLoading}
            {chartConfig}
            data={chartData}
            title="Total Unique Chat IDs"
            description="Breakdown of new vs refresh chats in the network"
        >
            <g slot="center" transform="translate(0, 0)">
                <Text
                    value={formatNumberIntoShort(chatData.totalUniqueChats)}
                    textAnchor="middle"
                    verticalAnchor="middle"
                    class="fill-foreground text-3xl! font-bold"
                    dy={3}
                />
                <Text
                    value="Total chats"
                    textAnchor="middle"
                    verticalAnchor="middle"
                    class="fill-muted-foreground! text-muted-foreground"
                    dy={22}
                />
            </g>
        </DonutChart>
    {/if}
    <Button
        class="bg-transparent cursor-pointer hover:bg-background absolute top-6 right-6"
        disabled={isLoading}
        onclick={queryHandler}
    >
        <RefreshCwIcon class="h-4 w-4 text-foreground" />
    </Button>
</div>
