<script lang="ts">
    import { onMount } from "svelte";
    import { fetchContributorRewards } from "../../api/fetchContributorRewards";
    import {
        rewardEventsActions,
        rewardEventsStore,
    } from "$lib/stores/rewardEventsStore";
    import { toast } from "svelte-sonner";
    import RewardStatistics from "./components/reward-statistics/reward-statistics.svelte";
    import RewardCurve from "./components/reward-curve/reward-curve.svelte";
    import GovernanceControls from "./components/governance-controls/governance-controls.svelte";
    import { queryMonthDuration } from "$lib/const";
    const store = $rewardEventsStore;

    onMount(async () => {
        try {
            if (
                !store.contributorRewardEvents
                // !store.validatorRewardEvents
            ) {
                rewardEventsActions.setLoading(true);
                // const claimedEvents = await fetchTotalDistributedForValidator({
                //     months: queryMonthDuration,
                // });
                const totalDistributedForContributor =
                    await fetchContributorRewards({
                        months: queryMonthDuration,
                    });

                rewardEventsActions.setContributorRewardEvents(
                    totalDistributedForContributor
                );
                // rewardEventsActions.setValidatorRewardEvents(claimedEvents);
            }
        } catch (error) {
            toast.error("Error fetching reward events");
            throw error;
        } finally {
            rewardEventsActions.setLoading(false);
        }
    });
</script>

<div class="max-w-7xl mx-auto space-y-6">
    <RewardStatistics />

    <RewardCurve />

    <GovernanceControls />
</div>
