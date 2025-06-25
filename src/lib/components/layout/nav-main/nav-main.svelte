<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { cn } from "$lib/utils";
    let {
        items,
        onNavigate,
    }: {
        items: { title: string; url: string; icon?: any }[];
        onNavigate?: (url: string) => void;
    } = $props();

    let currentUrl = $state(window.location.pathname);

    function handleClick(url: string) {
        if (onNavigate) {
            onNavigate(url);
            currentUrl = url;
        }
    }
</script>

<Sidebar.Group>
    <Sidebar.GroupContent class="flex flex-col gap-2">
        <Sidebar.Menu>
            {#each items as item (item.title)}
                <Sidebar.MenuItem>
                    <Sidebar.MenuButton tooltipContent={item.title}>
                        {#snippet child({ props })}
                            <a
                                href="#"
                                on:click|preventDefault={() =>
                                    handleClick(item.url)}
                                {...props}
                                class={cn(
                                    "py-1 rounded-md p-3 text-sm font-medium flex items-center gap-2 text-sidebar-active-foreground",
                                    {
                                        "bg-sidebar-active font-bold":
                                            item.url === currentUrl,
                                    }
                                )}
                            >
                                {#if item.icon}
                                    <item.icon class="size-4" />
                                {/if}
                                <span>{item.title}</span>
                            </a>
                        {/snippet}
                    </Sidebar.MenuButton>
                </Sidebar.MenuItem>
            {/each}
        </Sidebar.Menu>
    </Sidebar.GroupContent>
</Sidebar.Group>
