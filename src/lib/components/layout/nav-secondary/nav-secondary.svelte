<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { WithoutChildren } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		items,
		onNavigate,
		...restProps
	}: { items: { title: string; url: string }[]; onNavigate?: (url: string) => void } & WithoutChildren<
		ComponentProps<typeof Sidebar.Group>
	> = $props();

	function handleClick(url: string) {
		if (onNavigate) {
			onNavigate(url);
		}
	}
</script>

<Sidebar.Group {...restProps}>
	<Sidebar.GroupContent>
		<Sidebar.Menu>
			{#each items as item (item.title)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						{#snippet child({ props })}
							<a href="#" on:click|preventDefault={() => handleClick(item.url)} {...props}>
								<span>{item.title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
