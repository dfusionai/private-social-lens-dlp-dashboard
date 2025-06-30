<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { stakeEventsStore } from "$lib/stores/stakeEventsStore";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import { buttonVariants } from "$lib/components/ui/button";
    import { getTopStakers } from "../../utils";

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
    <Card.Header>
        <div class="flex items-center justify-between">
            <Card.Title>Top Stakers / Withdrawers</Card.Title>
        </div>
        <Card.Description
            >Automated verification pipeline for uploaded documents</Card.Description
        >
    </Card.Header>
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
                                        <p>{member.amount} VTK</p>
                                    </div>
                                </Tooltip.Content>
                            </Tooltip.Root>
                        </Tooltip.Provider>
                    {/each}
                </div>
            </div>

            <div>
                <p class="text-sm font-medium mb-2">Top 5 Withdrawers</p>
                <div class="flex flex-wrap gap-2">
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
                                        <p>{member.amount} VTK</p>
                                    </div>
                                </Tooltip.Content>
                            </Tooltip.Root>
                        </Tooltip.Provider>
                    {/each}
                </div>
            </div>
        {/if}
    </Card.Content>
</Card.Root>
