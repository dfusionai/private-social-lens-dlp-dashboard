<script lang="ts">
    import { onMount } from "svelte";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import AppSidebar from "$lib/components/layout/app-sidebar/app-sidebar.svelte";
    import SiteHeader from "$lib/components/layout/site-header/site-header.svelte";
    import { ModeWatcher } from "mode-watcher";
    import { currentRoute, initRouter } from "$lib/router.js";
    import "../app.css";

    let Component: any = $state(null);

    onMount(() => {
        initRouter();
    });

    $effect(() => {
        if ($currentRoute) {
            $currentRoute.component().then((module: any) => {
                Component = module.default;
            });
        }
    });
</script>

<Sidebar.Provider
    style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
    <ModeWatcher />
    <AppSidebar variant="inset" />
    <Sidebar.Inset>
        <SiteHeader />
        <div class="p-5">
            {#if Component}
                <!-- svelte-ignore svelte_component_deprecated -->
                <svelte:component this={Component} />
            {/if}
        </div>
    </Sidebar.Inset>
</Sidebar.Provider>

<style>
    :global(html, body) {
        height: 100%;
        margin: 0;
        padding: 0;
    }
</style>
