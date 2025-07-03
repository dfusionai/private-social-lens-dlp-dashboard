<script lang="ts">
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";
    import {
        stakeEventsActions,
        stakeEventsStore,
    } from "$lib/stores/stakeEventsStore";
    import StatisticGrid from "./components/statistic-grid/statistic-grid.svelte";
    import { queryMonthDuration } from "$lib/const";
    import StakingFlowChart from "./components/staking-flow-chart/staking-flow-chart.svelte";
    import Tabs from "$lib/components/ui/tabs/tabs.svelte";
    import TabsList from "$lib/components/ui/tabs/tabs-list.svelte";
    import TabsTrigger from "$lib/components/ui/tabs/tabs-trigger.svelte";
    import TabsContent from "$lib/components/ui/tabs/tabs-content.svelte";
    import TrendingUp from "@lucide/svelte/icons/trending-up";
    import Coins from "@lucide/svelte/icons/coins";
    import { DurationType } from "./type";
    import { fetchStaking } from "../../api/fetchStakingEvents";
    import { fetchUnstaking } from "../../api/fetchUnstakingEvents";
    import RewardContributorChart from "./components/reward-contributor-chart/reward-contributor-chart.svelte";
    import StakingFlowChartWeek from "./components/staking-flow-chart-week/staking-flow-chart-week.svelte";
    import RewardContributorChartWeek from "./components/reward-contributor-chart-week/reward-contributor-chart-week.svelte";
    import {
        rewardEventsStore,
        rewardEventsActions,
    } from "$lib/stores/rewardEventsStore";
    import { fetchContributorRewards } from "../../api/fetchContributorRewards";
    import { fetchContributorRewardsInWeeks } from "../../api/fetchContributorRewardsInWeeks";
    import { queryWeekDuration } from "$lib/const";
    import { fetchStakingInWeeks } from "../../api/fetchStakingEventsInWeeks";
    import { fetchContributorRewardForDate } from "../../api/fetchContributorRewardForDate";

    const store = $stakeEventsStore;
    const rewardStore = $rewardEventsStore;

    onMount(async () => {
        try {
            stakeEventsActions.setLoading(true);
            rewardEventsActions.setLoading(true);

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

            if (!store.stakeEventsInWeeks) {
                const stakeEventsInWeeks = await fetchStakingInWeeks({
                    weeks: queryWeekDuration,
                });
                stakeEventsActions.setStakeEventsInWeeks(stakeEventsInWeeks);
            }

            if (!rewardStore.contributorRewardEvents) {
                const contributorRewardEvents = await fetchContributorRewards({
                    months: queryMonthDuration,
                });
                rewardEventsActions.setContributorRewardEvents(
                    contributorRewardEvents
                );
            }

            if (!rewardStore.contributorRewardEventsInWeeks) {
                const contributorRewardEventsInWeeks =
                    await fetchContributorRewardsInWeeks({
                        weeks: queryWeekDuration,
                    });
                rewardEventsActions.setContributorRewardEventsInWeeks(
                    contributorRewardEventsInWeeks
                );
            }

            if (!rewardStore.contributorRewardEventsForDate?.totalReward) {
                const contributorRewardEventsForDate =
                    await fetchContributorRewardForDate({
                        date: new Date(),
                    });

                rewardEventsActions.setContributorRewardEventsForDate(
                    contributorRewardEventsForDate
                );
            }
        } catch (error) {
            toast.error("Fetching stake events failed!");
            throw error;
        } finally {
            stakeEventsActions.setLoading(false);
            rewardEventsActions.setLoading(false);
        }
    });
</script>

<div>
    <div class="mb-8"><StatisticGrid /></div>
    <Tabs value="staking" class="w-full">
        <TabsList class="grid w-full grid-cols-2 h-20">
            <TabsTrigger value="staking" class="flex flex-col">
                <TrendingUp class="w-5 h-5" />
                <div class="text-center">
                    <div class="font-medium text-sm">Staking</div>
                    <div class="text-xs opacity-75">Through Time</div>
                </div>
            </TabsTrigger>
            <TabsTrigger value="rewards" class="flex flex-col">
                <Coins class="w-5 h-5" />
                <div class="text-center">
                    <div class="font-medium text-sm">Rewards</div>
                    <div class="text-xs opacity-75">Distribution</div>
                </div>
            </TabsTrigger>
        </TabsList>
        <TabsContent value="staking">
            <Tabs value={DurationType.MONTH} class="w-full">
                <TabsList class="grid w-44 grid-cols-2">
                    <TabsTrigger value={DurationType.MONTH}>Month</TabsTrigger>
                    <TabsTrigger value={DurationType.WEEK}>Week</TabsTrigger>
                </TabsList>
                <TabsContent value={DurationType.MONTH}>
                    <StakingFlowChart />
                </TabsContent>
                <TabsContent value={DurationType.WEEK}>
                    <StakingFlowChartWeek />
                </TabsContent>
            </Tabs>
        </TabsContent>
        <TabsContent value="rewards">
            <Tabs value={DurationType.MONTH} class="w-full">
                <TabsList class="grid w-44 grid-cols-2">
                    <TabsTrigger value={DurationType.MONTH}>Month</TabsTrigger>
                    <TabsTrigger value={DurationType.WEEK}>Week</TabsTrigger>
                </TabsList>
                <TabsContent value={DurationType.MONTH}>
                    <RewardContributorChart />
                </TabsContent>
                <TabsContent value={DurationType.WEEK}>
                    <RewardContributorChartWeek />
                </TabsContent>
            </Tabs>
        </TabsContent>
    </Tabs>
</div>
