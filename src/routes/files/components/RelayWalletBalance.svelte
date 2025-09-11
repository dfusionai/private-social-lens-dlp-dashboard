<script>
  import { onMount } from "svelte";
  import { callRpc } from "../util/utils";
  import Separator from "$lib/components/ui/separator/separator.svelte";

  let vanaBalances = $state({});
  const WALLET_ADDRESSES_TO_CHECK = JSON.parse(import.meta.env.VITE_RELAY_WALLET_ADDRESSES || "[]");
  const SUI_DEPLOYER_WALLET = import.meta.env.VITE_SUI_DEPLOYER_ADDRESS;
  
  let suiBalance = $state(0);
  let walBalances = $state(0);

  async function fetchVanaBalanceForAddress(address) {
    try {
      const balanceWeiHex = await callRpc("eth_getBalance", [address, "latest"]);
      const balanceVana = Number(BigInt(balanceWeiHex)) / 10 ** 18; // VANA has 18 decimals
      // console.log('balanceWeiHex', balanceWeiHex);
      // console.log('balanceVana', balanceVana);
      // return formatNumber(balanceVana);
      return balanceVana;
    } catch (error) {
      console.error(`Error fetching VANA balance for ${address}:`, error);
      return "Error";
    }
  }
  
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
    const balancePromises = WALLET_ADDRESSES_TO_CHECK.map(async (address) => {
      const balance = await fetchVanaBalanceForAddress(address);
      return { address, balance };
    });

    const results = await Promise.all(balancePromises);
    
    const { sui, walrus } = await fetchSuiAndWalrusBalances(SUI_DEPLOYER_WALLET);
    suiBalance = sui;
    walBalances = walrus;
    
    results.forEach(({ address, balance }) => {
      vanaBalances = { ...vanaBalances, [address]: balance }; // Update reactive object
    });
  });
</script>

<table class="table-auto">
  <thead>
    <tr class="border-b">
      <th class="text-center">Wallet Address</th>
      <th class="text-center">Balance (VANA)</th>
      <th class="text-center">Status</th>
    </tr>
  </thead>
  <tbody>
    {#each WALLET_ADDRESSES_TO_CHECK as address}
      <tr>
        <td class="text-center"
          >{address.substring(0, 5)} ... {address.substring(address.length - 5)}</td
        >
        <td class="text-center">{vanaBalances[address] || "..."}</td>
        <td class="px-4 py-1 text-center">
          {#if vanaBalances[address] !== undefined}
            {#if typeof vanaBalances[address] === "number"}
              {#if vanaBalances[address] < 0.1}
                <div class="inline-block min-w-[60px] rounded-md bg-red-500 p-1 text-white">
                  Low!
                </div>
              {:else if vanaBalances[address] < 0.2}
                <div class="inline-block min-w-[60px] rounded-md bg-yellow-500 p-1 text-gray-900">
                  Warning
                </div>
              {:else}
                <div class="inline-block min-w-[60px] rounded-md bg-green-500 p-1 text-white">
                  OK
                </div>
              {/if}
            {:else if vanaBalances[address] === "Error"}
              <div class="inline-block min-w-[60px] rounded-md bg-gray-400 p-1 text-white">
                Error
              </div>
            {/if}
          {:else}{/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

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