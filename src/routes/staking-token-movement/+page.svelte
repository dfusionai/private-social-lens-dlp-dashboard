<script lang="ts">
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";
    import {
        stakeEventsActions,
        stakeEventsStore,
    } from "$lib/stores/stakeEventsStore";
    import StatisticGrid from "./components/statistic-grid/statistic-grid.svelte";
    import { queryMonthDuration } from "$lib/const";
    import { fetchStaking } from "../../api/fetchStakingEvents";
    import { fetchUnstaking } from "../../api/fetchUnstakingEvents";
    import StakingMovementChartWeek from "./components/staking-movement-chart-week/staking-movement-chart-week.svelte";
    import StakingMovementChartMonth from "./components/staking-movement-chart-month/staking-movement-chart-month.svelte";

    const store = $stakeEventsStore;

    onMount(async () => {
        try {
            stakeEventsActions.setLoading(true);

            if (!store.stakeEvents) {
                // Check if aborted before fetching stake events
                const stakeEvents = await fetchStaking({
                    months: queryMonthDuration,
                });
                stakeEventsActions.setStakeEvents(stakeEvents);
            }

            if (!store.unstakeEvents) {
                const unstakeEvents = await fetchUnstaking({
                    months: queryMonthDuration,
                });

                stakeEventsActions.setUnstakeEvents(unstakeEvents);
            }
        } catch (error) {
            if (error instanceof Error && error.name !== "AbortError") {
                toast.error("Fetching stake events failed!");
                throw error;
            }
        } finally {
            stakeEventsActions.setLoading(false);
        }
    });
</script>

<div>
    <div class="mb-8"><StatisticGrid /></div>
    <div class="flex flex-col gap-8">
        <StakingMovementChartWeek />
        <StakingMovementChartMonth />
    </div>
</div>
