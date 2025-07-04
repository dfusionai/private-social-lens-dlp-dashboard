<script lang="ts">
    import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
    import TrendingDownIcon from "@lucide/svelte/icons/trending-down";
    import type { IChartFooterProps } from "../../type";

    const { trendingData }: IChartFooterProps = $props();
</script>

<div class="flex w-full items-start gap-2 text-sm">
    <div class="grid gap-2">
        <div class="flex items-center gap-2 font-medium leading-none">
            Trending
            {#if trendingData.isUp}
                up
            {:else}
                down
            {/if}
            by {trendingData.percent}% this week
            {#if trendingData.isUp}
                <TrendingUpIcon class="size-4" />
            {:else}
                <TrendingDownIcon class="size-4" />
            {/if}
        </div>

        <div class="text-muted-foreground flex items-center gap-2 leading-none">
            {trendingData.timeDuration.from} - {trendingData.timeDuration.to}
            {trendingData.timeDuration.year}
        </div>
    </div>
</div>
