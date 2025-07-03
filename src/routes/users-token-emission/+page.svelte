<script lang="ts">
    import TokenEmissionChartMonth from "./components/token-emission-chart-month/token-emission-chart-month.svelte";
    import TokenEmissionChartWeek from "./components/token-emission-chart-week/token-emission-chart-week.svelte";
    import Tabs from "$lib/components/ui/tabs/tabs.svelte";
    import TabsList from "$lib/components/ui/tabs/tabs-list.svelte";
    import TabsTrigger from "$lib/components/ui/tabs/tabs-trigger.svelte";
    import TabsContent from "$lib/components/ui/tabs/tabs-content.svelte";
    import { DurationType } from "./type";
    import { onMount } from "svelte";
    import { fetchRewardRequestForDate } from "../../api/fetchRewardRequestForDate";
    import { generateDailyChartData } from "./utils";
    import {
        tokenEmissionActions,
        tokenEmissionStore,
    } from "$lib/stores/tokenEmissionStore";

    const store = $tokenEmissionStore;

    onMount(async () => {
        if (store.rewardOnMonth) {
            return;
        }

        try {
            tokenEmissionActions.setLoading(true);
            let chartMonthData = generateDailyChartData(0, 30);

            const mid = Math.ceil(chartMonthData.length / 2);

            const [firstHalf, secondHalf] = [
                chartMonthData.slice(0, mid),
                chartMonthData.slice(mid),
            ];

            const promises = firstHalf.map((item) =>
                fetchRewardRequestForDate(item.date)
            );

            const monthData = await Promise.all(promises);

            const nextPromises = secondHalf.map((item) =>
                fetchRewardRequestForDate(item.date)
            );

            const nextMonthData = await Promise.all(nextPromises);

            const mergedMonthData = [...monthData, ...nextMonthData];

            chartMonthData = chartMonthData.map((item, index) => ({
                ...item,
                amount: mergedMonthData[index].totalReward || 0,
            }));

            tokenEmissionActions.setRewardOnMonth(chartMonthData);
        } catch (error) {
            console.error(error);
        } finally {
            tokenEmissionActions.setLoading(false);
        }
    });
</script>

<div>
    <Tabs value={DurationType.WEEK} class="w-full">
        <TabsList class="grid w-44 grid-cols-2">
            <TabsTrigger value={DurationType.WEEK}>Week</TabsTrigger>
            <TabsTrigger value={DurationType.MONTH}>Month</TabsTrigger>
        </TabsList>
        <TabsContent value={DurationType.WEEK}>
            <TokenEmissionChartWeek />
        </TabsContent>
        <TabsContent value={DurationType.MONTH}>
            <TokenEmissionChartMonth />
        </TabsContent>
    </Tabs>
</div>
