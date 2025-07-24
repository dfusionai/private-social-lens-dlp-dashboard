<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import { formatNumberIntoShort } from "$lib/utils";
    import { metrics } from "./const";

    let isLoading = $state(false);
</script>

<div>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {#each metrics as metric}
            <Card.Root>
                <Card.Header
                    class="flex flex-row items-center justify-between space-y-0 pb-2"
                >
                    <Card.Title class="text-sm font-medium"
                        >{metric.label}</Card.Title
                    >
                    <!-- svelte-ignore svelte_component_deprecated -->
                    <svelte:component
                        this={metric.icon}
                        class="h-4 w-4 text-gray-400"
                    />
                </Card.Header>
                <Card.Content>
                    <div class="space-y-1">
                        {#if isLoading}
                            <div class="flex flex-col h-[58px] justify-between">
                                <Skeleton class="h-8 w-20" />
                                <Skeleton class="h-4 w-16" />
                            </div>
                        {:else}
                            <div class="text-2xl font-bold">
                                {formatNumberIntoShort(metric.value)}
                            </div>
                            <div class="flex items-center gap-2">
                                <p class="text-xs text-gray-600">
                                    {metric.description}
                                </p>
                            </div>
                        {/if}
                    </div>
                </Card.Content>
            </Card.Root>
        {/each}
    </div>

    <!-- <div class="mt-4">
        <BarChat {chartConfig} {chartData} {series} />
    </div> -->
</div>
