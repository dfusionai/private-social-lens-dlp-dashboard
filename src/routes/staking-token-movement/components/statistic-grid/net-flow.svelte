<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { stakeEventsStore } from "$lib/stores/stakeEventsStore";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import { calculateNetFlowInfo } from "../../utils";
    import { tokenSymbol } from "$lib/const";
    import { formatDecimalNumber } from "$lib/utils";

    let netFlowInfo = $state({
        netFlow: "",
        netFlowPerDay: "",
        netFlowPerWeek: "",
        totalStakeIn: "",
        totalUnstakeOut: "",
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

    const generateTokenText = (value: string) => {
        if (!value) return "-";
        return formatDecimalNumber(Number(value)) + " " + tokenSymbol;
    };
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
                <span>{generateTokenText(netFlowInfo.netFlow)}</span>
            </div>

            <div class="flex justify-between text-sm mb-2">
                <span class="text-sm font-medium mb-2">Net Flow Per Day:</span>
                <span>{generateTokenText(netFlowInfo.netFlowPerDay)}</span>
            </div>

            <div class="flex justify-between text-sm mb-2">
                <span class="text-sm font-medium mb-2">Net Flow Per Week:</span>
                <span>{generateTokenText(netFlowInfo.netFlowPerWeek)}</span>
            </div>

            <div class="flex justify-between text-sm mb-2">
                <span class="text-sm font-medium mb-2">Total Stake In:</span>
                <span>{generateTokenText(netFlowInfo.totalStakeIn)}</span>
            </div>

            <div class="flex justify-between text-sm mb-2">
                <span class="text-sm font-medium mb-2">Total Unstake Out:</span>
                <span>{generateTokenText(netFlowInfo.totalUnstakeOut)}</span>
            </div>
        {/if}
    </Card.Content>
</Card.Root>
