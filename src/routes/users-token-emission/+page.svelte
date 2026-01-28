<script lang="ts">
    import StatisticsGrid from "./components/statistic-grid/statistic-grid.svelte";
    import DailyUniqueContributors from "./components/daily-unique-contributors/daily-unique-contributors.svelte";
    import ChatStats from "./components/chat-stats/chat-stats.svelte";
</script>

<div class="flex flex-col gap-8">
    <StatisticsGrid />
    <ChatStats />
    <DailyUniqueContributors />
</div>