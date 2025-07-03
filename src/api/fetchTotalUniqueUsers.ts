import { ENV_CONFIG } from "$lib/const";
import { callRpc } from "$lib/utils";

export async function fetchTotalUniqueUsers() {
    try {
        const totalUniqueUsers = await callRpc(
            "eth_call",
            [
                {
                    to: ENV_CONFIG.VITE_DLP_ADDRESS,
                    data: "0x7569b3d7",
                },
                "latest",
            ],
            ENV_CONFIG.VITE_RPC_URL
        );

        return Number(totalUniqueUsers);
    } catch (error) {
        throw error;
    }
}