<script lang="ts">

  import { onMount } from "svelte";

  import StakingMovement from "./components/staking-movement/staking-movement.svelte";

  let loading = true;

  onMount(async () => {
    // try {
    //   const StakingData = await fetchStakingGraph({ query: STAKING_QUERY });
    //   const DlpData = await fetchDlpGraph({ query: DLP_QUERY });
    //   const TokenData = await fetchTokenGraph({ query: TOKEN_QUERY });
    // } catch (err) {
    //   const error = err instanceof Error ? err.message : "Unknown error";
    //   throw new Error(`Failed to fetch graph data: ${error}`);
    // } finally {
    //   loading = false;
    // }
  });
</script>

<!-- <div>
    <div class="mb-8"><StatisticGrid /></div>
    <div class="flex flex-col gap-8">
        <StakingMovementChartWeek />
        <StakingMovementChartMonth />
    </div>
</div> -->

<div>
    <StakingMovement />
</div>
