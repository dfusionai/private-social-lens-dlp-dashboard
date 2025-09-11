<script lang="ts">
    import Badge from "$lib/components/ui/badge/badge.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import CardContent from "$lib/components/ui/card/card-content.svelte";
    import CardDescription from "$lib/components/ui/card/card-description.svelte";
    import CardHeader from "$lib/components/ui/card/card-header.svelte";
    import CardTitle from "$lib/components/ui/card/card-title.svelte";
    import Card from "$lib/components/ui/card/card.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import Separator from "$lib/components/ui/separator/separator.svelte";
    import { Coins, Info, Lock } from "@lucide/svelte";
    import NumberInput from "$lib/components/common/number-input/number-input.svelte";
    import { toast } from "svelte-sonner";
    import { onMount } from "svelte";
    import { fetchAiTokenGating } from "../../../../api/fetchAITokenGating";
    import {
        createAiTokenGatingConfig,
        type ICreateTokenGatingConfigParams,
    } from "../../../../api/createAiTokenGatingConfig";
    import { z } from "zod";
    import { Dialog } from "bits-ui";
    import { login, logout } from "../../../../api/auth";

    let stakeThreshold = $state("");
    let balanceThreshold = $state("");
    let stakeThresholdError = $state("");
    let balanceThresholdError = $state("");
    let initialConfig = $state({
        stakeThreshold: "",
        balanceThreshold: "",
    });
    let isLoading = $state(false);
    let isSaveLoading = $state(false);

    let dialogOpen = $state(false); // Track dialog open/close
    let loginEmail = $state("");
    let loginPassword = $state("");
    let isLoggingIn = $state(false);

    let hasJwt = $state(false);

    function closeDialog() {
        dialogOpen = false;
    }

    // Validation schema
    const tokenGatingSchema = z.object({
        stakeThreshold: z
            .string()
            .min(1, "Stake threshold is required")
            .refine((val) => !isNaN(Number(val)), "Must be a valid number")
            .refine((val) => val !== "0", "Must be bigger than 0"),
        balanceThreshold: z
            .string()
            .min(1, "Balance threshold is required")
            .refine((val) => !isNaN(Number(val)), "Must be a valid number")
            .refine((val) => val !== "0", "Must be bigger than 0"),
    });

    const validateInputs = () => {
        try {
            tokenGatingSchema.parse({
                stakeThreshold,
                balanceThreshold,
            });
            stakeThresholdError = "";
            balanceThresholdError = "";
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                error.errors.forEach((err) => {
                    if (err.path.includes("stakeThreshold")) {
                        stakeThresholdError = err.message;
                    }
                    if (err.path.includes("balanceThreshold")) {
                        balanceThresholdError = err.message;
                    }
                });
            }
            return false;
        }
    };

    const handleSave = async () => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            dialogOpen = true;
            return;
        }

        if (!validateInputs()) {
            return;
        }

        try {
            isSaveLoading = true;
            const params: ICreateTokenGatingConfigParams = {
                balanceThreshold: Number(balanceThreshold),
                stakeThreshold: Number(stakeThreshold),
            };
            const response = await createAiTokenGatingConfig(params);
            console.log("createAiTokenGatingConfig response", response);
            if (response.ok) {
                // queryConfig();
                initialConfig = {
                    stakeThreshold: response.data.stakeThreshold.toString(),
                    balanceThreshold: response.data.balanceThreshold.toString(),
                };
                isSaveLoading = false;
                toast.success("Token gating config saved successfully!");
            }
        } catch (err) {
            // type HttpError
            if (err.status === 401) {
                toast.error("Please log in first.");
                dialogOpen = true;
            } else {
                toast.error("Saving token gating config failed!");
            }
        } finally {
            isSaveLoading = false;
        }
    };

    const hasChanged = $derived(
        stakeThreshold !== initialConfig.stakeThreshold ||
            balanceThreshold !== initialConfig.balanceThreshold,
    );

    const queryConfig = async () => {
        try {
            isLoading = true;
            const data = await fetchAiTokenGating();
            initialConfig = {
                stakeThreshold: data.stakeThreshold,
                balanceThreshold: data.balanceThreshold,
            };
        } catch (err) {
            toast.error("Fetching token gating config failed!");
        } finally {
            isLoading = false;
        }
    };

    onMount(() => {
        queryConfig();

        hasJwt = localStorage.getItem("jwt") != null;
    });

    const formatValue = (value: string) => {
        if (!value) {
            return "-";
        }

        return value + " tokens";
    };

    async function handleDialogLogin() {
        isLoggingIn = true;
        try {
            // Replace with your actual login logic
            const response = await login(loginEmail, loginPassword);

            if (response) {
                toast.success("Logged in!");
                closeDialog(); // close after success
            } else {
                toast.error("Login failed.");
            }
        } catch (err) {
            toast.error("Login failed!");
        } finally {
            isLoggingIn = false;
        }
    }

    async function handleDialogLogout() {
        try {
            const response = await logout();

            if (response) {
                toast.success("Logged out.");
            } else {
                toast.error("Logout failed.");
            }
        } catch (err) {
            toast.error("Logout failed!");
        }
    }
</script>

<!-- <div class="w-full flex flex-row justify-end items-center">
    {#if !hasJwt}
        <Button onclick={handleDialogLogin}>
            Log In
        </Button>
    {:else}
        <Button onclick={handleDialogLogout}>
            Log Out
        </Button>
    {/if}
</div> -->

<Card>
    <CardHeader>
        <CardTitle class="flex items-center gap-2">
            <Lock class="w-5 h-5" />
            Access Requirements
        </CardTitle>
        <CardDescription
            >Set the minimum thresholds users must meet to gain access. Users
            must satisfy one of the conditions.</CardDescription
        >
    </CardHeader>
    <CardContent class="space-y-6">
        <div class="space-y-3">
            <div class="flex items-center justify-between">
                <Label class="text-base font-medium">Stake Threshold</Label>
                <Badge variant="secondary" class="text-xs">
                    Current: {formatValue(initialConfig.stakeThreshold)}
                </Badge>
            </div>
            <div class="relative">
                <NumberInput
                    allowNegative={false}
                    leftIcon={Coins}
                    value={stakeThreshold}
                    error={stakeThresholdError}
                    onInput={(e: Event) => {
                        stakeThreshold = (e.target as HTMLInputElement).value;
                        stakeThresholdError = "";
                    }}
                    onChange={(e: Event) => {
                        stakeThreshold = (e.target as HTMLInputElement).value;
                        stakeThresholdError = "";
                    }}
                />
            </div>
            <p class="text-sm text-muted-foreground flex items-start gap-2">
                <Info class="w-4 h-4 mt-0.5 flex-shrink-0" />
                Minimum number of tokens that must be actively staked in the protocol
                to gain access.
            </p>
        </div>

        <Separator />

        <div class="space-y-3">
            <div class="flex items-center justify-between">
                <Label class="text-base font-medium">Balance Threshold</Label>
                <Badge variant="secondary" class="text-xs">
                    Current: {formatValue(initialConfig.balanceThreshold)}
                </Badge>
            </div>
            <div class="relative">
                <NumberInput
                    allowNegative={false}
                    leftIcon={Coins}
                    value={balanceThreshold}
                    error={balanceThresholdError}
                    onInput={(e: Event) => {
                        balanceThreshold = (e.target as HTMLInputElement).value;
                        balanceThresholdError = "";
                    }}
                    onChange={(e: Event) => {
                        balanceThreshold = (e.target as HTMLInputElement).value;
                        balanceThresholdError = "";
                    }}
                />
            </div>
            <p class="text-sm text-muted-foreground flex items-start gap-2">
                <Info class="w-4 h-4 mt-0.5 flex-shrink-0" />
                Minimum token balance that must be held in the user's wallet to gain
                access.
            </p>
        </div>

        <div class="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 class="font-medium text-sm">Access Requirements Preview</h4>
            <div class="space-y-2 text-sm">
                <div class="flex items-center justify-between">
                    <span>Minimum Staked:</span>
                    <span class="font-mono">{stakeThreshold || "0"} tokens</span
                    >
                </div>
                <div class="flex items-center justify-between">
                    <span>Minimum Balance:</span>
                    <span class="font-mono"
                        >{balanceThreshold || "0"} tokens</span
                    >
                </div>
            </div>
        </div>

        <div class="flex items-center justify-end pt-4">
            <div class="flex gap-3">
                <Button
                    disabled={!hasChanged || isSaveLoading}
                    class="min-w-[100px]"
                    onclick={handleSave}
                >
                    {isSaveLoading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    </CardContent>
</Card>

<Dialog.Root open={dialogOpen} onOpenChange={(open) => (dialogOpen = open)}>
    <!-- <Dialog.Trigger>
    <Button>Log In</Button>
  </Dialog.Trigger> -->

    <Dialog.Portal>
        <Dialog.Overlay
            class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
        />

        <Dialog.Content
            class="rounded-xl bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 outline-hidden fixed left-[50%] top-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] border p-5 sm:max-w-[490px] md:w-full"
        >
            <Dialog.Title
                class="flex w-full items-center justify-center text-lg font-semibold tracking-tight"
                >Email Login</Dialog.Title
            >

            <div class="flex flex-col items-start gap-1 mb-8">
                <Label for="apiKey" class="font-medium mb-2">Email</Label>
                <div class="relative w-full">
                    <input
                        id="email"
                        bind:value={loginEmail}
                        class="rounded-lg p-2 focus:ring-foreground focus:ring-offset-background focus:outline-hidden inline-flex w-full items-center border px-4 text-base focus:ring-2 focus:ring-offset-2 sm:text-sm"
                        placeholder="Enter your email"
                        name="email-name"
                        type="email"
                    />
                </div>
            </div>
            <div class="flex flex-col items-start gap-1 mb-8">
                <Label for="apiKey" class="font-medium mb-2">Password</Label>
                <div class="relative w-full">
                    <input
                        id="password"
                        bind:value={loginPassword}
                        class="rounded-lg p-2 focus:ring-foreground focus:ring-offset-background focus:outline-hidden inline-flex w-full items-center border px-4 text-base focus:ring-2 focus:ring-offset-2 sm:text-sm"
                        placeholder="Enter your password"
                        name="password-name"
                        type="password"
                    />
                </div>
            </div>
            <div class="flex w-full">
                <Button
                    class="w-full"
                    disabled={isLoggingIn}
                    onclick={handleDialogLogin}
                >
                    {isLoggingIn ? "Logging in..." : "Log In"}
                </Button>
            </div>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>
