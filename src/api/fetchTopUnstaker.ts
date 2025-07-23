import { generateQuery } from "$lib/utils";
import { httpIndexRequest, type ApiResponse } from "../lib/http/http";

export interface ITopUnstakerItem {
    wallet_address: string,
    unstake_amount: string
}

export interface ITopUnstakersParams {
    startDate: string
    endDate: string
}

export async function fetchTopUnstakers(params: ITopUnstakersParams) {
    const { startDate, endDate } = params;
    const query = generateQuery({ startDate, endDate });

    try {
        const response: ApiResponse<ITopUnstakerItem[]> = await httpIndexRequest.get(`/unstaking-events/get-top-5-unstakers${query}`);

        return response.data;
    } catch (error) {
        throw error;
    }
}