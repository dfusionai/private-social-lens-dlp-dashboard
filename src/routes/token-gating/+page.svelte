<script>
    import { Shield } from "@lucide/svelte";
    import TokenGatingConfig from "./components/token-gating-config/token-gating-config.svelte";
    import TokenGatingDescription from "./components/token-gating-description/token-gating-description.svelte";
</script>

<div class="max-w-2xl mx-auto p-6 space-y-6">
    <div class="space-y-2">
        <div class="flex items-center gap-2">
            <Shield class="w-6 h-6 text-blue-600" />
            <h1 class="text-2xl font-bold">Token Gating Configuration</h1>
        </div>
        <p class="text-muted-foreground">Configure the minimum token requirements for accessing protected content and features.</p>
    </div>

    <TokenGatingConfig />

    <TokenGatingDescription />
</div>
