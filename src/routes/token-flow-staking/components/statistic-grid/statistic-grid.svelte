<script lang="ts">
    import CurrentRewardPool from "./current-reward-pool.svelte";
    import NetFlow from "./net-flow.svelte";
    import TopStakers from "./top-stakers.svelte";
    import TokenVelocity from "./token-velocity.svelte";
    import ContributorStatistics from "./contributor-statistics.svelte";
</script>

<div class="grid grid-cols-[repeat(auto-fit,minmax(425px,1fr))] gap-6">
    <NetFlow />
    <ContributorStatistics />
    <TopStakers />
    <CurrentRewardPool />
    <TokenVelocity />
</div>
