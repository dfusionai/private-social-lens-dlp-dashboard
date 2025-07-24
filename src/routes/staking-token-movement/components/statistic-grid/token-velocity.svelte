<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import Button from "$lib/components/ui/button/button.svelte";
    import { RefreshCwIcon } from "@lucide/svelte";
    import { formatDate, formatDecimalNumber } from "$lib/utils";
    import { toast } from "svelte-sonner";
    import { onMount } from "svelte";
    import { daysPerMonth, DECIMAL_OPS } from "$lib/const";
    import { fetchTokenVelocity } from "../../../../api/fetchTokenVelocity";

    let tokenVelocity = $state("");
    let loading = $state(false);

    const fetchData = async () => {
        try {
            loading = true;
            const today = new Date();
            const daysBack30 = new Date(
                new Date().setDate(new Date().getDay() - daysPerMonth),
            );

            const params = {
                startDate: formatDate(daysBack30, "YMD_DASH"),
                endDate: formatDate(today, "YMD_DASH"),
            };
            const response = await fetchTokenVelocity(params);
            tokenVelocity = response.tokenVelocity;
        } catch (err) {
            toast.error("Fetching token velocity Failed!");
        } finally {
            loading = false;
        }
    };

    onMount(() => {
        fetchData();
    });
</script>

<Card.Root class="hover:shadow-lg transition-shadow">
    <div class="relative">
        <Card.Header>
            <div class="flex items-center justify-between">
                <Card.Title>Token Velocity</Card.Title>
            </div>
            <Card.Description>
                average hold duration before movement
            </Card.Description>
        </Card.Header>

        <Button
            class="bg-transparent cursor-pointer hover:bg-background absolute top-[-10px] right-4"
            disabled={loading}
            onclick={() => fetchData()}
        >
            <RefreshCwIcon class="h-4 w-4 text-foreground" />
        </Button>
    </div>
    <Card.Content class="space-y-4">
        {#if loading}
            <Skeleton class="h-7 w-full" />
        {:else}
            <div class="flex justify-between text-sm mb-2">
                <span class="text-sm font-medium mb-2">Token Velocity:</span>
                <span
                    >{tokenVelocity
                        ? formatDecimalNumber(Number(tokenVelocity), DECIMAL_OPS.TWO) + " days"
                        : "-"}</span
                >
            </div>
        {/if}
    </Card.Content>
</Card.Root>
