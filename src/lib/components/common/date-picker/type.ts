import type { DateValue } from "@internationalized/date";
import type { Calendar as CalendarPrimitive } from "bits-ui";

export type IDatePickerProps = Partial<CalendarPrimitive.RootProps> & {
    disabled?: boolean;
    captionLayout?: "dropdown" | "dropdown-months" | "dropdown-years" | "label";
    maxValue?: DateValue;
    onChooseDate?: (date: DateValue) => void;
};
