<script lang="ts">
    import CalendarIcon from "@lucide/svelte/icons/calendar";
    import {
        DateFormatter,
        type DateValue,
        getLocalTimeZone,
        today,
    } from "@internationalized/date";
    import { cn } from "$lib/utils.js";
    import { Calendar } from "$lib/components/ui/calendar/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import Button from "$lib/components/ui/button/button.svelte";
    import type { ComponentProps } from "svelte";
    import type { IDatePickerProps } from "./type";

    const { onChooseDate, disabled, value, ...restProps }: IDatePickerProps =
        $props();

    const df = new DateFormatter("en-US", {
        dateStyle: "long",
    });

    const todayDate = today(getLocalTimeZone());

    let shownValue = $state<DateValue>(todayDate);

    let dropdown =
        $state<ComponentProps<typeof Calendar>["captionLayout"]>("dropdown");

    function handleMonthSelect(date: DateValue | undefined) {
        if (!date) {
            return;
        }

        shownValue = date;

        if (onChooseDate) {
            onChooseDate(date);
        }
    }

    const formatDateHandler = (date: DateValue | DateValue[]) => {
        // this is a single date component
        if (Array.isArray(date)) {
            return;
        }

        if (!date) return "Select a date";

        return df.format(date.toDate(getLocalTimeZone()));
    };
</script>

<Popover.Root>
    <Popover.Trigger>
        {#snippet child({ props })}
            <Button
                variant="outline"
                class={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !shownValue && "text-muted-foreground",
                    disabled && "!cursor-not-allowed"
                )}
                {disabled}
                {...props}
            >
                <CalendarIcon class="mr-2 size-4" />
                {formatDateHandler(value || shownValue)}
            </Button>
        {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-auto p-0">
        <Calendar
            class="rounded-lg border shadow-sm"
            captionLayout={dropdown}
            onValueChange={handleMonthSelect}
            maxValue={today(getLocalTimeZone())}
            value={value || shownValue}
            {disabled}
            type="single"
            {...restProps as any}
        />
    </Popover.Content>
</Popover.Root>
