import { addDays } from "$lib/utils";

export const isFdDisabled = (date: string, jumpDay: number, maxDate: string) => {
    const newDate = addDays(new Date(date), jumpDay);

    if (newDate.isAfter(maxDate)) {
        return true;
    }

    return false;
};

