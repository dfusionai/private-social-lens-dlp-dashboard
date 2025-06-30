<script>
    import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
    import TrendingDownIcon from "@lucide/svelte/icons/trending-down";

    const { percent, isUp } = $props();
</script>

<div class="flex w-full items-start gap-2 text-sm">
    <div class="grid gap-2">
        <div class="flex items-center gap-2 font-medium leading-none">
            Trending
            {#if isUp}
                up
            {:else}
                down
            {/if}
            by {percent}% this month
            {#if isUp}
                <TrendingUpIcon class="size-4" />
            {:else}
                <TrendingDownIcon class="size-4" />
            {/if}
        </div>
        <div class="text-muted-foreground flex items-center gap-2 leading-none">
            January - June 2025
        </div>
    </div>
</div>
