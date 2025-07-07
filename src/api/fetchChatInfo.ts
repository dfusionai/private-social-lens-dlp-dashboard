import { http, type ApiResponse } from "../lib/http/http";

interface IResponse {
    totalAccounts: number;
    totalSubmissions: number;
    totalChats: number;
}

export async function fetchChatInfo() {
    try {
        const response: ApiResponse<IResponse> = await http.get("/api/submissions/submission-data");

        return response;
    } catch (error) {
        throw error;
    }
}