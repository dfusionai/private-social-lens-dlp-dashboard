<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { stakeEventsStore } from "$lib/stores/stakeEventsStore";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import { getTokenVelocity } from "../../utils";
    import Button from "$lib/components/ui/button/button.svelte";
    import { RefreshCwIcon } from "@lucide/svelte";

    const { fetchData }: { fetchData: () => void } = $props();

    let tokenVelocity = $state("");
    let loading = $state(false);

    stakeEventsStore.subscribe((state) => {
        loading = state.loading;

        if (!state.stakeEvents || !state.unstakeEvents) return;

        tokenVelocity =
            getTokenVelocity(state.stakeEvents, state.unstakeEvents) || "";
    });
</script>

<Card.Root class="hover:shadow-lg transition-shadow">
    <div class="relative">
        <Card.Header>
            <div class="flex items-center justify-between">
                <Card.Title>Token Velocity</Card.Title>
            </div>
            <Card.Description>
                average hold duration before movement
            </Card.Description>
        </Card.Header>

        <Button
            class="bg-transparent cursor-pointer hover:bg-background absolute top-0 right-4"
            disabled={loading}
            onclick={() => fetchData()}
        >
            <RefreshCwIcon class="h-4 w-4 text-foreground" />
        </Button>
    </div>
    <Card.Content class="space-y-4">
        {#if loading}
            <Skeleton class="h-7 w-full" />
        {:else}
            <div class="flex justify-between text-sm mb-2">
                <span class="text-sm font-medium mb-2">Token Velocity:</span>
                <span>{tokenVelocity ? tokenVelocity + " days" : "-"}</span>
            </div>
        {/if}
    </Card.Content>
</Card.Root>
