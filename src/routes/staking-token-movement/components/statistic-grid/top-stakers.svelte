<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { stakeEventsStore } from "$lib/stores/stakeEventsStore";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import { buttonVariants } from "$lib/components/ui/button";
    import { getTopStakers } from "../../utils";
    import { tokenSymbol } from "$lib/const";
    import { formatDecimalNumber } from "$lib/utils";
    import Button from "$lib/components/ui/button/button.svelte";
    import { RefreshCwIcon } from "@lucide/svelte";

    const { fetchData }: { fetchData: () => void } = $props();

    let loading = $state(false);
    let top5Stakers = $state<{ address: string; amount: string }[]>([]);
    let top5Withdrawers = $state<{ address: string; amount: string }[]>([]);

    stakeEventsStore.subscribe((state) => {
        loading = state.loading;

        if (!state.stakeEvents || !state.unstakeEvents) return;

        const stakingInfo = getTopStakers(
            state.stakeEvents,
            state.unstakeEvents
        );

        if (!stakingInfo) return;

        top5Stakers = stakingInfo.top5Stakers;
        top5Withdrawers = stakingInfo.top5Withdrawers;
    });
</script>

<Card.Root class="hover:shadow-lg transition-shadow">
    <div class="relative">
        <Card.Header>
            <div class="flex items-center justify-between">
                <Card.Title>Top Stakers / Withdrawers</Card.Title>
            </div>
            <Card.Description
                >Automated verification pipeline for uploaded documents</Card.Description
            >
        </Card.Header>

        <Button
            class="bg-transparent cursor-pointer hover:bg-background absolute top-0 right-4"
            disabled={loading}
            onclick={() => fetchData()}
        >
            <RefreshCwIcon class="h-4 w-4 text-foreground" />
        </Button>
    </div>
    <Card.Content class="space-y-4">
        {#if loading}
            <div class="flex flex-col gap-3">
                <div class="flex flex-col gap-2">
                    <Skeleton class="h-7 w-full" />
                    <Skeleton class="h-14 w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <Skeleton class="h-7 w-full" />
                    <Skeleton class="h-14 w-full" />
                </div>
            </div>
        {:else}
            <div>
                <p class="text-sm font-medium mb-2">Top 5 Stakers</p>
                <div class="flex flex-wrap gap-2">
                    {#if top5Stakers.length === 0}
                        <p class="text-sm text-muted-foreground">
                            No stakers found
                        </p>
                    {:else}
                        {#each top5Stakers as member}
                            <Tooltip.Provider>
                                <Tooltip.Root>
                                    <Tooltip.Trigger
                                        class={buttonVariants({
                                            variant: "outline",
                                            class: "h-8",
                                        })}
                                    >
                                        <span class="w-20 truncate">
                                            {member.address}
                                        </span>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content>
                                        <div class="flex flex-col gap-1">
                                            <b>Address</b>
                                            <p>{member.address}</p>

                                            <b>Amount</b>
                                            <p>
                                                {formatDecimalNumber(
                                                    Number(member.amount)
                                                )}
                                                {tokenSymbol}
                                            </p>
                                        </div>
                                    </Tooltip.Content>
                                </Tooltip.Root>
                            </Tooltip.Provider>
                        {/each}
                    {/if}
                </div>
            </div>

            <div>
                <p class="text-sm font-medium mb-2">Top 5 Withdrawers</p>
                <div class="flex flex-wrap gap-2">
                    {#if top5Withdrawers.length === 0}
                        <p class="text-sm text-muted-foreground">
                            No withdrawers found
                        </p>
                    {:else}
                        {#each top5Withdrawers as member}
                            <Tooltip.Provider>
                                <Tooltip.Root>
                                    <Tooltip.Trigger
                                        class={buttonVariants({
                                            variant: "outline",
                                            class: "h-8",
                                        })}
                                    >
                                        <span class="w-20 truncate">
                                            {member.address}
                                        </span>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content>
                                        <div class="flex flex-col gap-1">
                                            <b>Address</b>
                                            <p>{member.address}</p>

                                            <b>Amount</b>
                                            <p>
                                                {formatDecimalNumber(
                                                    Number(member.amount)
                                                )}
                                                {tokenSymbol}
                                            </p>
                                        </div>
                                    </Tooltip.Content>
                                </Tooltip.Root>
                            </Tooltip.Provider>
                        {/each}
                    {/if}
                </div>
            </div>
        {/if}
    </Card.Content>
</Card.Root>
