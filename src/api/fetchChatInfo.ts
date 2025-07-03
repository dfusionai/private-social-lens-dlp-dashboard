
interface IResponse {
    totalAccounts: number;
    totalSubmissions: number;
    totalChats: number;
}

export async function fetchChatInfo() {
    try {
        const chatInfo = await fetch(
            "https://api.vana.genesis.dfusion.ai/api/submissions/submission-data",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const data: IResponse = await chatInfo.json();

        return data;
    } catch (error) {
        throw error;
    }
}
