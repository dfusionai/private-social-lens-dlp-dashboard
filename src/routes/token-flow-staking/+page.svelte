<script lang="ts">
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";
    import LineChart from "$lib/components/common/line-chart/line-chart.svelte";
    import * as Chart from "$lib/components/ui/chart/index.js";
    import {
        stakeEventsActions,
        stakeEventsStore,
    } from "$lib/stores/stakeEventsStore";
    import StatisticGrid from "./components/statistic-grid/statistic-grid.svelte";
    import ChartFooter from "./components/chart-footer/chart-footer.svelte";
    import { fetchStaking } from "../../api/fetchStakingEvents";
    import { fetchUnstaking } from "../../api/fetchUnstakingEvents";
    import {
        calculateStakeAmount,
        generateLatestMonths,
        generateTrendingData,
    } from "./utils";
    import type { ITrendingData } from "./components/chart-footer/type";
    import { queryMonthDuration } from "$lib/const";

    // Generate latest 6 months dynamically
    let chartData: { date: Date; stakingAmount: number }[] = $state(
        generateLatestMonths()
    );
    let trendingData: ITrendingData = $state({
        percent: "0",
        isUp: false,
        timeDuration: {
            from: "",
            to: "",
            year: "",
        },
    });
    let isLoading = $state(false);

    const ChartConfig = {
        stakingAmount: { label: "Staking Amount", color: "var(--chart-1)" },
    } satisfies Chart.ChartConfig;

    const series = [
        {
            key: "stakingAmount",
            label: "Staking Amount",
            color: ChartConfig.stakingAmount.color,
        },
    ];

    const store = $stakeEventsStore;

    stakeEventsStore.subscribe((state) => {
        if (!state.stakeEvents) return;

        const stakeAmount = calculateStakeAmount(state.stakeEvents || []);
        // Update chart data with calculated amounts
        chartData = chartData.map((item, index) => ({
            ...item,
            stakingAmount: stakeAmount[index] || 0,
        }));

        trendingData = generateTrendingData(chartData);
    });

    onMount(async () => {
        try {
            if (!store.stakeEvents || !store.unstakeEvents) {
                stakeEventsActions.setLoading(true);
                isLoading = true;
                const unstakeEvents = await fetchUnstaking({
                    months: queryMonthDuration,
                });
                const stakeEvents = await fetchStaking({
                    months: queryMonthDuration,
                });
                stakeEventsActions.setStakeEvents(stakeEvents);
                stakeEventsActions.setUnstakeEvents(unstakeEvents);
            }
        } catch (error) {
            console.error("Error fetching stake events:", error);
            toast.error("Fetching stake events failed!");
        } finally {
            stakeEventsActions.setLoading(false);
            isLoading = false;
        }
    });
</script>

<div>
    <div class="mb-8"><StatisticGrid /></div>
    <LineChart
        className="h-[300px] w-full"
        title="Staking Through Time"
        description="Showing total staking amount for the last year"
        chartConfig={ChartConfig}
        data={chartData}
        {series}
        {isLoading}
    >
        <ChartFooter slot="footer" {trendingData} />
    </LineChart>
</div>
