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

    type IDatePickerProps = Omit<ComponentProps<typeof Calendar>, "type"> & {
        onChooseDate?: (date: string) => void;
    };

    const { onChooseDate, disabled, ...restProps }: IDatePickerProps = $props();

    const df = new DateFormatter("en-US", {
        dateStyle: "long",
    });

    let shownValue = $state<string>(
        df.format(today(getLocalTimeZone()).toDate(getLocalTimeZone()))
    );

    let dropdown =
        $state<ComponentProps<typeof Calendar>["captionLayout"]>("dropdown");

    function handleMonthSelect(date: DateValue | undefined) {
        if (!date) {
            shownValue = "";
            return;
        }

        const chosenDate = df.format(date.toDate(getLocalTimeZone()));

        shownValue = chosenDate;

        if (onChooseDate) {
            onChooseDate(chosenDate);
        }
    }
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
                {shownValue || "Select a date"}
            </Button>
        {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-auto p-0">
        <Calendar
            class="rounded-lg border shadow-sm"
            captionLayout={dropdown}
            onValueChange={handleMonthSelect}
            maxValue={today(getLocalTimeZone())}
            {disabled}
            type="single"
            {...restProps as any}
        />
    </Popover.Content>
</Popover.Root>
