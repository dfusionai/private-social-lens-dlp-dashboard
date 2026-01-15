<script lang="ts">
    import { onMount } from "svelte";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import AppSidebar from "$lib/components/layout/app-sidebar/app-sidebar.svelte";
    import SiteHeader from "$lib/components/layout/site-header/site-header.svelte";
    import { ModeWatcher } from "mode-watcher";
    import { currentRoute, initRouter } from "$lib/router.js";
    import { authStore } from "$lib/stores/auth";
    import LoginPage from "$lib/components/auth/LoginPage.svelte";
    import "../app.css";

    let Component: any = $state(null);

    onMount(() => {
        authStore.init();
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

{#if $authStore.isLoading}
    <!-- Loading state while checking auth -->
    <div class="min-h-screen flex items-center justify-center bg-background">
        <div class="flex flex-col items-center gap-3">
            <svg class="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-muted-foreground text-sm">Loading...</span>
        </div>
    </div>
{:else if !$authStore.isAuthenticated}
    <!-- Login page when not authenticated -->
    <ModeWatcher />
    <LoginPage />
{:else}
    <!-- Main app when authenticated -->
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
{/if}

<style>
    :global(html, body) {
        height: 100%;
        margin: 0;
        padding: 0;
    }
</style>
