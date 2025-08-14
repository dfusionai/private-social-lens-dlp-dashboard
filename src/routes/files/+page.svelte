<script lang="ts">
  import { onMount } from "svelte";
  import FileRefinements from "./components/FileRefinements.svelte";
  import RelayWalletBalance from "./components/RelayWalletBalance.svelte";
  import { callRpc, formatNumber, padHex } from "./util/utils";

  const rpcUrl = import.meta.env.VITE_RPC_URL;
  const DLP_ADDRESS = import.meta.env.VITE_DLP_ADDRESS;
  const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS;
  const DATA_REGISTRY_ADDRESS = import.meta.env.VITE_DATA_REGISTRY_ADDRESS;

  // let balance = $state("…");
  let fileCount = $state("…");
  let fileCountNumber = $state(0);
  let lastUploadTs = $state(0);

  const lastUpload = $derived(
    (() => {
      if (lastUploadTs === 0) return "...";
      return new Date(lastUploadTs).toLocaleString();
    })()
  );

  const warning = $derived(lastUploadTs > 0 && Date.now() - lastUploadTs > 3_600_000);

  // async function fetchBalance() {
  //   try {
  //     const balData = await callRpc("eth_call", [
  //       {
  //         to: TOKEN_ADDRESS,
  //         data: "0x70a08231" + padHex(DLP_ADDRESS)
  //       },
  //       "latest"
  //     ]);

  //     balance = formatNumber(Number(BigInt(balData)) / 1e18);
  //   } catch {
  //     balance = "Error";
  //   }
  // }

  async function fetchCount() {
    try {
      const countData = await callRpc("eth_call", [
        { to: DLP_ADDRESS, data: "0x7ccf35a6" },
        "latest"
      ]);

      const cnt = Number(BigInt(countData));

      fileCountNumber = cnt;
      fileCount = formatNumber(cnt);

      if (cnt > 0) {
        await fetchLastUpload(cnt - 1);
      } else {
        lastUploadTs = 0;
      }
    } catch {
      fileCount = "Error";
      lastUploadTs = 0;
    }
  }

  async function fetchLastUpload(idx) {
    const listAtData = await callRpc("eth_call", [
      {
        to: DLP_ADDRESS,
        data: "0x3b3cd378" + padHex(idx.toString(16))
      },
      "latest"
    ]);

    const fileId = Number(BigInt(listAtData));

    const fileData = await callRpc("eth_call", [
      {
        to: DLP_ADDRESS,
        data: "0xf4c714b4" + padHex(fileId.toString(16))
      },
      "latest"
    ]);

    const tsHex = "0x" + fileData.slice(2 + 64, 2 + 64 * 2);

    lastUploadTs = Number(BigInt(tsHex)) * 1000;
  }

  onMount(() => {
    // fetchBalance();
    fetchCount();
  });
</script>

<div class="flex flex-col gap-6">
  <!-- <h1 class="text-[#FB9C2D] text-5xl">Files</h1> -->

  <div class="flex flex-row justify-between gap-4">
    <!-- <div class="flex flex-1 flex-col gap-2 bg-[#101520] p-4 rounded-2xl">
      <h3 class="text-2xl mb-4 font-bold">$VFSN Balance:</h3>
      <p class="font-bold">{balance}</p>
    </div> -->

    <div class="flex flex-1 flex-col gap-2 bg-[#101520] p-4 rounded-2xl">
      <h3 class="text-2xl mb-4 font-bold">Files Uploaded:</h3>
      <p class="font-bold">{fileCount}</p>
    </div>
    <div class="flex flex-1 flex-col gap-2 bg-[#101520] p-4 rounded-2xl">
    <h3 class="text-2xl mb-4 font-bold">Last Upload:</h3>
    <p class="font-bold">{lastUpload}</p>

    {#if warning}
      <span class="warning">⚠️ Last upload was over an hour ago</span>
    {/if}
  </div>
  </div>



  <div class="flex flex-1 flex-col gap-2 bg-[#101520] p-4 rounded-2xl">
    <h3 class="text-2xl mb-4 font-bold">Recent File Refinements</h3>
    <FileRefinements {fileCountNumber} />
  </div>

  <div class="flex flex-1 flex-col gap-2 bg-[#101520] p-4 rounded-2xl">
    <h3 class="text-2xl mb-4 font-bold">$VFSN Relay Balances:</h3>
    <RelayWalletBalance />
  </div>
</div>