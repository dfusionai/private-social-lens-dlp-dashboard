<script lang="ts">
    import { scaleUtc } from "d3-scale";
    import * as Chart from "$lib/components/ui/chart/index.js";
    import type { TooltipPayload } from "$lib/components/ui/chart/chart-utils.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import type { Props } from "./type";
    import { BarChart } from "layerchart";
    import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
    import { cn, formatDecimalNumber } from "$lib/utils";

    const {
        title,
        description,
        chartConfig,
        className,
        isLoading,
        skeletonClass,
        formatter,
        showDateInTooltip = false,
        ...barChartProps
    }: Props = $props();

    function formatDateLabel(value: unknown, _payload: TooltipPayload[]) {
        if (value instanceof Date) {
            return value.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        }
        return String(value ?? "");
    }
</script>

{#snippet defaultFormatter(tooltipProps: {
    value: unknown;
    name: string;
    item: TooltipPayload;
    index: number;
    payload: TooltipPayload[];
})}
    <div>
        <strong>{tooltipProps.name}:</strong>
        {formatDecimalNumber(Number(tooltipProps.value))}
    </div>
{/snippet}

<Card.Root>
    <Card.Header>
        <Card.Title>{title ?? "Bar Chart"}</Card.Title>
        <Card.Description>{description ?? "Showing data for ..."}</Card.Description>
    </Card.Header>
    {#if isLoading}
        <Skeleton class={cn("h-80 mx-5", skeletonClass)} />
    {:else}
        <Card.Content>
            <Chart.Container config={chartConfig} class={className}>
                <BarChart
                    x="date"
                    xScale={scaleUtc()}
                    orientation="vertical"
                    {...barChartProps}
                >
                    {#snippet tooltip()}
                        <Chart.Tooltip
                            hideLabel={!showDateInTooltip}
                            labelFormatter={formatDateLabel}
                            labelKey="date"
                            formatter={formatter ?? defaultFormatter}
                        />
                    {/snippet}
                </BarChart>
            </Chart.Container>
        </Card.Content>
        <!-- svelte-ignore slot_element_deprecated -->
        <Card.Footer>
            <slot name="footer" />
        </Card.Footer>
    {/if}
</Card.Root>
