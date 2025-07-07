

import { generateQuery } from "$lib/utils";
import { http, type ApiResponse } from "$lib/http/http";

export interface IUsersByAppDailyParams {   
    startDate: string;
    endDate: string;
}

export async function fetchUsersByAppDaily(params: IUsersByAppDailyParams) {
    const { startDate, endDate } = params;
    const query = generateQuery({ startDate, endDate });

    try {
        const response: ApiResponse<any> = await http.get(`/api/stats/users-by-app-daily${query}`);

        return response;
    } catch (error) {
        throw error;
    }
}