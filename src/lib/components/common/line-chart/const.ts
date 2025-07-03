import { formatNumberIntoShort } from "$lib/utils";
import { curveNatural } from "d3-shape";
import type { LineChartPropsObjProp } from "layerchart";

export const defaultVisConfig: LineChartPropsObjProp = {
    spline: {
        curve: curveNatural,
        motion: "tween",
        strokeWidth: 2,
    },
    xAxis: {
        format: (v: Date) =>
            v.toLocaleDateString("en-US", {
                month: "short",
            }),
        ticks: 4,
    },
    yAxis: {
        format: (v: number) => formatNumberIntoShort(v),
    },
    highlight: { points: { r: 4 } },
}