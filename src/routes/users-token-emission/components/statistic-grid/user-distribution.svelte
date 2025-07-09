<script lang="ts">
    import * as Chart from "$lib/components/ui/chart/index.js";
    import { formatNumberIntoShort } from "$lib/utils";
    import { onMount } from "svelte";
    import DonutChart from "$lib/components/common/donut-chart/donut-chart.svelte";
    import { Text } from "layerchart";
    import EmptyDonutChart from "$lib/components/common/empty-donut-chart/empty-donut-chart.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { RefreshCwIcon } from "@lucide/svelte";

    let chatData = $state({
        totalUsers: 0,
        webAppUsers: 0,
        minerAppUsers: 0,
    });

    let isLoading = $state(false);

    const queryHandler = async () => {
        try {
        } catch (error) {
            throw error;
        } finally {
            isLoading = false;
        }
    };

    onMount(() => {
        queryHandler();
    });

    const chartData = $derived([
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
    ]);

    const isEmpty = $derived(chatData.totalUsers === 0);

    const chartConfig = {
        webAppUsers: { label: "Web App Users", color: "var(--chart-1)" },
        minerAppUsers: { label: "Miner App Users", color: "var(--chart-2)" },
    } satisfies Chart.ChartConfig;
</script>

<div class="relative">
    {#if isEmpty && !isLoading}
        <EmptyDonutChart title="Total Users" />
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
    <Button
        class="bg-transparent cursor-pointer hover:bg-background absolute top-6 right-6"
        disabled={isLoading}
        onclick={queryHandler}
    >
        <RefreshCwIcon class="h-4 w-4 text-foreground" />
    </Button>
</div>
