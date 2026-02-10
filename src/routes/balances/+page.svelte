<script lang="ts">
  import SuiRelayWalletBalance from "./components/SuiRelayWalletBalance.svelte";
  import VanaRelayWalletBalance from "./components/VanaRelayWalletBalance.svelte";
  import VanaOutflowChart from "./components/VanaOutflowChart.svelte";
  import VanaWalletGasFeesChart from "./components/VanaWalletGasFeesChart.svelte";
</script>

<div class="flex flex-col gap-6 text-white">

  <div class="flex flex-1 flex-wrap gap-4">
    <div class="flex flex-1 min-w-0 flex-col gap-2 bg-[#171717] p-4 rounded-2xl">
      <h3 class="text-2xl mb-4 font-bold">$VFSN Relay Balances:</h3>
      <VanaRelayWalletBalance />
    </div>
    <div class="flex flex-1 min-w-0 flex-col gap-2 bg-[#171717] p-4 rounded-2xl">
      <h3 class="text-2xl mb-4 font-bold">Sui Relay Balances:</h3>
      <SuiRelayWalletBalance />
    </div>
  </div>

  <div class="flex flex-1 flex-col gap-2 bg-[#171717] p-4 rounded-2xl">
    <VanaOutflowChart />
  </div>

  <div class="flex flex-1 flex-col gap-2 bg-[#171717] p-4 rounded-2xl">
    <h3 class="text-2xl mb-4 font-bold">Vana Relay Wallet Gas Fees</h3>
    <VanaWalletGasFeesChart />
  </div>
</div>