<script>
  import { onMount } from "svelte";
  import { callRpc } from "$lib/utils";

  let vanaBalances = $state({});
  const WALLET_ADDRESSES_TO_CHECK = JSON.parse(import.meta.env.VITE_RELAY_WALLET_ADDRESSES || "[]");
  const rpcUrl = import.meta.env.VITE_RPC_URL;

  async function fetchVanaBalanceForAddress(address) {
    try {
      const balanceWeiHex = await callRpc(
        "eth_getBalance",
        [address, "latest"],
        rpcUrl
      );
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
  

  onMount(async () => {
    const balancePromises = WALLET_ADDRESSES_TO_CHECK.map(async (address) => {
      const balance = await fetchVanaBalanceForAddress(address);
      return { address, balance };
    });

    const results = await Promise.all(balancePromises);
    
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
