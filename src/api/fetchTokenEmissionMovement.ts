import { generateQuery } from "$lib/utils";
import { httpIndexRequest, type ApiResponse } from "../lib/http/http";

export interface ITokenEmissionItem {
    reqrewardamount: string,
    date: string
}

interface ITokenEmissionMovementParams {
    startDate: string
    endDate: string
}

export async function fetchTokenEmissionMovement(params: ITokenEmissionMovementParams) {
    const { startDate, endDate } = params;
    const query = generateQuery({ startDate, endDate });

    try {
        const response: ApiResponse<ITokenEmissionItem[]> = await httpIndexRequest.get(`/request-rewards/get-token-emission-movement${query}`);

        return response.data;
    } catch (error) {
        throw error;
    }
}