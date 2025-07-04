import { defaultVisConfig } from "$lib/components/common/line-chart/const";
import * as Chart from "$lib/components/ui/chart/index.js";
import type { LineChartPropsObjProp } from "layerchart";


export const ChartConfig = {
    amount: { label: "Token Emission", color: "var(--chart-1)" },
} satisfies Chart.ChartConfig;

export const series = [
    {
        key: "amount",
        label: "Token Emission",
        color: ChartConfig.amount.color,
    },
];

 export const monthVisConfig: LineChartPropsObjProp = {
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