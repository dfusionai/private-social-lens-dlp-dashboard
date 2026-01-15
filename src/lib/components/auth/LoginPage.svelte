<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import { toast } from "svelte-sonner";
    import { login } from "../../../api/auth";
    import { authStore } from "$lib/stores/auth";
    import { Lock, Mail, KeyRound, Eye, EyeOff } from "@lucide/svelte";

    let email = $state("");
    let password = $state("");
    let isLoading = $state(false);
    let showPassword = $state(false);
    let emailError = $state("");
    let passwordError = $state("");

    function validateForm(): boolean {
        let isValid = true;
        emailError = "";
        passwordError = "";

        if (!email) {
            emailError = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailError = "Please enter a valid email";
            isValid = false;
        }

        if (!password) {
            passwordError = "Password is required";
            isValid = false;
        }

        return isValid;
    }

    async function handleLogin() {
        if (!validateForm()) return;

        isLoading = true;
        try {
            await login(email, password);
            authStore.setAuthenticated(true);
            toast.success("Welcome back!");
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Invalid email or password");
        } finally {
            isLoading = false;
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            handleLogin();
        }
    }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
    <div class="w-full max-w-md">
        <!-- Logo/Brand Section -->
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Lock class="w-8 h-8 text-primary" />
            </div>
            <h1 class="text-2xl font-bold tracking-tight">dFusion DLP Dashboard</h1>
            <p class="text-muted-foreground mt-2">Sign in to access your dashboard</p>
        </div>

        <!-- Login Card -->
        <div class="bg-card border rounded-xl shadow-lg p-6 space-y-6">
            <div class="space-y-4">
                <!-- Email Field -->
                <div class="space-y-2">
                    <Label for="email" class="text-sm font-medium">Email</Label>
                    <div class="relative">
                        <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            id="email"
                            type="email"
                            bind:value={email}
                            onkeydown={handleKeydown}
                            placeholder="Enter your email"
                            class="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-sm
                                   focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                                   transition-all duration-200
                                   {emailError ? 'border-destructive focus:ring-destructive/50' : ''}"
                        />
                    </div>
                    {#if emailError}
                        <p class="text-xs text-destructive">{emailError}</p>
                    {/if}
                </div>

                <!-- Password Field -->
                <div class="space-y-2">
                    <Label for="password" class="text-sm font-medium">Password</Label>
                    <div class="relative">
                        <KeyRound class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            bind:value={password}
                            onkeydown={handleKeydown}
                            placeholder="Enter your password"
                            class="w-full pl-10 pr-12 py-2.5 rounded-lg border bg-background text-sm
                                   focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                                   transition-all duration-200
                                   {passwordError ? 'border-destructive focus:ring-destructive/50' : ''}"
                        />
                        <button
                            type="button"
                            onclick={() => showPassword = !showPassword}
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {#if showPassword}
                                <EyeOff class="w-4 h-4" />
                            {:else}
                                <Eye class="w-4 h-4" />
                            {/if}
                        </button>
                    </div>
                    {#if passwordError}
                        <p class="text-xs text-destructive">{passwordError}</p>
                    {/if}
                </div>
            </div>

            <!-- Submit Button -->
            <Button
                class="w-full py-2.5"
                disabled={isLoading}
                onclick={handleLogin}
            >
                {#if isLoading}
                    <span class="inline-flex items-center gap-2">
                        <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                    </span>
                {:else}
                    Sign In
                {/if}
            </Button>
        </div>

        <!-- Footer -->
        <p class="text-center text-xs text-muted-foreground mt-6">
            Protected dashboard. Authorized access only.
        </p>
    </div>
</div>
