import type { PieChartProps } from "layerchart";

export interface Props extends PieChartProps<Record<string, any>> {
    title?: string;
    description?: string;
    className?: string;
}
