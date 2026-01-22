import { writable } from "svelte/store";

// DEV BYPASS: Set to true to skip login during development
const DEV_BYPASS_AUTH = false;

export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
}

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>({
        isAuthenticated: false,
        isLoading: true,
    });

    return {
        subscribe,
        
        // Initialize auth state from localStorage
        init: () => {
            // DEV BYPASS: Skip auth check during development
            if (DEV_BYPASS_AUTH) {
                set({
                    isAuthenticated: true,
                    isLoading: false,
                });
                return;
            }

            const jwt = localStorage.getItem("jwt");
            set({
                isAuthenticated: !!jwt,
                isLoading: false,
            });
        },

        // Set authenticated after successful login
        setAuthenticated: (value: boolean) => {
            update((state) => ({
                ...state,
                isAuthenticated: value,
            }));
        },

        // Clear auth state on logout
        logout: () => {
            localStorage.removeItem("jwt");
            localStorage.removeItem("sessionId");
            set({
                isAuthenticated: false,
                isLoading: false,
            });
        },
    };
}

export const authStore = createAuthStore();
