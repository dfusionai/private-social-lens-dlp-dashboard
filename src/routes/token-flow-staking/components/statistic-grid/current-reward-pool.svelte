<script lang="ts">
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import { fetchBalance } from "../../../../api/fetchBalance";

    let balance = $state("-");
    let loading = $state(false);

    onMount(async () => {
        try {
            loading = true;
            balance = await fetchBalance();
        } catch (error) {
            toast.error("Fetching balance failed!");
        } finally {
            loading = false;
        }
    });
</script>

<Card.Root class="hover:shadow-lg transition-shadow">
    <Card.Header>
        <div class="flex items-center justify-between">
            <Card.Title>Current Reward Pool Balance</Card.Title>
        </div>
        <Card.Description>
            Current reward pool balance in the system
        </Card.Description>
    </Card.Header>
    <Card.Content class="space-y-4">
        {#if loading}
            <div class="flex flex-col gap-2">
                <Skeleton class="h-8 w-full" />
            </div>
        {:else}
            <div class="flex justify-between text-sm mb-2">
                <span class="text-sm font-medium mb-2">Balance:</span>
                <span>{balance} VTK</span>
            </div>
        {/if}
    </Card.Content>
</Card.Root>
