<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { RefreshCwIcon } from "@lucide/svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
    import { generateValueString } from "../../utils";

    interface ICardInfo {
        label: string;
        value: string;
        description: string;
        reloadHandler: () => void;
        isLoading: boolean;
    }

    const { label, value, description, isLoading, reloadHandler }: ICardInfo =
        $props();
</script>

<Card.Root>
    <Card.Header
        class="flex flex-row items-center justify-between space-y-0 pb-2"
    >
        <Card.Title class="text-sm font-medium">{label}</Card.Title>
        <Button
            class="bg-transparent cursor-pointer hover:bg-background"
            disabled={isLoading}
            onclick={reloadHandler}
        >
            <RefreshCwIcon class="h-4 w-4 text-foreground" />
        </Button>
    </Card.Header>
    <Card.Content>
        <div class="space-y-1">
            {#if isLoading}
                <div class="flex flex-col justify-between">
                    <Skeleton class="h-8 w-20" />
                </div>
            {:else}
                <div class="text-2xl font-bold">
                    {generateValueString(value)}
                </div>
            {/if}
            <div class="flex items-center gap-2">
                <p class="text-xs text-gray-600">
                    {description}
                </p>
            </div>
        </div>
    </Card.Content>
</Card.Root>
