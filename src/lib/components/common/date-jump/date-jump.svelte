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
        today,
        type DateValue,
    } from "@internationalized/date";
    import { Calendar } from "$lib/components/ui/calendar";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { addDays, cn } from "$lib/utils";
    import type { ComponentProps } from "svelte";
    import { isFdDisabled } from "./utils";
    import type { IDateJumpProps } from "./type";

    const { jumpDay, disabled, onChooseDate }: IDateJumpProps = $props();

    const maxDate = new Date().toDateString();
    const df = new DateFormatter("en-US", {
        dateStyle: "long",
    });

    let dropdown =
        $state<ComponentProps<typeof Calendar>["captionLayout"]>("dropdown");
    let shownValue = $state<string>(maxDate);
    let shouldDisabledForward = $derived<boolean>(
        isFdDisabled(shownValue, jumpDay, maxDate)
    );

    const onForward = () => {
        if (!shownValue) {
            return;
        }

        const newDate = addDays(new Date(shownValue), jumpDay);

        if (newDate.isAfter(maxDate)) {
            return;
        }

        const chosenDate = df.format(newDate.toDate());
        shownValue = chosenDate;

        if (onChooseDate) {
            onChooseDate(chosenDate);
        }
    };

    const onBackward = () => {
        if (!shownValue) {
            return;
        }

        const newDate = addDays(new Date(shownValue), -jumpDay);

        const chosenDate = df.format(newDate.toDate());
        shownValue = chosenDate;

        if (onChooseDate) {
            onChooseDate(chosenDate);
        }
    };

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
