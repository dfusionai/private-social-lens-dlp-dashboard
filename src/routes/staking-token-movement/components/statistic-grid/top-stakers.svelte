<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import { buttonVariants } from "$lib/components/ui/button";
    import { daysPerMonth, tokenSymbol } from "$lib/const";
    import { formatDate, formatDecimalNumber } from "$lib/utils";
    import Button from "$lib/components/ui/button/button.svelte";
    import { RefreshCwIcon } from "@lucide/svelte";
    import { toast } from "svelte-sonner";
    import { onMount } from "svelte";
    import { fetchTopStakers, type ITopStakerItem, type ITopStakersParams } from "../../../../api/fetchTopStaker";
    import { fetchTopUnstakers, type ITopUnstakerItem, type ITopUnstakersParams } from "../../../../api/fetchTopUnstaker";

    let loading = $state(false);
    let top5Stakers: ITopStakerItem[] = $state([]);
    let top5Withdrawers: ITopUnstakerItem[] = $state([]);

    const fetchStakerData = async (params: ITopStakersParams) => {
        try {
            const topStakers = await fetchTopStakers(params);
            top5Stakers = topStakers.slice(0, 5);
        } catch (err) {
            toast.error('Fetching top stakers Failed!')
        }
    }

    const fetchUnstakerData = async (params: ITopUnstakersParams) => {
        try {
            const topUnstakers = await fetchTopUnstakers(params);
            top5Withdrawers = topUnstakers.slice(0, 5);
        } catch (err) {
            toast.error('Fetching top unstakers Failed!')
        }
    }

    const fetchAllData = async () => {
        try{
            loading = true
            const today = new Date()
            const daysBack30 = new Date(new Date().setDate(new Date().getDay() - daysPerMonth))
    
            const params = {
                startDate: formatDate(daysBack30, "YMD_DASH"),
                endDate: formatDate(today, "YMD_DASH"),
            }

            await fetchStakerData(params)
            await fetchUnstakerData(params)
        } finally {
            loading = false
        }
    }

    onMount(() => {
        fetchAllData()
    })
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
            class="bg-transparent cursor-pointer hover:bg-background absolute top-[-10px] right-4"
            disabled={loading}
            onclick={() => fetchAllData()}
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
                                            {member.wallet_address}
                                        </span>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content>
                                        <div class="flex flex-col gap-1">
                                            <b>Address</b>
                                            <p>{member.wallet_address}</p>

                                            <b>Amount</b>
                                            <p>
                                                {formatDecimalNumber(
                                                    Number(member.stake_amount)
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
                                            {member.wallet_address}
                                        </span>
                                    </Tooltip.Trigger>
                                    <Tooltip.Content>
                                        <div class="flex flex-col gap-1">
                                            <b>Address</b>
                                            <p>{member.wallet_address}</p>

                                            <b>Amount</b>
                                            <p>
                                                {formatDecimalNumber(
                                                    Number(member.unstake_amount)
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
