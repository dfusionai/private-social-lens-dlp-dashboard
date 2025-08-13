import { generateQuery } from "$lib/utils";
import { httpIndexRequest, type ApiResponse } from "../lib/http/http";

export interface ITopStakerItem {
    wallet_address: string,
    stake_amount: string
}

export interface ITopStakersParams {
    startDate: string
    endDate: string
}

export async function fetchTopStakers(params: ITopStakersParams) {
    const { startDate, endDate } = params;
    const query = generateQuery({ startDate, endDate });

    try {
        const response: ApiResponse<ITopStakerItem[]> = await httpIndexRequest.get(`/staking-events/top-5-stakers${query}`);

        return response.data;
    } catch (error) {
        throw error;
    }
}