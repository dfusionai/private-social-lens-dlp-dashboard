<script lang="ts">
  import SuiRelayWalletBalance from "./components/SuiRelayWalletBalance.svelte";
  import VanaRelayWalletBalance from "./components/VanaRelayWalletBalance.svelte";
</script>

<div class="flex flex-col gap-6 text-white">

  <div class="flex flex-1 flex-col gap-2 bg-[#101520] p-4 rounded-2xl">
    <h3 class="text-2xl mb-4 font-bold">$VFSN Relay Balances:</h3>
    <VanaRelayWalletBalance />
  </div>

  
  <div class="flex flex-1 flex-col gap-2 bg-[#101520] p-4 rounded-2xl">
    <h3 class="text-2xl mb-4 font-bold">Sui Relay Balances:</h3>
    <SuiRelayWalletBalance />
  </div>
  
</div>