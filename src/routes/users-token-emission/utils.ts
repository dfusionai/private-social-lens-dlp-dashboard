import { formatDate, formatDecimalNumber } from "../../lib/utils";

interface IChatItem {
    date: Date;
    newChats: number;
    refreshedChats: number;
}

export const generateValueString = (value: string) => {
    if (!value) return "-";
    return formatDecimalNumber(Number(value));
};

export const generateChatStatsData = (from: number, to: number) => {
    const data = [];
    const now = new Date();

    for (let i = to; i >= from; i--) {
        const date = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - i
        );
        data.push({ date, newChats: 0, refreshedChats: 0 });
    }

    return data;
};

export const generateChatStatsParams = (chatStatsData: IChatItem[]) => {
    const params: { startDate: string, endDate: string }[] = [];

    for (let i = 0; i < chatStatsData.length - 1; i++) {
        const startDate = formatDate(chatStatsData[i].date, "YMD_DASH");
        const endDate = formatDate(chatStatsData[i + 1].date, "YMD_DASH");

        params.push({ startDate, endDate });
    }

    return params;
}

