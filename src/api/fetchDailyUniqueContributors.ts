

import { generateQuery } from "$lib/utils";
import { http, type ApiResponse } from "$lib/http/http";

export interface IDailyUniqueContributorsParams {
    startDate: string;
    endDate: string;
}

export interface IDailyUniqueContributorsItem {
    submissionDate: string;
    dailyUniqueContributors: number;
}

export async function fetchDailyUniqueContributors(params: IDailyUniqueContributorsParams   ) {
    const { startDate, endDate } = params;
    const query = generateQuery({ startDate, endDate });

    try {
        const response: ApiResponse<IDailyUniqueContributorsItem[]> = await http.get(`/api/stats/daily-unique-contributors${query}`);

        return response;
    } catch (error) {
        throw error;
    }
}