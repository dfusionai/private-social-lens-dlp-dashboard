import { writable } from "svelte/store";

export type Route = {
    path: string;
    title: string;
    component: any;
};

export const routes: Route[] = [
    {
        path: "/",
        title: "Balances",
        component: () => import("../routes/balances/+page.svelte"),
    },
    {
        path: '/token',
        title: '$VFSN Token Emission',
        component: () => import('../routes/vfsn-token/+page.svelte')
    },
    {
        path: '/staking',
        title: 'Staking',
        component: () => import('../routes/staking/+page.svelte')
    },
    {
        path: '/files',
        title: 'Vana Files',
        component: () => import('../routes/files/+page.svelte')
    },
    {
        path: '/staking-token-movement',
        title: 'Staking Token Movement',
        component: () => import('../routes/staking-token-movement/+page.svelte')
    },
    {
        path: '/users-token-emission',
        title: 'Chat Stats',
        component: () => import('../routes/users-token-emission/+page.svelte')
    },
    {
        path: "/token-gating-settings",
        title: "Token Gating Settings",
        component: () => import("../routes/token-gating/+page.svelte"),
    },
    {
        path: "/server-statuses",
        title: "Server Statuses",
        component: () => import("../routes/server-health/+page.svelte"),
    },
    // {
    //     path: '/user-chat-activity',
    //     title: 'User Chat Activity',
    //     component: () => import('../routes/user-chat-activity/+page.svelte')
    // },
    // {
    //     path: '/data-efficiency',
    //     title: 'Data Efficiency',
    //     component: () => import('../routes/data-efficiency/+page.svelte')
    // },
    // {
    //     path: '/health-subnet-ops',
    //     title: 'Health Subnet Ops',
    //     component: () => import('../routes/health-subnet-ops/+page.svelte')
    // },
    // {
    //     path: '/pricing-monetization',
    //     title: 'Pricing Monetization',
    //     component: () => import('../routes/pricing-monetization/+page.svelte')
    // },
    // {
    //     path: '/reward-governance-control',
    //     title: 'Reward Governance Control',
    //     component: () => import('../routes/reward-governance-control/+page.svelte')
    // }
];

const notFoundRoute = {
    path: "/404",
    title: "Not Found",
    component: () => import("../routes/not-found/page.svelte"),
};

export const currentRoute = writable<Route>(routes[0]);

// Normalize path by removing trailing slashes (except for root "/")
function normalizePath(path: string): string {
    if (path === "/" || path === "") return "/";
    return path.replace(/\/+$/, "");
}

function findRoute(path: string): Route {
    return routes.find((r) => r.path === path) ?? notFoundRoute;
}

export function navigate(path: string, replace = false) {
    const normalizedPath = normalizePath(path);
    const toRoute = findRoute(normalizedPath);
    currentRoute.set(toRoute);
    if (replace) {
        window.history.replaceState({}, "", normalizedPath);
    } else {
        window.history.pushState({}, "", normalizedPath);
    }
}

export function initRouter() {
    // Handle browser back/forward buttons
    window.addEventListener("popstate", () => {
        const path = normalizePath(window.location.pathname);
        currentRoute.set(findRoute(path));
        // Don't pushState here - popstate is triggered by back/forward navigation
    });

    // Set initial route based on current path
    const path = normalizePath(window.location.pathname);
    currentRoute.set(findRoute(path));
    
    // Clean up trailing slashes in URL if present
    if (window.location.pathname !== path) {
        window.history.replaceState({}, "", path);
    }
}
