import { ENV_CONFIG } from "$lib/const";
import { callRpc } from "$lib/utils";

export async function fetchTotalUniqueChat() {
    try {
        const totalUniqueChats = await callRpc(
            "eth_call",
            [
                {
                    to: ENV_CONFIG.VITE_DLP_ADDRESS,
                    data: "0x7ccf35a6",
                },
                "latest",
            ],
            ENV_CONFIG.VITE_RPC_URL
        );

        return Number(totalUniqueChats);
    } catch (error) {
        throw error;
    }
}