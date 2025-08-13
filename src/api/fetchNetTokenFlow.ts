import { generateQuery } from "$lib/utils";
import { httpIndexRequest, type ApiResponse } from "../lib/http/http";

export interface INetTokenFlowResponse {
    totalStakeAmount: string
    totalUnstakeAmount: string
    netFlow: string
    dailyNetFlow: string
    weeklyNetFlow: string
}

interface INetTokenFlowParams {
    startDate: string
    endDate: string
}

export async function fetchNetTokenFlow(params: INetTokenFlowParams) {
    const { startDate, endDate } = params;
    const query = generateQuery({ startDate, endDate });

    try {
        const response: ApiResponse<INetTokenFlowResponse> = await httpIndexRequest.get(`/staking-events/token-flow-info${query}`);

        return response.data;
    } catch (error) {
        throw error;
    }
}