<script lang="ts">
    import CurrentRewardPool from "./current-reward-pool.svelte";
    import NetFlow from "./net-flow.svelte";
    import TopStakers from "./top-stakers.svelte";
    import TokenVelocity from "./token-velocity.svelte";
</script>

<div class="grid grid-cols-[repeat(auto-fit,minmax(450px,1fr))] gap-6">
    <NetFlow />
    <TopStakers />
    <CurrentRewardPool />
    <TokenVelocity />
</div>
