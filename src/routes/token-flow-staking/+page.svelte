<script lang="ts">
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";
    import LineChart from "$lib/components/common/line-chart/line-chart.svelte";
    import * as Chart from "$lib/components/ui/chart/index.js";
    import { stakeEventsActions } from "$lib/stores/stakeEventsStore";
    import StatisticGrid from "./components/statistic-grid/statistic-grid.svelte";
    import ChartFooter from "./components/chart-footer/chart-footer.svelte";
    import { fetchStaking } from "../../api/fetchStakingEvents";
    import { fetchUnstaking } from "../../api/fetchUnstakingEvents";
    import { calculateStakeAmount, generateLatestMonths } from "./utils";
    import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";

    // Generate latest 6 months dynamically
    let chartData: { date: Date; stakingAmount: number }[] = $state([]);
    let trendingData: { percent: string; isUp: boolean } = $state({
        percent: "0",
        isUp: false,
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

    onMount(async () => {
        try {
            stakeEventsActions.setLoading(true);
            isLoading = true;
            chartData = generateLatestMonths();

            const stakeEvents = await fetchStaking({ months: 6 });
            const unstakeEvents = await fetchUnstaking({ months: 6 });
            stakeEventsActions.setStakeEvents(stakeEvents);
            stakeEventsActions.setUnstakeEvents(unstakeEvents);
            const stakeAmount = calculateStakeAmount(stakeEvents);
            // Update chart data with calculated amounts
            chartData = chartData.map((item, index) => ({
                ...item,
                stakingAmount: stakeAmount[index] || 0,
            }));

            const latestMonth = chartData[chartData.length - 1];
            const previousMonth = chartData[chartData.length - 2];

            const percent =
                ((latestMonth.stakingAmount - previousMonth.stakingAmount) /
                    previousMonth.stakingAmount) *
                100;

            trendingData = {
                percent: percent.toFixed(2),
                isUp: percent > 0,
            };
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
    >
        <ChartFooter
            slot="footer"
            percent={trendingData.percent}
            isUp={trendingData.isUp}
        />
    </LineChart>
</div>
