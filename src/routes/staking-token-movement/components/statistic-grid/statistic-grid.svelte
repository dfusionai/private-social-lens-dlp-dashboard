<script lang="ts">
    import { onMount } from "svelte";
    import { queryMonthDuration } from "$lib/const";
    import { toast } from "svelte-sonner";
    import {
        stakeEventsActions,
        stakeEventsStore,
    } from "$lib/stores/stakeEventsStore";
    import { fetchStaking } from "../../../../api/fetchStakingEvents";
    import { fetchUnstaking } from "../../../../api/fetchUnstakingEvents";
    import CurrentRewardPool from "./current-reward-pool.svelte";
    import NetFlow from "./net-flow.svelte";
    import TopStakers from "./top-stakers.svelte";
    import TokenVelocity from "./token-velocity.svelte";

    const store = $stakeEventsStore;

    const fetchData = async () => {
        try {
            stakeEventsActions.setLoading(true);

            if (!store.stakeEvents) {
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
    };

    onMount(() => {
        if (store.stakeEvents && store.unstakeEvents) {
            return;
        }
        fetchData();
    });
</script>

<div class="grid grid-cols-[repeat(auto-fit,minmax(425px,1fr))] gap-6">
    <NetFlow {fetchData} />
    <TopStakers {fetchData} />
    <CurrentRewardPool />
    <TokenVelocity {fetchData} />
</div>
