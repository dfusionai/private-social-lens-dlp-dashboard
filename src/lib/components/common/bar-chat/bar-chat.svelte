<script lang="ts">
    import { BarChart, LineChart, type ChartContextValue } from "layerchart";
    import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
    import { scaleUtc } from "d3-scale";
    import * as Chart from "$lib/components/ui/chart/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import type { Props } from "./type";

    const {
        title,
        description,
        chartConfig,
        chartData,
        series,
        className,
    }: Props = $props();
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>{title || "Bar Chart"}</Card.Title>
        <Card.Description
            >{description || "Showing data for ..."}</Card.Description
        >
    </Card.Header>
    <Card.Content>
        <Chart.Container config={chartConfig} class={className}>
            <BarChart
                points={{ r: 4 }}
                data={chartData}
                x="distribution"
                axis="x"
                xScale={scaleUtc()}
                rule={false}
                labels={{ offset: 12 }}
                props={{
                    // spline: {
                    //     curve: curveNatural,
                    //     motion: "tween",
                    //     strokeWidth: 2,
                    // },
                    highlight: {
                        points: {
                            motion: "none",
                            r: 6,
                        },
                    },
                    xAxis: {
                        format: (v: string) => v,
                    },
                    yAxis: {
                        format: (v: number) => v.toLocaleString(),
                    },
                }}
            >
                {#snippet tooltip()}
                    <Chart.Tooltip hideLabel />
                {/snippet}
            </BarChart>
        </Chart.Container>
    </Card.Content>
    <Card.Footer>
        <div class="flex w-full items-start gap-2 text-sm">
            <div class="grid gap-2">
                <div class="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUpIcon
                        class="size-4"
                    />
                </div>
                <div
                    class="text-muted-foreground flex items-center gap-2 leading-none"
                >
                    January - June 2024
                </div>
            </div>
        </div>
    </Card.Footer>
</Card.Root>
