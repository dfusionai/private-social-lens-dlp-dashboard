import type { LineChartProps } from "layerchart";
import type { ChartConfig } from "$lib/components/ui/chart/index.js";
import type { Component } from "svelte";

export interface Props extends LineChartProps<Record<string, any>> {
    title?: string;
    description?: string;
    chartConfig: ChartConfig;
    className?: string;
    footer?: Component;
}
