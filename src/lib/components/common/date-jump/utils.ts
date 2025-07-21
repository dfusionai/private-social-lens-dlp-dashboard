import { addDays } from "$lib/utils";
import { getLocalTimeZone, type DateValue } from "@internationalized/date";

export const isFdDisabled = (
    date: DateValue,
    jumpDay: number,
    maxDate: DateValue
) => {
    const newDate = addDays(date.toDate(getLocalTimeZone()), jumpDay);

    if (newDate.isAfter(maxDate.toDate(getLocalTimeZone()))) {
        return true;
    }

    return false;
};

