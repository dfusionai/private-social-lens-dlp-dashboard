<script lang="ts">
    import type { ITotalRewards } from "./type";
    import { rewardEventsStore } from "$lib/stores/rewardEventsStore";
    import { formatDecimalNumber } from "$lib/utils";
    import Card from "$lib/components/ui/card/card.svelte";
    import CardHeader from "$lib/components/ui/card/card-header.svelte";
    import CardTitle from "$lib/components/ui/card/card-title.svelte";
    import TrendingUp from "@lucide/svelte/icons/trending-up";
    import CardContent from "$lib/components/ui/card/card-content.svelte";
    import Users from "@lucide/svelte/icons/users";
    import { getRewardStatistics } from "../../utils";
    import StatisticsVisualization from "../statistics-visualization/statistics-visualization.svelte";
    import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
    import { tokenSymbol } from "$lib/const";

    let totalRewards: ITotalRewards = $state({
        contributor: "",
        validator: "",
        owner: "",
    });

    let isLoading = $state(false);

    const totalDistributed = $derived(
        Number(totalRewards.contributor) +
            Number(totalRewards.validator) +
            Number(totalRewards.owner)
    );

    rewardEventsStore.subscribe((state) => {
        const { contributorRewardEvents, loading } = state;
        isLoading = loading;

        if (!contributorRewardEvents) {
            return;
        }

        const rewardInfo = getRewardStatistics({
            contributorRewardEvents,
            // validatorRewardEvents,
        });

        if (!rewardInfo) {
            return;
        }

        totalRewards.contributor = String(rewardInfo.contributorReward);
        // totalRewards.validator = String(rewardInfo.validatorReward);
    });

    const generateTokenText = (value: string) => {
        if (!value) return "-";
        return formatDecimalNumber(Number(value)) + " " + tokenSymbol;
    };
</script>

<div class="flex flex-col gap-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
            <CardHeader
                class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
                <CardTitle class="text-sm font-medium"
                    >Total Distributed</CardTitle
                >
                <TrendingUp class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {#if isLoading}
                    <Skeleton class="w-full h-12" />
                {:else}
                    <div class="text-2xl font-bold">
                        {generateTokenText(totalDistributed.toString())}
                    </div>
                    <p class="text-xs text-muted-foreground">
                        Total VFSN distributed to contributors, validators, and
                        owner
                    </p>
                {/if}
            </CardContent>
        </Card>

        <Card>
            <CardHeader
                class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
                <CardTitle class="text-sm font-medium"
                    >Avg Reward/Insight</CardTitle
                >
                <Users class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {#if isLoading}
                    <Skeleton class="w-full h-12" />
                {:else}
                    <div class="text-2xl font-bold">
                        {generateTokenText(totalRewards.contributor)}
                    </div>
                    <p class="text-xs text-muted-foreground">
                        Per verified insight
                    </p>
                {/if}
            </CardContent>
        </Card>

        <Card>
            <CardHeader
                class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
                <CardTitle class="text-sm font-medium"
                    >Active Contributors</CardTitle
                >
            </CardHeader>
            <CardContent>
                {#if isLoading}
                    <Skeleton class="w-full h-12" />
                {:else}
                    <!-- <div class="text-2xl font-bold">2,847</div>
                    <p class="text-xs text-muted-foreground">+156 this week</p> -->
                    -
                {/if}
            </CardContent>
        </Card>

        <Card>
            <CardHeader
                class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
                <CardTitle class="text-sm font-medium">Network Health</CardTitle
                >
            </CardHeader>
            <CardContent>
                {#if isLoading}
                    <Skeleton class="w-full h-12" />
                {:else}
                    <!-- <div class="text-2xl font-bold">94.2%</div>
                    <p class="text-xs text-muted-foreground">Validation accuracy</p> -->
                    -
                {/if}
            </CardContent>
        </Card>
    </div>
    <StatisticsVisualization {totalRewards} {totalDistributed} {isLoading} />
</div>
