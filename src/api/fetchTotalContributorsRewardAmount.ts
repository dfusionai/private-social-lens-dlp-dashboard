import { ENV_CONFIG } from "$lib/const";
import { callRpc } from "$lib/utils";

export async function fetchTotalContributorsRewardAmount() {
    try {
        const totalContributorsRewardAmount = await callRpc(
            "eth_call",
            [
                {
                    to: ENV_CONFIG.VITE_DLP_ADDRESS,
                    data: "0xc41d3b63",
                },
                "latest",
            ],
            ENV_CONFIG.VITE_RPC_URL
        );

        return Number(totalContributorsRewardAmount) / Math.pow(10, 18);
    } catch (error) {
        console.error("🚀 ~ fetchBalance ~ error:", error);
        throw error;
    }
}
