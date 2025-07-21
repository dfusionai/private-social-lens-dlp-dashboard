<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import {
        CalendarIcon,
        ChevronLeftIcon,
        ChevronRightIcon,
    } from "@lucide/svelte";
    import {
        DateFormatter,
        getLocalTimeZone,
        parseDate,
        today,
        type DateValue,
    } from "@internationalized/date";
    import { Calendar } from "$lib/components/ui/calendar";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { addDays, cn, formatDate } from "$lib/utils";
    import type { ComponentProps } from "svelte";
    import { isFdDisabled } from "./utils";
    import type { IDateJumpProps } from "./type";

    const { jumpDay, disabled, value, onChooseDate }: IDateJumpProps = $props();

    const df = new DateFormatter("en-US", {
        dateStyle: "long",
    });
    let dropdown =
        $state<ComponentProps<typeof Calendar>["captionLayout"]>("dropdown");
    const todayDate = today(getLocalTimeZone());
    let shownValue = $state<DateValue>(todayDate);
    let shouldDisabledForward = $derived<boolean>(
        isFdDisabled(shownValue, jumpDay, todayDate)
    );

    const onForward = () => {
        if (!shownValue) {
            return;
        }

        const newDate = addDays(shownValue.toDate(getLocalTimeZone()), jumpDay);
        const formattedDate = parseDate(
            formatDate(newDate.toDate(), "YMD_DASH")
        );

        if (newDate.isAfter(todayDate.toDate(getLocalTimeZone()))) {
            return;
        }

        shownValue = formattedDate;

        if (onChooseDate) {
            onChooseDate(formattedDate);
        }
    };

    const onBackward = () => {
        if (!shownValue) {
            return;
        }

        const newDate = addDays(
            shownValue.toDate(getLocalTimeZone()),
            -jumpDay
        );
        const formattedDate = parseDate(
            formatDate(newDate.toDate(), "YMD_DASH")
        );

        shownValue = formattedDate;

        if (onChooseDate) {
            onChooseDate(formattedDate);
        }
    };

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

<div class="flex items-center gap-2">
    <Button
        class="!p-0 !px-2 !bg-card border cursor-pointer dark:data-[selected]:hover:bg-accent/50"
        {disabled}
        onclick={onBackward}
    >
        <ChevronLeftIcon class="!h-4 !qw-4 text-btn-foreground" />
    </Button>

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
            />
        </Popover.Content>
    </Popover.Root>

    <Button
        class={cn(
            "!p-0 !px-2 !bg-card border cursor-pointer",
            shouldDisabledForward && "!cursor-not-allowed"
        )}
        disabled={shouldDisabledForward || disabled}
        onclick={onForward}
    >
        <ChevronRightIcon class="!h-4 !qw-4 text-btn-foreground" />
    </Button>
</div>
