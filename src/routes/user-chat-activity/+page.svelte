<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import TrendingDown from "@lucide/svelte/icons/trending-down";
    import TrendingUp from "@lucide/svelte/icons/trending-up";
    import { formatNumberIntoShort } from "$lib/utils";
    import { onMount } from "svelte";
    import { fetchTotalUniqueUsers } from "../../api/fetchTotalUniqueUsers";
    import { fetchTotalUniqueChat } from "../../api/fetchTotalUniqueChat";
    import { fetchTotalContributorsRewardAmount } from "../../api/fetchTotalContributorsRewardAmount";
    import { metrics } from "./const";
    import BarChat from "$lib/components/common/bar-chat/bar-chat.svelte";
    import * as Chart from "$lib/components/ui/chart/index.js";

    let isLoading = $state(false);

    const chartData = [
        { distribution: "1-5", chats: 186 },
        { distribution: "6-20", chats: 305 },
        { distribution: "21-50", chats: 237 },
        { distribution: "51-100+", chats: 73 },
    ];

    const chartConfig = {
        chats: { label: "Chats", color: "var(--chart-1)" },
    } satisfies Chart.ChartConfig;

    const series = [
        {
            key: "chats",
            label: "Chats",
            color: chartConfig.chats.color,
        },
    ];

    onMount(async () => {
        try {
            isLoading = true;
            const totalUniqueUsers = await fetchTotalUniqueUsers();
            const totalUniqueChats = await fetchTotalUniqueChat();
            const totalContributorsRewardAmount =
                await fetchTotalContributorsRewardAmount();
            const totalUniqueChatsPerUser = Math.floor(
                totalUniqueChats / totalUniqueUsers
            );
            const averageVFSNPerHolder =
                totalContributorsRewardAmount / totalUniqueUsers;
            const averageRewardsPerChat =
                totalContributorsRewardAmount / totalUniqueChats;

            metrics[0].value = totalUniqueUsers;
            metrics[1].value = totalUniqueChats;
            metrics[2].value = totalUniqueChatsPerUser;
            metrics[3].value = averageVFSNPerHolder;
            metrics[4].value = totalContributorsRewardAmount;
            metrics[5].value = averageRewardsPerChat;
        } catch (error) {
            console.error("🚀 ~ onMount ~ error:", error);
        } finally {
            isLoading = false;
        }
    });
</script>

<div>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {#each metrics as metric}
            <Card.Root>
                <Card.Header
                    class="flex flex-row items-center justify-between space-y-0 pb-2"
                >
                    <Card.Title class="text-sm font-medium"
                        >{metric.title}</Card.Title
                    >
                    <!-- svelte-ignore svelte_component_deprecated -->
                    <svelte:component
                        this={metric.icon}
                        class="h-4 w-4 text-gray-400"
                    />
                </Card.Header>
                <Card.Content>
                    <div class="space-y-1">
                        {#if isLoading}
                            <div class="flex flex-col h-[58px] justify-between">
                                <Skeleton class="h-8 w-20" />
                                <Skeleton class="h-4 w-16" />
                            </div>
                        {:else}
                            <div class="text-2xl font-bold">
                                {formatNumberIntoShort(metric.value)}
                            </div>
                            <div class="flex items-center gap-2">
                                <p class="text-xs text-gray-600">
                                    {metric.description}
                                </p>
                                {#if metric.trend && metric.trendUp !== null}
                                    <Badge
                                        variant="outline"
                                        class={metric.trendUp
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-red-50 text-red-700 border-red-200"}
                                    >
                                        {#if metric.trendUp}
                                            <TrendingUp class="mr-1 h-3 w-3" />
                                        {:else}
                                            <TrendingDown
                                                class="mr-1 h-3 w-3"
                                            />
                                        {/if}
                                        {metric.trend}
                                    </Badge>
                                {/if}
                            </div>
                        {/if}
                    </div>
                </Card.Content>
            </Card.Root>
        {/each}
    </div>

    <div class="mt-4">
        <BarChat {chartConfig} {chartData} {series} />
    </div>
</div>
