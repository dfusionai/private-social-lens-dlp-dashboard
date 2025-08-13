import { httpAiAgent, type ApiResponse } from "../lib/http/http";

export interface IAiTokenGatingResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    stakeThreshold: number;
    balanceThreshold: number;
}

export interface ICreateTokenGatingConfigParams {
    stakeThreshold: number;
    balanceThreshold: number;
}

export async function createAiTokenGatingConfig(params: ICreateTokenGatingConfigParams) {
    try {
        const response: ApiResponse<IAiTokenGatingResponse> = await httpAiAgent.post(`/token-gating-configs`, params);

        return response.data;
    } catch (error) {
        throw error;
    }
}
