import { writable } from "svelte/store";

export type Route = {
    path: string;
    title: string;
    component: any;
};

export const routes: Route[] = [
  {
    path: "/",
    title: "Token Flow Staking",
    component: () => import("../routes/staking-token-movement/+page.svelte"),
  },
  {
    path: "/users-token-emission",
    title: "Users Token Emission",
    component: () => import("../routes/users-token-emission/+page.svelte"),
  },
  {
    path: "/token-gating-settings",
    title: "Token Gating Settings",
    component: () => import("../routes/token-gating/+page.svelte"),
  },
  {
    path: "/user-chat-activity",
    title: "User Chat Activity",
    component: () => import("../routes/user-chat-activity/+page.svelte"),
  },
  {
    path: "/data-efficiency",
    title: "Data Efficiency",
    component: () => import("../routes/data-efficiency/+page.svelte"),
  },
  {
    path: "/health-subnet-ops",
    title: "Health Subnet Ops",
    component: () => import("../routes/health-subnet-ops/+page.svelte"),
  },
  {
    path: "/pricing-monetization",
    title: "Pricing Monetization",
    component: () => import("../routes/pricing-monetization/+page.svelte"),
  },
  {
    path: "/reward-governance-control",
    title: "Reward Governance Control",
    component: () => import("../routes/reward-governance-control/+page.svelte"),
  },
];

const notFoundRoute = {
    path: "/404",
    title: "Not Found",
    component: () => import("../routes/not-found/page.svelte"),
};

export const currentRoute = writable<Route>(routes[0]);

export function navigate(path: string, replace = false) {
    const route = routes.find((r) => r.path === path);
    const toRoute = route ? route : notFoundRoute;
    currentRoute.set(toRoute);
    if (replace) {
        window.history.replaceState({}, "", path);
    } else {
        window.history.pushState({}, "", path);
    }
}

export function initRouter() {
    // Handle browser back/forward buttons
    window.addEventListener("popstate", () => {
        const path = window.location.pathname;
        const route = routes.find((r) => r.path === path);
        const toRoute = route ? route : notFoundRoute;
        currentRoute.set(toRoute);
        window.history.pushState({}, "", path);
    });

    // Set initial route based on current path
    const path = window.location.pathname;
    const route = routes.find((r) => r.path === path);
    const toRoute = route ? route : notFoundRoute;
    currentRoute.set(toRoute);
}
