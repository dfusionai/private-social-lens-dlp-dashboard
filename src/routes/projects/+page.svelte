<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	const projects = [
		{
			id: 1,
			name: "Social Truth DLP",
			description: "Decentralized data library for social truth verification",
			status: "Active",
			progress: 75,
			team: ["Alice", "Bob", "Charlie"],
			lastUpdated: "2 hours ago"
		},
		{
			id: 2,
			name: "Data Verification System",
			description: "Automated verification pipeline for uploaded documents",
			status: "In Progress",
			progress: 45,
			team: ["David", "Eve"],
			lastUpdated: "1 day ago"
		},
		{
			id: 3,
			name: "User Analytics Dashboard",
			description: "Comprehensive analytics and reporting interface",
			status: "Planning",
			progress: 20,
			team: ["Frank", "Grace", "Henry"],
			lastUpdated: "3 days ago"
		}
	];

	function getStatusColor(status: string) {
		switch (status) {
			case 'Active':
				return 'bg-green-500';
			case 'In Progress':
				return 'bg-yellow-500';
			case 'Planning':
				return 'bg-blue-500';
			default:
				return 'bg-gray-500';
		}
	}
</script>

<div class="flex flex-col gap-6 p-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Projects</h1>
			<p class="text-muted-foreground">Manage your DLP projects and initiatives</p>
		</div>
		<Button>New Project</Button>
	</div>

	<!-- Projects Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each projects as project (project.id)}
			<Card.Root class="hover:shadow-lg transition-shadow">
				<Card.Header>
					<div class="flex items-center justify-between">
						<Card.Title>{project.name}</Card.Title>
						<Badge variant="outline" class={getStatusColor(project.status)}>
							{project.status}
						</Badge>
					</div>
					<Card.Description>{project.description}</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-4">
					<!-- Progress Bar -->
					<div>
						<div class="flex justify-between text-sm mb-2">
							<span>Progress</span>
							<span>{project.progress}%</span>
						</div>
						<div class="w-full bg-gray-200 rounded-full h-2">
							<div 
								class="bg-primary h-2 rounded-full transition-all duration-300" 
								style="width: {project.progress}%"
							></div>
						</div>
					</div>

					<!-- Team -->
					<div>
						<p class="text-sm font-medium mb-2">Team</p>
						<div class="flex flex-wrap gap-1">
							{#each project.team as member}
								<Badge variant="secondary" class="text-xs">
									{member}
								</Badge>
							{/each}
						</div>
					</div>

					<!-- Last Updated -->
					<p class="text-xs text-muted-foreground">
						Last updated: {project.lastUpdated}
					</p>
				</Card.Content>
				<Card.Footer>
					<Button variant="outline" class="w-full">View Details</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
</div> 