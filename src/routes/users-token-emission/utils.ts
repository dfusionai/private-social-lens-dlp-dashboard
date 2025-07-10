import { daysPerMonth } from "$lib/const";
import { formatDate, formatDecimalNumber, formatNumberIntoShort, generateDailyChartData } from "../../lib/utils";

export const generateValueString = (value: string) => {
    if (!value) return "-";
    return formatDecimalNumber(Number(value));
};

export const getDateParams = (selectedDateIndex: number) => {
    const monthData = generateDailyChartData(
        selectedDateIndex,
        selectedDateIndex + daysPerMonth
    );

    const params = {
        startDate: formatDate(monthData[0].date, "YMD_DASH"),
        endDate: formatDate(monthData[monthData.length - 1].date, "YMD_DASH"),
    };

    return params
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

export const generateChatStatsParams = (from: number, to: number) => {
    const weekData = generateChatStatsData(from, to);

    const params: { startDate: string, endDate: string }[] = [];

    for (let i = 0; i < weekData.length - 1; i++) {
        const startDate = formatDate(weekData[i].date, "YMD_DASH");
        const endDate = formatDate(weekData[i + 1].date, "YMD_DASH");

        params.push({ startDate, endDate });
    }

    return params;
}

