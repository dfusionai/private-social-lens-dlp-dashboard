import { defaultVisConfig } from "$lib/components/common/line-chart/const";
import * as Chart from "$lib/components/ui/chart/index.js";
import type { LineChartPropsObjProp } from "layerchart";

export const ChartConfig = {
    amount: { label: "Token Emission", color: "var(--chart-1)" },
} satisfies Chart.ChartConfig;

export const ChartConfigDailyContributor = {
    amount: { label: "Daily Unique Contributors", color: "var(--chart-1)" },
} satisfies Chart.ChartConfig;

export const ChartConfigChatStats = {
    newChats: { label: "New Chats", color: "var(--chart-1)" },
    refreshedChats: { label: "Refreshed Chats", color: "var(--chart-2)" },
} satisfies Chart.ChartConfig;

export const series = [
    {
        key: "amount",
        label: "Token Emission",
        color: ChartConfig.amount.color,
    },
];

export const seriesDailyContributor = [
    {
        key: "amount",
        label: "Daily Unique Contributors",
        color: ChartConfigDailyContributor.amount.color,
    },
];

export const seriesChatStats = [
    {
        key: "newChats",
        label: "New Chats",
        color: ChartConfigChatStats.newChats.color,
    },
    {
        key: "refreshedChats",
        label: "Refreshed Chats",
        color: ChartConfigChatStats.refreshedChats.color,
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

export const weekVisConfig: LineChartPropsObjProp = {
    ...defaultVisConfig,
    xAxis: {
        format: (v: Date) => {
            return v.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
        },
        ticks: 7,
    },
};
