<script lang="ts">
    import LineChart from "$lib/components/common/line-chart/line-chart.svelte";
    import { onMount } from "svelte";
    import { formatDate, generateDailyChartData } from "$lib/utils";
    import { daysPerWeek, fromIndex } from "$lib/const";
    import {
        stakeEventsActions,
        stakeEventsStore,
    } from "$lib/stores/stakeEventsStore";
    import Button from "$lib/components/ui/button/button.svelte";
    import { RefreshCwIcon } from "@lucide/svelte";
    import { toast } from "svelte-sonner";
    import { ChartConfig, series, weekVisConfig } from "../../const";
    import { fetchStakingMovement } from "../../../../api/fetchStakingMovement";

    let chartData = $state(generateDailyChartData(fromIndex, daysPerWeek));

    let isLoading = $state(false);

    const store = $stakeEventsStore;

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

            stakeEventsActions.setStakeOnWeek(chartData);
        } catch (err) {
            toast.error("Fetching week token movement Failed!");
        } finally {
            isLoading = false;
        }
    };

    onMount(() => {
        if (store.stakeOnWeek) {
            chartData = store.stakeOnWeek;
            return;
        }
        fetchData();
    });
</script>

<div class="relative">
    <LineChart
        className="h-[300px] w-full"
        title="Staking Token Movement Through A Week"
        description="Total staking token movement per day"
        chartConfig={ChartConfig}
        data={chartData}
        props={weekVisConfig}
        {series}
        {isLoading}
    />

    <Button
        class="bg-transparent cursor-pointer hover:bg-background absolute top-4 right-4"
        disabled={isLoading}
        onclick={() => fetchData()}
    >
        <RefreshCwIcon class="h-4 w-4 text-foreground" />
    </Button>
</div>
