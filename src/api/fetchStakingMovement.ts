import { generateQuery } from "$lib/utils";
import { httpIndexRequest, type ApiResponse } from "../lib/http/http";

export interface IStakeItem {
    stakeamount: string,
    date: string
}

interface IStakeMovementParams {
    startDate: string
    endDate: string
}

export async function fetchStakingMovement(params: IStakeMovementParams) {
    const { startDate, endDate } = params;
    const query = generateQuery({ startDate, endDate });

    try {
        const response: ApiResponse<IStakeItem[]> = await httpIndexRequest.get(`/staking-events/get-staking-movement${query}`);

        return response.data;
    } catch (error) {
        throw error;
    }
}