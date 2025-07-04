<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { toast } from "svelte-sonner";
    import {
        stakeEventsActions,
        stakeEventsStore,
    } from "$lib/stores/stakeEventsStore";
    import StatisticGrid from "./components/statistic-grid/statistic-grid.svelte";
    import { queryMonthDuration } from "$lib/const";
    import StakingFlowChart from "./components/staking-flow-chart/staking-flow-chart.svelte";
    import { fetchStaking } from "../../api/fetchStakingEvents";
    import { fetchUnstaking } from "../../api/fetchUnstakingEvents";
    import { rewardEventsActions } from "$lib/stores/rewardEventsStore";

    const store = $stakeEventsStore;
    let abortController = $state<AbortController | null>(null);

    onMount(async () => {
        // Create new AbortController
        abortController = new AbortController();

        try {
            stakeEventsActions.setLoading(true);
            rewardEventsActions.setLoading(true);

            if (!store.stakeEvents) {
                // Check if aborted before fetching stake events
                if (abortController.signal.aborted) {
                    return;
                }

                const stakeEvents = await fetchStaking({
                    months: queryMonthDuration,
                });

                // Check if aborted after fetching stake events
                if (abortController.signal.aborted) {
                    return;
                }

                stakeEventsActions.setStakeEvents(stakeEvents);
            }

            if (!store.unstakeEvents) {
                // Check if aborted before fetching unstake events
                if (abortController.signal.aborted) {
                    return;
                }

                const unstakeEvents = await fetchUnstaking({
                    months: queryMonthDuration,
                });

                // Check if aborted after fetching unstake events
                if (abortController.signal.aborted) {
                    return;
                }

                stakeEventsActions.setUnstakeEvents(unstakeEvents);
            }
        } catch (error) {
            if (error instanceof Error && error.name !== "AbortError") {
                toast.error("Fetching stake events failed!");
                throw error;
            }
        } finally {
            if (!abortController.signal.aborted) {
                stakeEventsActions.setLoading(false);
                rewardEventsActions.setLoading(false);
            }
        }
    });

    onDestroy(() => {
        if (abortController) {
            abortController.abort();
        }
    });
</script>

<div>
    <div class="mb-8"><StatisticGrid /></div>
    <StakingFlowChart />
</div>
