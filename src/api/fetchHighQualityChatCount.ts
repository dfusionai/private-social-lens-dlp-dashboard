import { fetchDirect, type ApiResponse } from "$lib/http/http";

interface HighQualityChatCountResponse {
    container: string;
    count: number;
    updated_at: string;
    inventory_file: string;
    status: string;
}

const HIGH_QUALITY_CHAT_COUNT_URL = "https://blob-count-api.happyfield-d4613d37.eastus.azurecontainerapps.io";

export async function fetchHighQualityChatCount() {
    try {
        const response: ApiResponse<HighQualityChatCountResponse> = await fetchDirect<HighQualityChatCountResponse>(
            "/count",
            { method: "GET" },
            HIGH_QUALITY_CHAT_COUNT_URL
        );

        return {
            ...response,
            data: response.data.count,
        };
    } catch (error) {
        throw error;
    }
}

