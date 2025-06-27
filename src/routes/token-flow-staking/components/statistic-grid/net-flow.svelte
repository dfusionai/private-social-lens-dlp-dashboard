<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { stakeEventsStore } from "$lib/stores/stakeEventsStore";
    import { onMount } from "svelte";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import { calculateNetFlowInfo } from "../../utils";

    let netFlowInfo = $state({
        netFlow: "-",
        netFlowPerDay: "-",
        netFlowPerWeek: "-",
        totalStakeIn: "-",
        totalUnstakeOut: "-",
    });

    let loading = $state(false);

    stakeEventsStore.subscribe((state) => {
        loading = state.loading;

        if (!state.stakeEvents || !state.unstakeEvents) return;

        try {
            netFlowInfo = calculateNetFlowInfo(
                state.stakeEvents,
                state.unstakeEvents
            );
        } catch (error) {
            throw error;
        }
    });

    onMount(async () => {});
</script>

<Card.Root class="hover:shadow-lg transition-shadow">
    <Card.Header>
        <div class="flex items-center justify-between">
            <Card.Title>Net Token Flow</Card.Title>
        </div>
        <Card.Description>
            Net token flow is the sum of all token flows in the system.
        </Card.Description>
    </Card.Header>
    <Card.Content class="space-y-4">
        {#if loading}
            <div class="flex flex-col gap-2">
                <Skeleton class="h-7 w-full" />
                <Skeleton class="h-7 w-full" />
                <Skeleton class="h-7 w-full" />
                <Skeleton class="h-7 w-full" />
                <Skeleton class="h-7 w-full" />
            </div>
        {:else}
            <div class="flex justify-between text-sm mb-2">
                <span class="text-sm font-medium mb-2">Net Flow:</span>
                <span>{netFlowInfo.netFlow} VTK</span>
            </div>

            <div class="flex justify-between text-sm mb-2">
                <span class="text-sm font-medium mb-2">Net Flow Per Day:</span>
                <span>{netFlowInfo.netFlowPerDay} VTK</span>
            </div>

            <div class="flex justify-between text-sm mb-2">
                <span class="text-sm font-medium mb-2">Net Flow Per Week:</span>
                <span>{netFlowInfo.netFlowPerWeek} VTK</span>
            </div>

            <div class="flex justify-between text-sm mb-2">
                <span class="text-sm font-medium mb-2">Total Stake In:</span>
                <span>{netFlowInfo.totalStakeIn} VTK</span>
            </div>

            <div class="flex justify-between text-sm mb-2">
                <span class="text-sm font-medium mb-2">Total Unstake Out:</span>
                <span>{netFlowInfo.totalUnstakeOut} VTK</span>
            </div>
        {/if}
    </Card.Content>
</Card.Root>
