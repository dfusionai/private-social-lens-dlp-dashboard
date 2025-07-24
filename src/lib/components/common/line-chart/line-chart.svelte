<script lang="ts">
    import { scaleUtc } from "d3-scale";
    import * as Chart from "$lib/components/ui/chart/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import type { Props } from "./type";
    import { LineChart } from "layerchart";
    import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
    import { cn, formatDecimalNumber } from "$lib/utils";
    import { defaultVisConfig } from "./const";

    const {
        title,
        description,
        chartConfig,
        className,
        isLoading,
        skeletonClass,
        formatter,
        ...lineChartProps
    }: Props = $props()
</script>

{#snippet defaultFormatter(tooltipProps: any)}
    <div>
        <strong>{tooltipProps.name}:</strong> {formatDecimalNumber(tooltipProps.value)}
    </div>
{/snippet}

<Card.Root>
    <Card.Header>
        <Card.Title>{title || "Area Chart"}</Card.Title>
        <Card.Description
            >{description || "Showing data for ..."}</Card.Description
        >
    </Card.Header>
    {#if isLoading}
        <Skeleton class={cn("h-80 mx-5", skeletonClass)} />
    {:else}
        <Card.Content>
            <Chart.Container config={chartConfig} class={className}>
                <LineChart
                    points={{ r: 4 }}
                    x="date"
                    xScale={scaleUtc()}
                    props={defaultVisConfig}
                    {...lineChartProps}
                >
                    {#snippet tooltip()}
                        <Chart.Tooltip hideLabel formatter={formatter || defaultFormatter} />
                    {/snippet}
                </LineChart>
            </Chart.Container>
        </Card.Content>
        <!-- svelte-ignore slot_element_deprecated -->
        <Card.Footer>
            <slot name="footer" />
        </Card.Footer>
    {/if}
</Card.Root>
