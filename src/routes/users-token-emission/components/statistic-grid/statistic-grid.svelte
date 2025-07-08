<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { onMount } from "svelte";
    import { formatDate, generateDailyChartData } from "$lib/utils";
    import { daysPerMonth, fromIndex } from "$lib/const";
    import { Users, BarChart3 } from "@lucide/svelte";
    import UniqueChatId from "./unique-chat-id.svelte";
    import UserDistribution from "./user-distribution.svelte";
    import { fetchAvgChatsPerContributor } from "../../../../api/fetchAvgChatsPerContributor";
    import {
        fetchDailyUniqueContributors,
        type IDailyUniqueContributorsItem,
    } from "../../../../api/fetchDailyUniqueContributors";
    import { generateValueString } from "../../utils";

    export const metrics = [
        {
            label: "Daily unique contributors",
            value: "",
            description:
                "Number of unique contributors who participated in token emission on a daily basis",
            icon: Users,
            helper: generateValueString,
        },
        {
            label: "Average charts per contributor",
            value: "",
            description:
                "Average number of charts generated per contributor over time",
            icon: BarChart3,
            helper: generateValueString,
        },
    ];

    let isLoading = $state(false);

    let monthData = generateDailyChartData(fromIndex, daysPerMonth);

    let params = {
        startDate: formatDate(monthData[0].date, "YMD_DASH"),
        endDate: formatDate(monthData[monthData.length - 1].date, "YMD_DASH"),
    };

    const sum = (data: IDailyUniqueContributorsItem[]) => {
        return data.reduce(
            (acc, curr) => acc + curr.dailyUniqueContributors,
            0
        );
    };

    onMount(async () => {
        try {
            isLoading = true;
            const dailyUniqueContributors =
                await fetchDailyUniqueContributors(params);
            const sumDailyUniqueContributors = sum(
                dailyUniqueContributors.data
            );
            const avgChatsPerContributor = await fetchAvgChatsPerContributor();

            metrics[0].value = String(sumDailyUniqueContributors);
            metrics[1].value = String(avgChatsPerContributor);
        } catch (error) {
            throw error;
        } finally {
            isLoading = false;
        }
    });
</script>

<div class="grid grid-cols-2 gap-8">
    <UniqueChatId />
    <UserDistribution />
</div>

<div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
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
