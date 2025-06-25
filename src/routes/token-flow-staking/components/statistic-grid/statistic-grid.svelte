<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import { fetchBalance } from "../../../../api/fetchBalance";
    import { onMount } from "svelte";

    let balance = $state("-");

    onMount(async () => {
        balance = await fetchBalance();
    });

    const topStakersWithdrawersInfo = {
        topStakers: ["David", "Eve", "Frank", "Grace", "Henry"],
        topWithdrawers: ["Alice", "Bob", "Charlie", "Dave", "Eve"],
    };
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    <Card.Root class="hover:shadow-lg transition-shadow">
        <Card.Header>
            <div class="flex items-center justify-between">
                <Card.Title>Net Token Flow</Card.Title>
            </div>
            <Card.Description>
                Net token flow is the sum of all token flows in the system.
            </Card.Description>
        </Card.Header>
        <Card.Content class="space-y-4">
            <div class="flex justify-between text-sm mb-2">
                <span class="text-sm font-medium mb-2">Token In:</span>
                <span>1,000</span>
            </div>

            <div class="flex justify-between text-sm mb-2">
                <span class="text-sm font-medium mb-2">Token Out:</span>
                <span>500</span>
            </div>
        </Card.Content>
    </Card.Root>

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
            <div>
                <p class="text-sm font-medium mb-2">Top 5 Stakers</p>
                <div class="flex flex-wrap gap-1">
                    {#each topStakersWithdrawersInfo.topStakers as member}
                        <Badge variant="secondary" class="text-xs">
                            {member}
                        </Badge>
                    {/each}
                </div>
            </div>

            <div>
                <p class="text-sm font-medium mb-2">Top 5 Withdrawers</p>
                <div class="flex flex-wrap gap-1">
                    {#each topStakersWithdrawersInfo.topWithdrawers as member}
                        <Badge variant="secondary" class="text-xs">
                            {member}
                        </Badge>
                    {/each}
                </div>
            </div>
        </Card.Content>
    </Card.Root>

    <Card.Root class="hover:shadow-lg transition-shadow">
        <Card.Header>
            <div class="flex items-center justify-between">
                <Card.Title>Current Reward Pool Balance</Card.Title>
            </div>
            <!-- <Card.Description></Card.Description>
                Current reward pool balance in the system
            </Card.Description> -->
        </Card.Header>
        <Card.Content class="space-y-4">
            <div class="flex justify-between text-sm mb-2">
                <span class="text-sm font-medium mb-2">Balance:</span>
                <span>{balance} VTK</span>
            </div>
        </Card.Content>
    </Card.Root>

    <Card.Root class="hover:shadow-lg transition-shadow">
        <Card.Header>
            <div class="flex items-center justify-between">
                <Card.Title>Token Velocity</Card.Title>
            </div>
            <Card.Description>
                average hold duration before movement
            </Card.Description>
        </Card.Header>
        <Card.Content class="space-y-4">
            <div class="flex justify-between text-sm mb-2">
                <span class="text-sm font-medium mb-2">Token Velocity:</span>
                <span>1,000</span>
            </div>
        </Card.Content>
    </Card.Root>
</div>
