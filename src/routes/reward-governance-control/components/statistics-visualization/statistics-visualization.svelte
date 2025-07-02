<script lang="ts">
    import { formatDecimalNumber } from "$lib/utils";
    import Card from "$lib/components/ui/card/card.svelte";
    import CardHeader from "$lib/components/ui/card/card-header.svelte";
    import CardTitle from "$lib/components/ui/card/card-title.svelte";
    import CardDescription from "$lib/components/ui/card/card-description.svelte";
    import CardContent from "$lib/components/ui/card/card-content.svelte";
    import Badge from "$lib/components/ui/badge/badge.svelte";
    import type { IStatisticsVisualizationProps } from "./type";
    import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";

    const {
        totalRewards,
        totalDistributed,
        isLoading,
    }: IStatisticsVisualizationProps = $props();

    const generatePercentText = (value: string, total: number) => {
        if (!value) return "-";
        return (Number(value) / total) * 100 + "%";
    };

    const generateWidth = (value: string, total: number) => {
        if (!value) return 0;
        return (Number(value) / total) * 100;
    };

    const generateTokensText = (value: string) => {
        if (!value) return "-";

        return formatDecimalNumber(Number(value)) + " VTK";
    };
</script>

<Card>
    <CardHeader>
        <CardTitle>Total Rewards Distributed by Role</CardTitle>
        <CardDescription
            >Token distribution across network participants</CardDescription
        >
    </CardHeader>
    <CardContent>
        {#if isLoading}
            <Skeleton class="w-full h-44" />
        {:else}
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-4 h-4 bg-blue-500 rounded"></div>
                        <span class="font-medium">Contributors</span>
                        <Badge variant="secondary"
                            >{generatePercentText(
                                totalRewards.contributor,
                                totalDistributed
                            )}</Badge
                        >
                    </div>
                    <span class="font-bold"
                        >{generateTokensText(totalRewards.contributor)}</span
                    >
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                        class="bg-blue-500 h-2 rounded-full"
                        style="width: {generateWidth(
                            totalRewards.contributor,
                            totalDistributed
                        )}%"
                    ></div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-4 h-4 bg-green-500 rounded"></div>
                        <span class="font-medium">Validators</span>
                        <Badge variant="secondary"
                            >{generatePercentText(
                                totalRewards.validator,
                                totalDistributed
                            )}</Badge
                        >
                    </div>
                    <span class="font-bold"
                        >{generateTokensText(totalRewards.validator)}</span
                    >
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                        class="bg-green-500 h-2 rounded-full"
                        style="width: {generateWidth(
                            totalRewards.validator,
                            totalDistributed
                        )}%"
                    ></div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-4 h-4 bg-purple-500 rounded"></div>
                        <span class="font-medium">Subnet Owners</span>
                        <Badge variant="secondary"
                            >{generatePercentText(
                                totalRewards.owner,
                                totalDistributed
                            )}</Badge
                        >
                    </div>
                    <span class="font-bold"
                        >{generateTokensText(totalRewards.owner)}</span
                    >
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                        class="bg-purple-500 h-2 rounded-full"
                        style="width: {generateWidth(
                            totalRewards.owner,
                            totalDistributed
                        )}%"
                    ></div>
                </div>
            </div>
        {/if}
    </CardContent>
</Card>
