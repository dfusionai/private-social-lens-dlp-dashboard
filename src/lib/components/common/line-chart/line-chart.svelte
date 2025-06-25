<script lang="ts">
    import { curveNatural } from "d3-shape";
    import { scaleUtc } from "d3-scale";
    import * as Chart from "$lib/components/ui/chart/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import type { Props } from "./type";
    import { LineChart } from "layerchart";

    const {
        title,
        description,
        chartConfig,
        className,
        footer,
        ...lineChartProps
    }: Props = $props();
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>{title || "Area Chart"}</Card.Title>
        <Card.Description
            >{description || "Showing data for ..."}</Card.Description
        >
    </Card.Header>
    <Card.Content>
        <Chart.Container config={chartConfig} class={className}>
            <LineChart
                points={{ r: 4 }}
                x="date"
                xScale={scaleUtc()}
                props={{
                    spline: {
                        curve: curveNatural,
                        motion: "tween",
                        strokeWidth: 2,
                    },
                    xAxis: {
                        format: (v: Date) =>
                            v.toLocaleDateString("en-US", { month: "short" }),
                        ticks: 4,
                    },
                    highlight: { points: { r: 4 } },
                }}
                {...lineChartProps}
            >
                {#snippet tooltip()}
                    <Chart.Tooltip hideLabel />
                {/snippet}
            </LineChart>
        </Chart.Container>
    </Card.Content>
    <Card.Footer>
        <!-- svelte-ignore svelte_component_deprecated -->
        <svelte:component this={footer} />
    </Card.Footer>
</Card.Root>
