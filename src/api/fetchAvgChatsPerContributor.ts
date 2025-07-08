

import { http, type ApiResponse } from "$lib/http/http";

export async function fetchAvgChatsPerContributor() {

    try {
        const response: ApiResponse<number> = await http.get(`/api/stats/average-chats-per-contributor`);

        return response;
    } catch (error) {
        throw error;
    }
}