<script lang="ts">
  import ServerHealthChecks from "./components/ServerHealthChecks.svelte";
</script>

<div class="flex flex-col gap-6 text-white">

  <div class="flex flex-1 flex-col gap-2 bg-[#101520] p-4 rounded-2xl">
    <h3 class="text-2xl mb-4 font-bold">Server Ping Status</h3>
    <ServerHealthChecks />
  </div>

</div>