import type { BarChartProps } from "layerchart";
import type { ChartConfig } from "$lib/components/ui/chart/index.js";
import type { Snippet } from "svelte";

export interface Props extends BarChartProps<Record<string, any>> {
    title?: string;
    description?: string;
    chartConfig: ChartConfig;
    className?: string;
    isLoading?: boolean;
    skeletonClass?: string;
    formatter?: Snippet;
    showDateInTooltip?: boolean;
}
