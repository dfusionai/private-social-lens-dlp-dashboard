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
    import { fetchStaking } from "../../api/fetchStakingEvents";
    import { fetchUnstaking } from "../../api/fetchUnstakingEvents";
    import { rewardEventsActions } from "$lib/stores/rewardEventsStore";

    const store = $stakeEventsStore;

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
    <StakingFlowChart />
    <!-- 
    <Tabs value={DurationType.MONTH} class="w-full">
        <TabsList class="grid w-44 grid-cols-2">
            <TabsTrigger value={DurationType.MONTH}>Month</TabsTrigger>
            <TabsTrigger value={DurationType.WEEK}>Week</TabsTrigger>
        </TabsList>
        <TabsContent value={DurationType.MONTH}></TabsContent>
        <TabsContent value={DurationType.WEEK}>
            <StakingFlowChartWeek />
        </TabsContent>
    </Tabs> -->
</div>
