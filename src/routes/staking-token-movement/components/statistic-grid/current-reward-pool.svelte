<script lang="ts">
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import { tokenSymbol } from "$lib/const";
    import { formatDecimalNumber } from "$lib/utils";
    import { fetchBalance } from "../../../../api/fetchBalance";
    import Button from "$lib/components/ui/button/button.svelte";
    import { RefreshCwIcon } from "@lucide/svelte";

    let balance = $state("");
    let loading = $state(false);

    const fetchData = async () => {
        try {
            loading = true;
            const result = await fetchBalance();
            balance = formatDecimalNumber(result);
        } catch (error) {
            toast.error("Fetching balance failed!");
        } finally {
            loading = false;
        }
    };

    onMount(() => {
        fetchData();
    });

    const generateTokenText = (value: string) => {
        if (!value) return "-";
        return value + " " + tokenSymbol;
    };
</script>

<Card.Root class="hover:shadow-lg transition-shadow">
    <div class="relative">
        <Card.Header>
            <div class="flex items-center justify-between">
                <Card.Title>$VFSN Balance</Card.Title>
            </div>
            <!-- <Card.Description>
                Current reward pool balance in the system
            </Card.Description> -->
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
            <div class="flex flex-col gap-2">
                <Skeleton class="h-8 w-full" />
            </div>
        {:else}
            <div class="flex justify-between text-sm mb-2">
                <span class="text-sm font-medium mb-2">Balance:</span>
                <span>{generateTokenText(balance)}</span>
            </div>
        {/if}
    </Card.Content>
</Card.Root>
