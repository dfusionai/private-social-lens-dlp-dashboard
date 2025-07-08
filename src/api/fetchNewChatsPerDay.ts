

import { generateQuery } from "$lib/utils";
import { http, type ApiResponse } from "$lib/http/http";

export interface INewChatsPerDayParams {   
    startDate: string;
    endDate: string;
}

export interface INewChatsPerDayItem {
    firstSeenDate: string;
    newChats: number;
}

export async function fetchNewChatsPerDay(params: INewChatsPerDayParams) {
    const { startDate, endDate } = params;
    const query = generateQuery({ startDate, endDate });

    try {
        const response: ApiResponse<INewChatsPerDayItem[]> = await http.get(`/api/stats/new-chats-per-day${query}`);

        return response;
    } catch (error) {
        throw error;
    }
}