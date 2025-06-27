<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { stakeEventsStore } from "$lib/stores/stakeEventsStore";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import { getTokenVelocity } from "../../utils";
    let tokenVelocity = $state("-");
    let loading = $state(false);

    stakeEventsStore.subscribe((state) => {
        loading = state.loading;

        if (!state.stakeEvents || !state.unstakeEvents) return;

        tokenVelocity =
            getTokenVelocity(state.stakeEvents, state.unstakeEvents) || "-";
    });
</script>

<Card.Root class="hover:shadow-lg transition-shadow">
    <Card.Header>
        <div class="flex items-center justify-between">
            <Card.Title>Token Velocity</Card.Title>
        </div>
        <Card.Description>
            average hold duration before movement
        </Card.Description>
    </Card.Header>
    <Card.Content class="space-y-4">
        {#if loading}
            <Skeleton class="h-7 w-full" />
        {:else}
            <div class="flex justify-between text-sm mb-2">
                <span class="text-sm font-medium mb-2">Token Velocity:</span>
                <span>{tokenVelocity}</span>
            </div>
        {/if}
    </Card.Content>
</Card.Root>
