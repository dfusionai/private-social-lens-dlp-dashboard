import type { DateValue } from "@internationalized/date";

export interface IDateJumpProps {
    jumpDay: number;
    disabled?: boolean;
    value?: DateValue;
    onChooseDate?: (date: DateValue) => void;
}