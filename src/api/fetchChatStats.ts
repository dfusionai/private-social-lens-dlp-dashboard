

import { http, type ApiResponse } from "$lib/http/http";
import { generateQuery } from "$lib/utils";

interface IChatStatsParams {
    startDate: string;
    endDate: string;
}

interface IChatStatItem {
    NewChats: number;
    RefreshChats: number;
}

export async function fetchChatStats(params: IChatStatsParams) {
    const { startDate, endDate } = params;
    const queryString = generateQuery({ startDate, endDate });

    try {
        const response: ApiResponse<IChatStatItem> = await http.get(`/api/stats/chats-stats${queryString}`);

        return response.data;
    } catch (error) {
        throw error;
    }
}

