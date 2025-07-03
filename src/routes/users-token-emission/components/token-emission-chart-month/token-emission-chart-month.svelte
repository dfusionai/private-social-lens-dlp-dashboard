<script lang="ts">
    import LineChart from "$lib/components/common/line-chart/line-chart.svelte";
    import * as Chart from "$lib/components/ui/chart/index.js";
    import { generateDailyChartData } from "../../utils";
    import type { LineChartPropsObjProp } from "layerchart";
    import { defaultVisConfig } from "$lib/components/common/line-chart/const";
    import { tokenEmissionStore } from "$lib/stores/tokenEmissionStore";

    let chartMonthData = $state(generateDailyChartData(0, 30));

    const ChartConfig = {
        amount: { label: "Token Emission", color: "var(--chart-1)" },
    } satisfies Chart.ChartConfig;

    const series = [
        {
            key: "amount",
            label: "Token Emission",
            color: ChartConfig.amount.color,
        },
    ];

    const monthVisConfig: LineChartPropsObjProp = {
        ...defaultVisConfig,
        xAxis: {
            format: (v: Date) => {
                return v.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                });
            },
            ticks: 30,
        },
    };

    let isLoading = $state(false);

    tokenEmissionStore.subscribe((state) => {
        const { rewardOnMonth, loading } = state;

        isLoading = loading;

        if (!rewardOnMonth) {
            return;
        }

        chartMonthData = rewardOnMonth;
    });
</script>

<LineChart
    className="h-[300px] w-full"
    title="Token Emission Through A Month"
    description="Total token rewards distributed per day"
    chartConfig={ChartConfig}
    data={chartMonthData}
    props={monthVisConfig}
    {series}
    {isLoading}
/>
