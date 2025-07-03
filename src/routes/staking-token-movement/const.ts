import type { LineChartPropsObjProp } from "layerchart";
import { defaultVisConfig } from "$lib/components/common/line-chart/const";

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