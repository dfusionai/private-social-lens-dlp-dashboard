<script lang="ts">
    import { cn } from "$lib/utils";
    import type { HTMLInputAttributes } from "svelte/elements";

    interface Props extends Omit<HTMLInputAttributes, "type" | "value" | "oninput"> {
        value?: string;
        placeholder?: string;
        disabled?: boolean;
        required?: boolean;
        class?: string;
        label?: string;
        error?: string;
        helperText?: string;
        allowNegative?: boolean;
        leftIcon?: any;
        rightIcon?: any;
        onInput?: (event: Event) => void;
        onChange?: (event: Event) => void;
        onBlur?: (event: Event) => void;
        onFocus?: (event: Event) => void;
        onKeydown?: (event: KeyboardEvent) => void;
    }

    const {
        value = "",
        placeholder = "Enter a number",
        disabled = false,
        required = false,
        class: className = "",
        label,
        error,
        helperText,
        allowNegative = true,
        leftIcon,
        rightIcon,
        onInput,
        onChange,
        onBlur,
        onFocus,
        onKeydown,
        ...restProps
    }: Props = $props();
    function handleKeydown(event: KeyboardEvent) {
        // Call custom onKeydown handler if provided
        if (onKeydown) {
            onKeydown(event);
            return; // Let the custom handler decide whether to prevent default
        }

        // Default keydown behavior
        const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Tab", "Delete"];

        if (allowedKeys.includes(event.key)) {
            return;
        }

        // Check if the key would result in a valid number format
        const currentValue = (event.target as HTMLInputElement).value;
        const newValue = currentValue + event.key;

        // Allow: digits, decimal point, and negative sign (if allowed)
        const allowed = /^-?\d*\.?\d*$/.test(newValue);

        if (!allowed) {
            event.preventDefault();
        }
    }
</script>

<div class="w-full">
    {#if label}
        <label for={restProps.id || "number-input"} class="block text-sm font-medium text-foreground mb-2">
            {label}
            {#if required}
                <span class="text-destructive">*</span>
            {/if}
        </label>
    {/if}

    <div class="relative">
        {#if leftIcon}
            <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                <svelte:component this={leftIcon} class="h-4 w-4 text-muted-foreground" />
            </div>
        {/if}

        <input
            type="text"
            {value}
            {placeholder}
            {disabled}
            {required}
            class={cn(
                "selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground shadow-xs flex h-9 w-full min-w-0 rounded-md border py-1 text-base outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                error && "border-destructive focus-visible:ring-destructive",
                leftIcon && "pl-10",
                rightIcon && "pr-10",
                className
            )}
            on:input={onInput}
            on:change={onChange}
            on:blur={onBlur}
            on:focus={onFocus}
            on:keydown={handleKeydown}
            {...restProps}
        />

        {#if rightIcon}
            <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                <svelte:component this={rightIcon} class="h-4 w-4 text-muted-foreground" />
            </div>
        {/if}
    </div>

    {#if error}
        <p class="mt-1 text-sm text-destructive">{error}</p>
    {:else if helperText}
        <p class="mt-1 text-sm text-muted-foreground">{helperText}</p>
    {/if}
</div>
