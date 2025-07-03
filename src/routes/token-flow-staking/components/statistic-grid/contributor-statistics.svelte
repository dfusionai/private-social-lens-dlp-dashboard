<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import { tokenSymbol } from "$lib/const";
    import { formatDecimalNumber } from "$lib/utils";
    import { rewardEventsStore } from "$lib/stores/rewardEventsStore";

    let todayFlow = $state({
        totalReward: "",
    });

    let loading = $state(false);

    rewardEventsStore.subscribe((state) => {
        loading = state.loading;

        if (!state.contributorRewardEventsForDate) return;

        todayFlow.totalReward = String(
            state.contributorRewardEventsForDate.totalReward
        );
    });

    const generateTokenText = (value: string) => {
        if (!value) return "-";
        return formatDecimalNumber(Number(value)) + " " + tokenSymbol;
    };
</script>

<Card.Root class="hover:shadow-lg transition-shadow">
    <Card.Header>
        <div class="flex items-center justify-between">
            <Card.Title>Contributor Statistics</Card.Title>
        </div>
        <Card.Description>
            Contributor statistics are the sum of all token distributed to
            contributors.
        </Card.Description>
    </Card.Header>
    <Card.Content class="space-y-4">
        {#if loading}
            <div class="flex flex-col gap-2">
                <Skeleton class="h-7 w-full" />
            </div>
        {:else}
            <div class="flex justify-between text-sm">
                <span class="text-sm font-medium mb-2">Today's Reward:</span>
                <span>{generateTokenText(todayFlow.totalReward)}</span>
            </div>
        {/if}
    </Card.Content>
</Card.Root>
