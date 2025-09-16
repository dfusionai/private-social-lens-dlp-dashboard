<script>
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { onMount } from "svelte";

  const SUI_DEPLOYER_WALLET = import.meta.env.VITE_SUI_DEPLOYER_ADDRESS;
  
  let suiBalance = $state('0');
  let walBalances = $state('0');
  
  async function fetchSuiAndWalrusBalances(address) {
    try {
      const response = await fetch('https://fullnode.mainnet.sui.io:443', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "suix_getAllBalances",
          params: [address]
        })
      });
      const result = await response.json();
      const balances = result.result; // Array of coin balances

      // SUI balance: 1 SUI = 1e9 mist
      const suiEntry = balances.find(
        (entry) => entry.coinType === "0x2::sui::SUI"
      );
      const suiBalanceMist = suiEntry ? BigInt(suiEntry.totalBalance) : BigInt(0);
      const suiBalance = Number(suiBalanceMist) / 1e9;

      // WALRUS balance: assuming WAL also has 9 decimals (adjust if different!)
      const walEntry = balances.find(
        (entry) => entry.coinType === "0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL"
      );
      const walBalanceRaw = walEntry ? BigInt(walEntry.totalBalance) : BigInt(0);
      const walBalance = Number(walBalanceRaw) / 1e9; // Change decimals if WAL is different

      return { sui: suiBalance, walrus: walBalance };
    } catch (error) {
      console.error(`Error fetching balances for ${address}:`, error);
      return { sui: "Error", walrus: "Error" };
    }
  }

  onMount(async () => {
    const { sui, walrus } = await fetchSuiAndWalrusBalances(SUI_DEPLOYER_WALLET);
    suiBalance = Number(sui).toFixed(5);
    walBalances = Number(walrus).toFixed(5);
  });
</script>


<Separator class="my-8" />

<div class="flex flex-row justify-evenly items-center gap-4">
  <div class="flex flex-1 flex-col gap-2 bg-[#101520] p-4 rounded-2xl">
    <h3 class="text-2xl mb-4 font-bold">SUI Balance:</h3>
    <p class="font-bold">{suiBalance}</p>
  </div>
    
  <div class="flex flex-1 flex-col gap-2 bg-[#101520] p-4 rounded-2xl">
    <h3 class="text-2xl mb-4 font-bold">WAL Balance:</h3>
    <p class="font-bold">{walBalances}</p>
  </div>
</div>