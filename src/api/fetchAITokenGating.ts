import { httpAiAgent, type ApiResponse } from "../lib/http/http";

export interface IAiTokenGatingResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    stakeThreshold: string;
    balanceThreshold: string;
}
export async function fetchAiTokenGating() {
    try {
        const response: ApiResponse<IAiTokenGatingResponse> = await httpAiAgent.get(`/token-gating-configs/latest`);

        return response.data;
    } catch (error) {
        throw error;
    }
}
