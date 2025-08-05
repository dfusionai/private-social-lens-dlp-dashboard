<script>
    import CardContent from "$lib/components/ui/card/card-content.svelte";
    import CardHeader from "$lib/components/ui/card/card-header.svelte";
    import CardTitle from "$lib/components/ui/card/card-title.svelte";
    import Card from "$lib/components/ui/card/card.svelte";
    import { CheckCircle } from "@lucide/svelte";
</script>

<Card>
    <CardHeader>
        <CardTitle class="text-lg">How Token Gating Works</CardTitle>
    </CardHeader>
    <CardContent class="space-y-3 text-sm text-muted-foreground">
        <div class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-blue-600 font-bold text-xs">1</span>
            </div>
            <div>
                <p class="font-medium text-foreground">Stake Verification</p>
                <p>System checks if the user has staked the minimum required tokens in the protocol.</p>
            </div>
        </div>
        <div class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-blue-600 font-bold text-xs">2</span>
            </div>
            <div>
                <p class="font-medium text-foreground">Balance Verification</p>
                <p>System verifies the user's wallet contains the minimum token balance.</p>
            </div>
        </div>
        <div class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle class="w-4 h-4 text-green-600" />
            </div>
            <div>
                <p class="font-medium text-foreground">Access Granted</p>
                <p>If both conditions are met, the user gains access to protected features.</p>
            </div>
        </div>
    </CardContent>
</Card>
