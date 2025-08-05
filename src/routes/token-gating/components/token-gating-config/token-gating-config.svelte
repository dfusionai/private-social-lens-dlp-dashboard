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
    import { createAiTokenGatingConfig, type ICreateTokenGatingConfigParams } from "../../../../api/createAiTokenGatingConfig";
    import { z } from "zod";

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

    // Validation schema
    const tokenGatingSchema = z.object({
        stakeThreshold: z.string()
            .min(1, "Stake threshold is required")
            .refine((val) => !isNaN(Number(val)), "Must be a valid number")
            .refine((val) => val !== '0', "Must be bigger than 0"),
        balanceThreshold: z.string()
            .min(1, "Balance threshold is required")
            .refine((val) => !isNaN(Number(val)), "Must be a valid number")
            .refine((val) => val !== '0', "Must be bigger than 0"),
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
        if (!validateInputs()) {
            return;
        }

        try {
            isSaveLoading = true;
            const params: ICreateTokenGatingConfigParams = {
                balanceThreshold: Number(balanceThreshold),
                stakeThreshold: Number(stakeThreshold),
            };
            await createAiTokenGatingConfig(params);
            queryConfig();
            isSaveLoading = false;
            toast.success("Token gating config saved successfully!");
        } catch (err) {
            toast.error("Saving token gating config failed!");
        } finally {
            isSaveLoading = false;
        }
    };

    const hasChanged = $derived(stakeThreshold !== initialConfig.stakeThreshold || balanceThreshold !== initialConfig.balanceThreshold);

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
    });

    const formatValue = (value: string) => {
        if (!value) {
            return "-";
        }

        return value + " tokens";
    };
</script>

<Card>
    <CardHeader>
        <CardTitle class="flex items-center gap-2">
            <Lock class="w-5 h-5" />
            Access Requirements
        </CardTitle>
        <CardDescription>Set the minimum thresholds users must meet to gain access. Users must satisfy BOTH conditions.</CardDescription>
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
                Minimum number of tokens that must be actively staked in the protocol to gain access.
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
                Minimum token balance that must be held in the user's wallet to gain access.
            </p>
        </div>

        <div class="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 class="font-medium text-sm">Access Requirements Preview</h4>
            <div class="space-y-2 text-sm">
                <div class="flex items-center justify-between">
                    <span>Minimum Staked:</span>
                    <span class="font-mono">{stakeThreshold || "0"} tokens</span>
                </div>
                <div class="flex items-center justify-between">
                    <span>Minimum Balance:</span>
                    <span class="font-mono">{balanceThreshold || "0"} tokens</span>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-between pt-4">
            <div class="flex gap-3">
                <Button disabled={!hasChanged || isSaveLoading} class="min-w-[100px]" onclick={handleSave}>
                    {isSaveLoading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    </CardContent>
</Card>
