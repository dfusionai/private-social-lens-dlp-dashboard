import { writable } from "svelte/store";

export type Route = {
    path: string;
    title: string;
    component: any;
};

export const routes: Route[] = [
	{
		path: '/token',
		title: '$VFSN Token',
		component: () => import('../routes/vfsn-token/+page.svelte')
	},
	{
		path: '/staking',
		title: 'Staking',
		component: () => import('../routes/staking/+page.svelte')
	},
	{
		path: '/files',
		title: 'Files',
		component: () => import('../routes/files/+page.svelte')
	},
	{
		path: '/staking-token-movement',
		title: 'Token Flow Staking',
		component: () => import('../routes/staking-token-movement/+page.svelte')
	},
	{
		path: '/users-token-emission',
		title: 'Users Token Emission',
		component: () => import('../routes/users-token-emission/+page.svelte')
	},
	{
		path: '/user-chat-activity',
		title: 'User Chat Activity',
		component: () => import('../routes/user-chat-activity/+page.svelte')
	},
	{
		path: '/data-efficiency',
		title: 'Data Efficiency',
		component: () => import('../routes/data-efficiency/+page.svelte')
	},
	{
		path: '/health-subnet-ops',
		title: 'Health Subnet Ops',
		component: () => import('../routes/health-subnet-ops/+page.svelte')
	},
	{
		path: '/pricing-monetization',
		title: 'Pricing Monetization',
		component: () => import('../routes/pricing-monetization/+page.svelte')
	},
	{
		path: '/reward-governance-control',
		title: 'Reward Governance Control',
		component: () => import('../routes/reward-governance-control/+page.svelte')
	}
];

export const currentRoute = writable<Route>(routes[0]);

export function navigate(path: string, replace = false) {
    const route = routes.find((r) => r.path === path);
    if (route) {
        currentRoute.set(route);
        if (replace) {
            window.history.replaceState({}, "", path);
        } else {
            window.history.pushState({}, "", path);
        }
    } else {
        // handle 404
        // currentRoute.set({ path: '/404', title: 'Not Found', component: () => import('../routes/404/+page.svelte') });
        window.history.pushState({}, "", "/404");
    }
}

export function initRouter() {
    // Handle browser back/forward buttons
    window.addEventListener("popstate", () => {
        const path = window.location.pathname;
        const route = routes.find((r) => r.path === path) || routes[0];
        currentRoute.set(route);
    });

    // Set initial route based on current path
    const path = window.location.pathname;
    const route = routes.find((r) => r.path === path) || routes[0];
    currentRoute.set(route);
}
