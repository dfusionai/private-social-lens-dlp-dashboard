<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { AreaChart } from 'layerchart';
	import { scaleUtc } from 'd3-scale';
	import { curveNatural } from 'd3-shape';
	import * as Chart from '$lib/components/ui/chart/index.js';

	const chartData = [
		{ date: new Date("2024-01-01"), uploads: 12, downloads: 45 },
		{ date: new Date("2024-02-01"), uploads: 18, downloads: 52 },
		{ date: new Date("2024-03-01"), uploads: 15, downloads: 38 },
		{ date: new Date("2024-04-01"), uploads: 22, downloads: 61 },
		{ date: new Date("2024-05-01"), uploads: 28, downloads: 73 },
		{ date: new Date("2024-06-01"), uploads: 35, downloads: 89 },
	];

	const chartConfig = {
		uploads: {
			label: "Uploads",
			color: "var(--primary)",
		},
		downloads: {
			label: "Downloads",
			color: "var(--secondary)",
		},
	} satisfies Chart.ChartConfig;
</script>

<div class="flex flex-col gap-6 p-6">
	<!-- Header -->
	<div>
		<h1 class="text-3xl font-bold">Analytics</h1>
		<p class="text-muted-foreground">Track your DLP performance and usage metrics</p>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<Card.Root>
			<Card.Header>
				<Card.Title>Total Uploads</Card.Title>
				<Card.Description>This month</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">1,234</div>
				<p class="text-xs text-muted-foreground">+12% from last month</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Total Downloads</Card.Title>
				<Card.Description>This month</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">5,678</div>
				<p class="text-xs text-muted-foreground">+8% from last month</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Active Users</Card.Title>
				<Card.Description>This month</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">892</div>
				<p class="text-xs text-muted-foreground">+15% from last month</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Chart -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Upload & Download Trends</Card.Title>
			<Card.Description>Monthly activity over the last 6 months</Card.Description>
		</Card.Header>
		<Card.Content>
			<Chart.Container config={chartConfig}>
				<AreaChart
					data={chartData}
					x="date"
					xScale={scaleUtc()}
					yDomain={[0, 100]}
					series={[
						{
							key: "uploads",
							label: "Uploads",
							color: chartConfig.uploads.color,
						},
						{
							key: "downloads",
							label: "Downloads",
							color: chartConfig.downloads.color,
						},
					]}
					seriesLayout="stack"
					props={{
						area: {
							curve: curveNatural,
							"fill-opacity": 0.4,
							line: { class: "stroke-1" },
							motion: "tween",
						},
						xAxis: {
							format: (v) => v.toLocaleDateString("en-US", { month: "short" }),
						},
						yAxis: { ticks: [0, 25, 50, 75, 100] },
					}}
				>
					{#snippet tooltip()}
						<Chart.Tooltip
							labelFormatter={(v: Date) => {
								return v.toLocaleDateString("en-US", {
									month: "long",
								});
							}}
							indicator="dot"
						/>
					{/snippet}
				</AreaChart>
			</Chart.Container>
		</Card.Content>
	</Card.Root>
</div> 