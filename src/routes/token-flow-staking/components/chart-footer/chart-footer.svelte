<script>
    import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
    import TrendingDownIcon from "@lucide/svelte/icons/trending-down";

    const isDownTrend = true;
</script>

<div class="flex w-full items-start gap-2 text-sm">
    <div class="grid gap-2">
        <div class="flex items-center gap-2 font-medium leading-none">
            Trending
            {#if isDownTrend}
                down
            {:else}
                up
            {/if}
            by 90% this month
            {#if isDownTrend}
                <TrendingDownIcon class="size-4" />
            {:else}
                <TrendingUpIcon class="size-4" />
            {/if}
        </div>
        <div class="text-muted-foreground flex items-center gap-2 leading-none">
            January - June 2025
        </div>
    </div>
</div>
