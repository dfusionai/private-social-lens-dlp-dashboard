<script lang="ts">
    import * as Chart from "$lib/components/ui/chart/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { PieChart } from "layerchart";
    import type { Props } from "./type";
    import { cn } from "$lib/utils";
    import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";

    const {
        title,
        description,
        chartConfig,
        className,
        isLoading,
        skeletonClass,
        ...pieChartProps
    }: Props = $props();
</script>

<Card.Root class="flex flex-col h-full">
    <Card.Header class="items-center">
        <Card.Title>{title || "Pie Chart - Donut with Text"}</Card.Title>
        <Card.Description
            >{description || "Showing data for ..."}</Card.Description
        >
    </Card.Header>
    {#if isLoading}
        <div class="flex h-full items-center justify-center">
            <Skeleton class={cn("h-48 w-48 rounded-full", skeletonClass)} />
        </div>
    {:else}
        <Card.Content class="flex-1">
            <Chart.Container
                config={chartConfig}
                class={cn("mx-auto aspect-square max-h-[250px]", className)}
            >
                <PieChart
                    key="key"
                    value="value"
                    c="color"
                    innerRadius={60}
                    padding={28}
                    props={{ pie: { motion: "tween" } }}
                    {...pieChartProps}
                >
                    {#snippet aboveMarks()}
                        <slot name="center" />
                    {/snippet}
                    {#snippet tooltip()}
                        <Chart.Tooltip hideLabel />
                    {/snippet}
                </PieChart>
            </Chart.Container>
        </Card.Content>
        <Card.Footer class="flex-col gap-2 text-sm">
            <slot name="footer" />
        </Card.Footer>
    {/if}
</Card.Root>
