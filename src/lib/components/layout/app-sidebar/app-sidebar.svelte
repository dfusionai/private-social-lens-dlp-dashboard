<script lang="ts">
    import type { ComponentProps } from "svelte";
    import { navigate } from "$lib/router.js";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { mode } from "mode-watcher";
    import NavMain from "../nav-main/nav-main.svelte";
    import NavUser from "../nav-user/nav-user.svelte";
    // import dFusionLogo from "../../../../assets/logo.svg";
    // import dFusionLogoWhite from "../../../../assets/logo-white.svg";
    import dFusionLogo from "../../../../assets/light-logo.svg";
    import dFusionLogoWhite from "../../../../assets/dark-logo.svg";
    import { data } from "./data";

    let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();

    function handleNavigation(url: string) {
        navigate(url);
    }
</script>

<Sidebar.Root collapsible="offcanvas" {...restProps}>
    <Sidebar.Header>
        <Sidebar.Menu>
            <Sidebar.MenuItem>
                <Sidebar.MenuButton
                    class="data-[slot=sidebar-menu-button]:!p-1.5"
                >
                    {#if mode.current === "dark"}
                        <img
                            src={dFusionLogoWhite}
                            alt="dFusion Logo"
                            class="w-full h-8"
                        />
                    {:else}
                        <img
                            src={dFusionLogo}
                            alt="dFusion Logo"
                            class="w-full h-8"
                        />
                    {/if}
                </Sidebar.MenuButton>
            </Sidebar.MenuItem>
        </Sidebar.Menu>
    </Sidebar.Header>
    <Sidebar.Content>
        <NavMain items={data.navMain} onNavigate={handleNavigation} />
        <!-- <NavDocuments items={data.documents} onNavigate={handleNavigation} /> -->
        <!-- <NavSecondary items={data.navSecondary} class="mt-auto" onNavigate={handleNavigation} /> -->
    </Sidebar.Content>
    <Sidebar.Footer>
        <NavUser user={data.user} />
    </Sidebar.Footer>
</Sidebar.Root>
