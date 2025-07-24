<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import { navigate } from "$lib/router";
</script>

<div>
    <div
        class="flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8"
    >
        <div class="mx-auto max-w-md text-center">
            <h1
                class="mt-4 text-6xl font-bold tracking-tight text-foreground sm:text-7xl"
            >
                404
            </h1>
            <p class="mt-4 text-xl text-muted-foreground">
                Oops, the page you are looking for could not be found.
            </p>
            <div class="mt-6">
                <Button
                    onclick={() => {
                        navigate("/", true);
                    }}
                    class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    Go to Homepage
                </Button>
            </div>
        </div>
    </div>
</div>
