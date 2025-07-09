<script lang="ts">
    import { daysPerMonth, fromIndex } from "$lib/const";
    import { generateDailyChartData, getDateGap } from "$lib/utils";
    import { fetchDailyUniqueContributors } from "../../../../api/fetchDailyUniqueContributors";
    import { Button } from "$lib/components/ui/button";
    import { RefreshCwIcon } from "@lucide/svelte";
    import LineChart from "$lib/components/common/line-chart/line-chart.svelte";
    import {
        ChartConfigDailyContributor,
        monthVisConfig,
        seriesDailyContributor,
    } from "../../const";
    import DatePicker from "$lib/components/common/date-picker/date-picker.svelte";
    import { getDateParams } from "../../utils";
    import {
        tokenEmissionStore,
        tokenEmissionActions,
    } from "$lib/stores/tokenEmissionStore";
    import { onMount } from "svelte";

    let chartData = $state(generateDailyChartData(fromIndex, daysPerMonth));
    let selectedDateIndex = $state<number>(0);
    let isLoading = $state(false);

    const store = $tokenEmissionStore;

    const onChooseDate = (date: string) => {
        if (!date) return;

        const dateGap = getDateGap(new Date(), new Date(date));

        if (dateGap !== selectedDateIndex) {
            selectedDateIndex = dateGap;
            queryHandler(dateGap);
        }
    };

    const queryHandler = async (dateIndex: number) => {
        try {
            isLoading = true;
            const params = getDateParams(dateIndex);
            const dailyUniqueContributors =
                await fetchDailyUniqueContributors(params);

            chartData = dailyUniqueContributors?.data?.map((item) => {
                return {
                    date: new Date(item.submissionDate),
                    amount: item.dailyUniqueContributors,
                };
            });

            tokenEmissionActions.setDailyContributor(chartData);
        } catch (error) {
            throw error;
        } finally {
            isLoading = false;
        }
    };

    onMount(() => {
        if (!store.dailyContributor) {
            queryHandler(selectedDateIndex);
        }
    });
</script>

<div>
    <div class="flex justify-end items-center mb-4">
        <span class="mr-2 text-muted-foreground"
            >Data shown 30 days back from
        </span>

        <DatePicker {onChooseDate} disabled={isLoading} />
    </div>

    <div class="relative">
        <LineChart
            title="Daily unique contributors"
            description="Number of unique contributors who participated in token emission on a daily basis"
            className="h-[300px] w-full"
            data={chartData}
            chartConfig={ChartConfigDailyContributor}
            props={monthVisConfig}
            series={seriesDailyContributor}
            {isLoading}
        />

        <Button
            class="bg-transparent cursor-pointer hover:bg-background absolute top-4 right-4"
            disabled={isLoading}
            onclick={() => queryHandler(selectedDateIndex)}
        >
            <RefreshCwIcon class="h-4 w-4 text-foreground" />
        </Button>
    </div>
</div>
