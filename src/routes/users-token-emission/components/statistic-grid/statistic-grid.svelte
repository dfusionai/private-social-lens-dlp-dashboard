<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { metrics } from "./const";
    import { onMount } from "svelte";
    import { fetchTotalUniqueUsers } from "../../../../api/fetchTotalUniqueUsers";
    import { fetchChatInfo } from "../../../../api/fetchChatInfo";
    import { fetchNewChatsPerDay } from "../../../../api/fetchNewChatsPerDay";
    import { fetchRefreshedChatsCount } from "../../../../api/fetchRefreshedChatsCount";
    import { fetchTotalUniqueChatIds } from "../../../../api/fetchTotalUniqueChatIds";
    import { fetchUsersByAppDaily } from "../../../../api/fetchUsersByAppDaily";

    let isLoading = $state(false);

    const params = {
        startDate: "2025-01-01",
        endDate: "2025-06-31",
    };

    onMount(async () => {
        try {
            isLoading = true;
            const newChatsPerDay = await fetchNewChatsPerDay(params);
            const refreshedChatCount = await fetchRefreshedChatsCount(params);
            const totalUniqueChatIds = await fetchTotalUniqueChatIds();
            const userByAppDaily = await fetchUsersByAppDaily(params);
            console.log("🚀 ~ onMount ~ newChatsPerDay:", {
                newChatsPerDay,
                refreshedChatCount,
                totalUniqueChatIds,
                userByAppDaily,
            });
            const totalUniqueUsers = await fetchTotalUniqueUsers();
            const chatInfo = await fetchChatInfo();
            const totalChats = chatInfo.data.totalChats;
            const avgChatsPerUser = totalChats / totalUniqueUsers;
            metrics[1].value = String(avgChatsPerUser);
        } catch (error) {
            throw error;
        } finally {
            isLoading = false;
        }
    });
</script>

<div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
    {#each metrics as metric}
        <Card.Root>
            <Card.Header
                class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
                <Card.Title class="text-sm font-medium"
                    >{metric.label}</Card.Title
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
                            {metric.helper(metric.value)}
                        </div>
                        <div class="flex items-center gap-2">
                            <p class="text-xs text-gray-600">
                                {metric.description}
                            </p>
                        </div>
                    {/if}
                </div>
            </Card.Content>
        </Card.Root>
    {/each}
</div>
