import type { DateValue } from "@internationalized/date";

export type IDatePickerProps = {
    disabled?: boolean;
    captionLayout?:
        | "dropdown"
        | "dropdown-months"
        | "dropdown-years"
        | "label";
    maxValue?: DateValue;
    onChooseDate?: (date: string) => void;
};