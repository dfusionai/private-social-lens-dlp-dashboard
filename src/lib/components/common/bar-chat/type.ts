import type { SeriesData, SplineProps } from "layerchart";
import type { ChartConfig } from "$lib/components/ui/chart/index.js";
import type { Component } from "svelte";

export interface Props {
    title?: string;
    description?: string;
    chartConfig: ChartConfig;
    chartData: Record<string, any>[];
    series?: SeriesData<Record<string, any>, Component<SplineProps, {}, "pathRef">>[]
    className?: string;
  }
