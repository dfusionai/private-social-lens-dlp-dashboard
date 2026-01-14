<script>
  import { onMount } from "svelte";
  import { ENV_CONFIG } from "$lib/const";

  const SUI_DEPLOYER_WALLET = ENV_CONFIG.VITE_SUI_DEPLOYER_ADDRESS;

  // Collect all sub wallet addresses from environment variable (JSON array)
  const SUB_WALLET_ADDRESSES = JSON.parse(ENV_CONFIG.VITE_SUI_SUB_WALLET_ADDRESSES || "[]");
  
  let mainWalletBalance = $state({ sui: '0', walrus: '0' });
  let walletBalances = $state({});
  
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
    // Fetch main wallet balance
    if (SUI_DEPLOYER_WALLET) {
      const mainBalances = await fetchSuiAndWalrusBalances(SUI_DEPLOYER_WALLET);
      mainWalletBalance = {
        sui: typeof mainBalances.sui === "number" ? mainBalances.sui.toFixed(5) : mainBalances.sui,
        walrus: typeof mainBalances.walrus === "number" ? mainBalances.walrus.toFixed(5) : mainBalances.walrus
      };
    }

    // Fetch sub wallet balances
    const balancePromises = SUB_WALLET_ADDRESSES.map(async (address) => {
      const balances = await fetchSuiAndWalrusBalances(address);
      return { address, ...balances };
    });

    const results = await Promise.all(balancePromises);
    
    results.forEach(({ address, sui, walrus }) => {
      walletBalances = { 
        ...walletBalances, 
        [address]: { sui, walrus }
      };
    });
  });
</script>

<!-- Main Deployer Wallet Balance -->
{#if SUI_DEPLOYER_WALLET}
  <div class="flex flex-row justify-evenly items-center gap-4 mb-6">
    <div class="flex flex-1 flex-col gap-2 bg-[#101520] p-4 rounded-2xl">
      <h3 class="text-2xl mb-4 font-bold">Deployer/Main SUI:</h3>
      <p class="font-bold">{mainWalletBalance.sui}</p>
    </div>
    
    <div class="flex flex-1 flex-col gap-2 bg-[#101520] p-4 rounded-2xl">
      <h3 class="text-2xl mb-4 font-bold">Deployer/Main WAL:</h3>
      <p class="font-bold">{mainWalletBalance.walrus}</p>
    </div>
  </div>
{/if}

<!-- Sub Wallets -->
<div class="mt-6">
  <h3 class="text-2xl mb-4 font-bold">Sub Wallet Addresses:</h3>

<table class="table-auto w-full">
  <thead>
    <tr class="border-b">
      <th class="text-center px-4 py-2">Wallet Address</th>
      <th class="text-center px-4 py-2">SUI Balance</th>
      <th class="text-center px-4 py-2">Walrus Balance</th>
      <th class="text-center px-4 py-2">Status</th>
    </tr>
  </thead>
  <tbody>
    {#each SUB_WALLET_ADDRESSES as address}
      <tr>
        <td class="text-center px-4 py-2">
          {address.substring(0, 5)} ... {address.substring(address.length - 5)}
        </td>
        <td class="text-center px-4 py-2">
          {#if walletBalances[address]?.sui !== undefined}
            {typeof walletBalances[address].sui === "number" 
              ? walletBalances[address].sui.toFixed(5) 
              : walletBalances[address].sui}
          {:else}
            ...
          {/if}
        </td>
        <td class="text-center px-4 py-2">
          {#if walletBalances[address]?.walrus !== undefined}
            {typeof walletBalances[address].walrus === "number" 
              ? walletBalances[address].walrus.toFixed(5) 
              : walletBalances[address].walrus}
          {:else}
            ...
          {/if}
        </td>
        <td class="px-4 py-2 text-center">
          {#if walletBalances[address] !== undefined}
            {#if typeof walletBalances[address].sui === "number" && typeof walletBalances[address].walrus === "number"}
              {#if walletBalances[address].sui < 0.1 || walletBalances[address].walrus < 0.1}
                <div class="inline-block min-w-[60px] rounded-md bg-red-500 p-1 text-white">
                  Low!
                </div>
              {:else if walletBalances[address].sui < 0.2 || walletBalances[address].walrus < 0.2}
                <div class="inline-block min-w-[60px] rounded-md bg-yellow-500 p-1 text-gray-900">
                  Warning
                </div>
              {:else}
                <div class="inline-block min-w-[60px] rounded-md bg-green-500 p-1 text-white">
                  OK
                </div>
              {/if}
            {:else if walletBalances[address].sui === "Error" || walletBalances[address].walrus === "Error"}
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
</div>