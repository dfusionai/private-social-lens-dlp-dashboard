<script lang="ts">
  import VfsnTokenBalance from "./components/vfsn-token-balance.svelte";
  import VfsnTokenEmission from "./components/vfsn-token-emission.svelte";
</script>

<div class="flex flex-col justify-start items-stretch gap-8">
  <div class="w-1/2">
    <VfsnTokenBalance />
  </div>

  <div>
    <VfsnTokenEmission />
  </div>
</div>
