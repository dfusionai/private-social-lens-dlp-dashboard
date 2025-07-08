<script lang="ts">
    import * as Chart from "$lib/components/ui/chart/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { PieChart, Text } from "layerchart";
    import type { Props } from "./type";
    import { cn } from "$lib/utils";

    const chartData = [
        { key: "nodata", value: 100, color: "var(--color-nodata)" },
    ];

    const chartConfig = {
        nodata: { label: "No Data", color: "var(--chart-empty)" },
    } satisfies Chart.ChartConfig;

    const { title, description, className, ...pieChartProps }: Props = $props();
</script>

<Card.Root class="flex flex-col">
    <Card.Header class="items-center">
        <Card.Title>{title || "No Data"}</Card.Title>
        <Card.Description
            >{description ||
                "No data available for this period"}</Card.Description
        >
    </Card.Header>

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
                tooltip={false}
                props={{ pie: { motion: "tween" } }}
                data={chartData}
                {...pieChartProps}
            >
                {#snippet aboveMarks()}
                    <Text
                        value="No Data"
                        textAnchor="middle"
                        verticalAnchor="middle"
                        class="fill-foreground text-lg! font-bold"
                        dy={3}
                    />
                {/snippet}
            </PieChart>
        </Chart.Container>
    </Card.Content>
    <Card.Footer class="flex-col gap-2 text-sm">
        <slot name="footer" />
    </Card.Footer>
</Card.Root>
