

import { http, type ApiResponse } from "../lib/http/http";

export async function fetchTotalUniqueChatIds() {
    try {
        const response: ApiResponse<any> = await http.get("/stats/total-unique-chat-ids");

        return response;
    } catch (error) {
        throw error;
    }
}