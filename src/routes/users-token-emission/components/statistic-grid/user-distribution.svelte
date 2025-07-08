<script lang="ts">
    import * as Chart from "$lib/components/ui/chart/index.js";
    import { formatNumberIntoShort } from "$lib/utils";
    import { onMount } from "svelte";
    import DonutChart from "$lib/components/common/donut-chart/donut-chart.svelte";
    import { Text } from "layerchart";
    import EmptyDonutChart from "$lib/components/common/empty-donut-chart/empty-donut-chart.svelte";
    let chatData = $state({
        totalUsers: 0,
        webAppUsers: 0,
        minerAppUsers: 0,
    });

    onMount(async () => {
        try {
        } catch (error) {
            throw error;
        }
    });

    const chartData = [
        {
            key: "webAppUsers",
            value: chatData.webAppUsers,
            color: "var(--color-webAppUsers)",
        },
        {
            key: "minerAppUsers",
            value: chatData.minerAppUsers,
            color: "var(--color-minerAppUsers)",
        },
    ];

    const isEmpty = $derived(
        chatData.webAppUsers === 0 && chatData.minerAppUsers === 0
    );

    const chartConfig = {
        webAppUsers: { label: "webAppUsers", color: "var(--chart-1)" },
        minerAppUsers: { label: "minerAppUsers", color: "var(--chart-2)" },
    } satisfies Chart.ChartConfig;
</script>

{#if isEmpty}
    <EmptyDonutChart />
{:else}
    <DonutChart
        {chartConfig}
        data={chartData}
        title="Total Users"
        description="Breakdown of webApp vs minerApp users in the network"
    >
        <g slot="center" transform="translate(0, 0)">
            <Text
                value={formatNumberIntoShort(chatData.totalUsers)}
                textAnchor="middle"
                verticalAnchor="middle"
                class="fill-foreground text-3xl! font-bold"
                dy={3}
            />
            <Text
                value="Total users"
                textAnchor="middle"
                verticalAnchor="middle"
                class="fill-muted-foreground! text-muted-foreground"
                dy={22}
            />
        </g>
    </DonutChart>
{/if}
