<script lang="ts">
    import { type Component, SvelteComponent } from "svelte";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import { buttonVariants } from "$lib/components/ui/button";

    interface Props {
        trigger: Component;
        content: Component;
        address: string;
        amount: string;
    }

    const props: Props = $props();
</script>

<Tooltip.Provider>
    <Tooltip.Root>
        <Tooltip.Trigger
            class={buttonVariants({
                variant: "outline",
            })}
        >
            <!-- svelte-ignore svelte_component_deprecated -->
            <svelte:component this={props.trigger} address={props.address} />
        </Tooltip.Trigger>
        <Tooltip.Content>
            <!-- svelte-ignore svelte_component_deprecated -->
            <svelte:component
                this={props.content}
                address={props.address}
                amount={props.amount}
            />
        </Tooltip.Content>
    </Tooltip.Root>
</Tooltip.Provider>
