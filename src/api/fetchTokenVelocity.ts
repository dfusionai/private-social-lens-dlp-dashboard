import { generateQuery } from "$lib/utils";
import { httpIndexRequest, type ApiResponse } from "../lib/http/http";

export interface ITokenVelocity {
    tokenVelocity: string,
}

export interface ITokenVelocityParams {
    startDate: string
    endDate: string
}

export async function fetchTokenVelocity(params: ITokenVelocityParams) {
    const { startDate, endDate } = params;
    const query = generateQuery({ startDate, endDate });

    try {
        const response: ApiResponse<ITokenVelocity> = await httpIndexRequest.get(`/staking-events/token-velocity${query}`);

        return response.data;
    } catch (error) {
        throw error;
    }
}