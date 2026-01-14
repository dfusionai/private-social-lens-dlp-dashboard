<script>
  import { onMount } from "svelte";
  import { ENV_CONFIG } from "$lib/const";

  let dFusionValidatorHealthResult = $state(null);
  let vanaRelayServiceHealthResult = $state(null);
  let suiAiAgentServiceHealthResult = $state(null);

  async function getDFusionValidatorHealth() {
    try {
      const endpoint = `${ENV_CONFIG.VITE_DF_BASE_URL}/health`;
      const response = await fetch(endpoint, {
        method: "GET",
      });
      const responseText = await response.text();
      if (!response.ok) {
        console.error(`Error dFusionValidatorHealth: ${response.status} ${responseText}`);
        return "unhealthy";
      }
      return responseText;
    } catch (error) {
      console.error("Error getDFusionValidatorHealth:", error);
    }
  }

  async function getVanaRelayServiceHealth() {
    try {
      const endpoint = `${ENV_CONFIG.VITE_RELAY_BASE_URL}`;
      const response = await fetch(endpoint, {
        method: "GET",
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error(`Error getVanaRelayServiceHealth: ${response.status} ${responseText}`);
        return "unhealthy";
      } else {
        return "healthy";
      }
    } catch (error) {
      console.error("Error getVanaRelayServiceHealth:", error);
    }
  }
  
  async function getSuiAiAgentServiceHealth() {
    try {
      const endpoint = `${ENV_CONFIG.VITE_AI_AGENT_BASE_URL}`;
      const response = await fetch(endpoint, {
        method: "GET",
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error(`Error getVanaRgetSuiAiAgentServiceHealthelayServiceHealth: ${response.status} ${responseText}`);
        return "unhealthy";
      } else {
        return "healthy";
      }
    } catch (error) {
      console.error("Error getSuiAiAgentServiceHealth:", error);
    }
  }

  onMount(async () => {
    try {
      dFusionValidatorHealthResult = (await getDFusionValidatorHealth()).toLowerCase();
    } catch (e) {
      console.error("Error getDFusionValidatorHealth:", e);
      dFusionValidatorHealthResult = "error";
    }

    try {
      vanaRelayServiceHealthResult = (await getVanaRelayServiceHealth()).toLowerCase();
    } catch (e) {
      console.error("Error getVanaRelayServiceHealth:", e);
      vanaRelayServiceHealthResult = "error";
    }

    try {
      suiAiAgentServiceHealthResult = (await getSuiAiAgentServiceHealth()).toLowerCase();
    } catch (e) {
      console.error("Error getSuiAiAgentServiceHealth:", e);
      suiAiAgentServiceHealthResult = "error";
    }
  });

</script>

<table class="table-auto">
  <thead>
    <tr class="border-b">
      <th class="text-left">Server</th>
      <th class="text-left px-4">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="text-left">dFusion-validator</td>
      <td class="px-4 py-1 text-left">
        {#if dFusionValidatorHealthResult != null}
          {#if dFusionValidatorHealthResult === "healthy"}
            <div class="inline-block min-w-[60px] rounded-md bg-green-500 py-1 px-2 text-white">Healthy</div>
          {:else if dFusionValidatorHealthResult === "unhealthy"}
            <div class="inline-block min-w-[60px] rounded-md bg-red-500 py-1 px-2 text-white">Unhealthy</div>
          {:else if dFusionValidatorHealthResult === "degraded"}
            <div class="inline-block min-w-[60px] rounded-md bg-yellow-500 py-1 px-2 text-gray-900">Degraded</div>
          {:else}
            <div class="inline-block min-w-[60px] rounded-md bg-red-900 py-1 px-2 text-white">Unknown</div>
          {/if}
        {/if}
      </td>
    </tr>

    <tr>
      <td class="text-left">Vana Relay Service</td>
      <td class="px-4 py-1 text-left">
        {#if vanaRelayServiceHealthResult != null}
          {#if vanaRelayServiceHealthResult === "healthy"}
            <div class="inline-block min-w-[60px] rounded-md bg-green-500 py-1 px-2 text-white">Healthy</div>
          {:else if vanaRelayServiceHealthResult === "unhealthy"}
            <div class="inline-block min-w-[60px] rounded-md bg-red-500 py-1 px-2 text-white">Unhealthy</div>
          {:else if vanaRelayServiceHealthResult === "degraded"}
            <div class="inline-block min-w-[60px] rounded-md bg-yellow-500 py-1 px-2 text-gray-900">Degraded</div>
          {:else}
            <div class="inline-block min-w-[60px] rounded-md bg-red-900 py-1 px-2 text-white">Unknown</div>
          {/if}
        {/if}
      </td>
    </tr>
    
    <tr>
      <td class="text-left">Sui AI Agent Service</td>
      <td class="px-4 py-1 text-left">
        {#if suiAiAgentServiceHealthResult != null}
          {#if suiAiAgentServiceHealthResult === "healthy"}
            <div class="inline-block min-w-[60px] rounded-md bg-green-500 py-1 px-2 text-white">Healthy</div>
          {:else if suiAiAgentServiceHealthResult === "unhealthy"}
            <div class="inline-block min-w-[60px] rounded-md bg-red-500 py-1 px-2 text-white">Unhealthy</div>
          {:else if suiAiAgentServiceHealthResult === "degraded"}
            <div class="inline-block min-w-[60px] rounded-md bg-yellow-500 py-1 px-2 text-gray-900">Degraded</div>
          {:else}
            <div class="inline-block min-w-[60px] rounded-md bg-red-900 py-1 px-2 text-white">Unknown</div>
          {/if}
        {/if}
      </td>
    </tr>
  </tbody>
</table>
