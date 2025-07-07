

import { generateQuery } from "$lib/utils";
import { http, type ApiResponse } from "$lib/http/http";

export interface IRefreshedChatsCountParams {   
    startDate: string;
    endDate: string;
}

export async function fetchRefreshedChatsCount(params: IRefreshedChatsCountParams) {
    const { startDate, endDate } = params;
    const query = generateQuery({ startDate, endDate });

    try {
        const response: ApiResponse<any> = await http.get(`/api/stats/refreshed-chats-count${query}`);

        return response;
    } catch (error) {
        throw error;
    }
}