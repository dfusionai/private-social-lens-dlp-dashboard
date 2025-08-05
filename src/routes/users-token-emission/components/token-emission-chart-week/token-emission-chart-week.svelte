<script lang="ts">
    import LineChart from "$lib/components/common/line-chart/line-chart.svelte";
    import {
        tokenEmissionActions,
        tokenEmissionStore,
    } from "$lib/stores/tokenEmissionStore";
    import { onMount } from "svelte";
    import { formatDate, generateDailyChartData } from "$lib/utils";
    import { fromIndex, daysPerWeek } from "$lib/const";
    import Button from "$lib/components/ui/button/button.svelte";
    import { RefreshCwIcon } from "@lucide/svelte";
    import { toast } from "svelte-sonner";
    import { fetchStakingMovement } from "../../../../api/fetchStakingMovement";
    import { ChartConfig, series, weekVisConfig } from "../../const";

    let chartData = $state(generateDailyChartData(fromIndex, daysPerWeek));

    let isLoading = $state(false);

    const store = $tokenEmissionStore;

    const fetchData = async () => {
        try {
            isLoading = true;
            const today = new Date();
            const daysBack7 = new Date(
                new Date().setDate(new Date().getDate() - daysPerWeek),
            );

            const params = {
                startDate: formatDate(daysBack7, "YMD_DASH"),
                endDate: formatDate(today, "YMD_DASH"),
            };

            const response = await fetchStakingMovement(params);

            chartData = response?.map((item, index) => {
                return {
                    date: chartData[index].date,
                    amount: Number(item.stakeamount),
                };
            });
            tokenEmissionActions.setRewardOnWeek(chartData);
        } catch (err) {
            toast.error("Fetching week token emission movement Failed!");
        } finally {
            isLoading = false;
        }
    };

    onMount(() => {
        if (store.rewardOnWeek) {
            chartData = store.rewardOnWeek;
            return;
        }
        fetchData();
    });
</script>

<div class="relative">
    <LineChart
        className="h-[300px] w-full"
        title="Token Emission Through A Week (7 latest days)"
        description="Total token rewards distributed per day"
        chartConfig={ChartConfig}
        data={chartData}
        props={weekVisConfig}
        {series}
        {isLoading}
    />

    <Button
        class="bg-transparent cursor-pointer hover:bg-background absolute top-4 right-4"
        disabled={isLoading}
        onclick={fetchData}
    >
        <RefreshCwIcon class="h-4 w-4 text-foreground" />
    </Button>
</div>
