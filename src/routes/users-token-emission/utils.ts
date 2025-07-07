import { formatDecimalNumber, formatNumberIntoShort } from "../../lib/utils";

export const generateValueString = (value: string) => {
    if (!value) return "-";
    return formatNumberIntoShort(Number(value));
};

export const generatePercentString = (value: string) => {
    if (!value) return "-";
    return formatDecimalNumber(Number(value)) + "%";
};
