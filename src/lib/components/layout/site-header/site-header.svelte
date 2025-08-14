<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import SunIcon from "@lucide/svelte/icons/sun";
    import MoonIcon from "@lucide/svelte/icons/moon";
    import { toggleMode } from "mode-watcher";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { queryMonthDuration } from "$lib/const";
</script>

<header
    class="h-(--header-height) group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) flex shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear"
>
    <div
        class="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6"
    >
        <div class="flex items-center gap-2">
            <Sidebar.Trigger class="-ml-1" />
        </div>

        <h3 class="font-bold text-[#f19e38]">STAGING</h3>

        <Button onclick={toggleMode} variant="outline" size="icon">
            <SunIcon
                class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <MoonIcon
                class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            <span class="sr-only">Toggle theme</span>
        </Button>
    </div>
</header>
