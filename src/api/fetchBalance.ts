import { ENV_CONFIG } from "$lib/const";
import { callRpc, padHex, formatNumber } from "$lib/utils";

export async function fetchBalance() {
    try {
        const balData = await callRpc(
            "eth_call",
            [
                {
                    to: ENV_CONFIG.VITE_TOKEN_ADDRESS,
                    data:
                        "0x70a08231" + padHex(ENV_CONFIG.VITE_DLP_ADDRESS),
                },
                "latest",
            ],
            ENV_CONFIG.VITE_RPC_URL
        );

        return Number(BigInt(balData)) / 1e18;
    } catch (error) {
        console.error("🚀 ~ fetchBalance ~ error:", error);
        throw error;
    }
}
