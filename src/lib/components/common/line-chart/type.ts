import type { LineChartProps } from "layerchart";
import type { ChartConfig } from "$lib/components/ui/chart/index.js";

export interface Props extends LineChartProps<Record<string, any>> {
    title?: string;
    description?: string;
    chartConfig: ChartConfig;
    className?: string;
    isLoading?: boolean;
    skeletonClass?: string;
}
