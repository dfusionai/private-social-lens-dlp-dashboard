<script lang="ts">
    import UnderConstruction from "$lib/components/layout/under-construction/under-construction.svelte";
    import { onMount } from "svelte";
    import { ENV_CONFIG } from "$lib/const";

    const rpcUrl = ENV_CONFIG.VITE_RPC_URL;
    const DLP_ADDRESS = ENV_CONFIG.VITE_DLP_ADDRESS;
    const STAKING_ADDRESS = ENV_CONFIG.VITE_STAKING_ADDRESS;
    const TOKEN_ADDRESS = ENV_CONFIG.VITE_TOKEN_ADDRESS;

    let balance = $state("…");
    let fileCount = $state("…");
    let lastUploadTs = $state(0);

    const lastUpload = $derived(
        (() => {
            if (lastUploadTs === 0) return "...";
            return new Date(lastUploadTs).toLocaleString();
        })()
    );

    const warning = $derived(
        lastUploadTs > 0 && Date.now() - lastUploadTs > 3_600_000
    );

    function padHex(hex: string) {
        return hex.replace(/^0x/, "").padStart(64, "0");
    }

    async function callRpc(method: string, params: any[]) {
        const res = await fetch(rpcUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        });

        const { result, error } = await res.json();

        if (error) throw new Error(error.message);
        return result;
    }

    function formatNumber(n: number) {
        return n.toLocaleString("en-US");
    }

    async function fetchBalance() {
        try {
            const balData = await callRpc("eth_call", [
                {
                    to: TOKEN_ADDRESS,
                    data: "0x70a08231" + padHex(DLP_ADDRESS),
                },
                "latest",
            ]);

            balance = formatNumber(Number(BigInt(balData)) / 1e18);
        } catch {
            balance = "Error";
        }
    }

    async function fetchCount() {
        try {
            const countData = await callRpc("eth_call", [
                { to: DLP_ADDRESS, data: "0x7ccf35a6" },
                "latest",
            ]);

            const cnt = Number(BigInt(countData));

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

    async function fetchLastUpload(idx: number) {
        const listAtData = await callRpc("eth_call", [
            {
                to: DLP_ADDRESS,
                data: "0x3b3cd378" + padHex(idx.toString(16)),
            },
            "latest",
        ]);

        const fileId = Number(BigInt(listAtData));

        const fileData = await callRpc("eth_call", [
            {
                to: DLP_ADDRESS,
                data: "0xf4c714b4" + padHex(fileId.toString(16)),
            },
            "latest",
        ]);

        const tsHex = "0x" + fileData.slice(2 + 64, 2 + 64 * 2);

        lastUploadTs = Number(BigInt(tsHex)) * 1000;
    }

    onMount(() => {
        fetchBalance();
        fetchCount();
    });
</script>

<div>
    <!-- <UnderConstruction /> -->

    <div>
        <h1>Token Flow Staking</h1>
        <p>Balance: {balance}</p>
        <p>File Count: {fileCount}</p>
        <p>Last Upload: {lastUpload}</p>
    </div>
</div>
