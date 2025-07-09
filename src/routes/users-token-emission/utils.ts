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
