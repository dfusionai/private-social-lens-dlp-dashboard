import type { LineChartPropsObjProp } from "layerchart";
import { defaultVisConfig } from "$lib/components/common/line-chart/const";
import * as Chart from "$lib/components/ui/chart/index.js";

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

export const weekVisConfig: LineChartPropsObjProp = {
    ...defaultVisConfig,
    xAxis: {
        format: (v: Date) =>
            v.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
        ticks: 7,
    },
};

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
