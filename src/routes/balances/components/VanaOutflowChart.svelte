<script lang="ts">
  import { onMount } from "svelte";
  import LineChart from "$lib/components/common/line-chart/line-chart.svelte";
  import { ENV_CONFIG } from "$lib/const";
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { defaultVisConfig } from "$lib/components/common/line-chart/const";
  import type { LineChartPropsObjProp } from "layerchart";
  import Button from "$lib/components/ui/button/button.svelte";
  import { RefreshCwIcon } from "@lucide/svelte";
  import { toast } from "svelte-sonner";

  const WALLET_ADDRESSES_TO_CHECK: string[] = JSON.parse(ENV_CONFIG.VITE_RELAY_WALLET_ADDRESSES || "[]");
  const VANASCAN_API_V2 = "https://vanascan.io/api/v2";

  // Chart colors for different wallets
  const CHART_COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  function formatAddress(address: string) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  // Track which wallets are visible (all visible by default)
  let visibleWallets = $state<Set<number>>(new Set(WALLET_ADDRESSES_TO_CHECK.map((_, idx) => idx)));

  function toggleWalletVisibility(idx: number) {
    const newVisible = new Set(visibleWallets);
    if (newVisible.has(idx)) {
      // Don't allow hiding all wallets - keep at least one visible
      if (newVisible.size > 1) {
        newVisible.delete(idx);
      }
    } else {
      newVisible.add(idx);
    }
    visibleWallets = newVisible;
  }

  // Dynamic chart configuration based on wallets
  const ChartConfig = WALLET_ADDRESSES_TO_CHECK.reduce((acc, address, idx) => {
    const key = `wallet_${idx}`;
    acc[key] = { 
      label: formatAddress(address), 
      color: CHART_COLORS[idx % CHART_COLORS.length] 
    };
    return acc;
  }, {} as Chart.ChartConfig);

  // All series (static)
  const allSeries = WALLET_ADDRESSES_TO_CHECK.map((address, idx) => ({
    key: `wallet_${idx}`,
    label: formatAddress(address),
    color: CHART_COLORS[idx % CHART_COLORS.length],
  }));

  // Filtered series based on visibility (reactive)
  let series = $derived(allSeries.filter((_, idx) => visibleWallets.has(idx)));

  const weekVisConfig: LineChartPropsObjProp = {
    ...defaultVisConfig,
    xAxis: {
      format: (v: Date) =>
        v.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      ticks: 10,
    },
    yAxis: {
      format: (v: number) => v.toFixed(2),
    },
  };

  let chartData = $state<Record<string, any>[]>([]);
  let isLoading = $state(false);

  // Calculate rate statistics for each wallet
  interface WalletStats {
    address: string;
    totalChange: number;
    avgDailyRate: number;
    daysUntilEmpty: number | null;
    currentBalance: number;
  }

  let walletStats = $derived.by<WalletStats[]>(() => {
    if (chartData.length < 2) return [];

    return WALLET_ADDRESSES_TO_CHECK.map((address, idx) => {
      const key = `wallet_${idx}`;
      const firstBalance = chartData[0]?.[key] || 0;
      const lastBalance = chartData[chartData.length - 1]?.[key] || 0;
      const totalChange = lastBalance - firstBalance;
      const numDays = chartData.length - 1;
      const avgDailyRate = numDays > 0 ? totalChange / numDays : 0;
      
      // Calculate days until empty (only if burning)
      let daysUntilEmpty: number | null = null;
      if (avgDailyRate < 0 && lastBalance > 0) {
        daysUntilEmpty = Math.ceil(lastBalance / Math.abs(avgDailyRate));
      }

      return {
        address,
        totalChange,
        avgDailyRate,
        daysUntilEmpty,
        currentBalance: lastBalance,
      };
    });
  });

  interface BalanceHistoryItem {
    date: string;
    value: string;
  }

  interface BalanceHistoryResponse {
    items: BalanceHistoryItem[];
    days: number;
  }

  async function fetchBalanceHistory(address: string): Promise<Map<string, number>> {
    const balanceByDate = new Map<string, number>();

    try {
      const response = await fetch(
        `${VANASCAN_API_V2}/addresses/${address}/coin-balance-history-by-day`
      );
      const data: BalanceHistoryResponse = await response.json();

      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          const balanceVana = Number(BigInt(item.value)) / 10 ** 18;
          balanceByDate.set(item.date, balanceVana);
        }
      }

      return balanceByDate;
    } catch (error) {
      console.error(`Error fetching balance history for ${address}:`, error);
      return balanceByDate;
    }
  }

  async function fetchData() {
    if (WALLET_ADDRESSES_TO_CHECK.length === 0) return;

    try {
      isLoading = true;

      // Fetch balance history for all wallets in parallel
      const allWalletData = await Promise.all(
        WALLET_ADDRESSES_TO_CHECK.map(async (address) => {
          const balanceHistory = await fetchBalanceHistory(address);
          return { address, balanceHistory };
        })
      );

      // Collect all unique dates across all wallets
      const allDates = new Set<string>();
      allWalletData.forEach(({ balanceHistory }) => {
        balanceHistory.forEach((_, date) => allDates.add(date));
      });

      // Sort dates
      const sortedDates = Array.from(allDates).sort();

      // Generate chart data
      const newChartData = sortedDates.map((dateStr) => {
        const entry: Record<string, any> = { 
          date: new Date(dateStr + "T00:00:00") 
        };
        
        allWalletData.forEach(({ balanceHistory }, idx) => {
          entry[`wallet_${idx}`] = balanceHistory.get(dateStr) || 0;
        });

        return entry;
      });

      chartData = newChartData;
    } catch (err) {
      console.error("Error fetching balance history:", err);
      toast.error("Failed to fetch balance history");
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    fetchData();
  });
</script>

<div class="relative">
  <LineChart
    className="h-[300px] w-full"
    title="VANA Relay Wallet Balances (Last 10 Days)"
    description="Daily VANA balance"
    chartConfig={ChartConfig}
    data={chartData}
    props={weekVisConfig}
    {series}
    {isLoading}
    showDateInTooltip={true}
  />

  <Button
    class="bg-transparent cursor-pointer hover:bg-background absolute top-4 right-4"
    disabled={isLoading}
    onclick={() => fetchData()}
  >
    <RefreshCwIcon class="h-4 w-4 text-foreground" />
  </Button>
</div>

<!-- Interactive Legend -->
<div class="flex flex-wrap gap-4 mt-2 px-4">
  {#each WALLET_ADDRESSES_TO_CHECK as address, idx}
    <button
      type="button"
      class="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80 transition-opacity {visibleWallets.has(idx) ? '' : 'opacity-40'}"
      onclick={() => toggleWalletVisibility(idx)}
      title={visibleWallets.has(idx) ? 'Click to hide' : 'Click to show'}
    >
      <div 
        class="w-3 h-3 rounded-full transition-all {visibleWallets.has(idx) ? '' : 'ring-2 ring-offset-1 ring-gray-400'}" 
        style="background-color: {visibleWallets.has(idx) ? CHART_COLORS[idx % CHART_COLORS.length] : 'transparent'}"
      ></div>
      <span class={visibleWallets.has(idx) ? '' : 'line-through text-gray-500'}>{formatAddress(address)}</span>
    </button>
  {/each}
</div>

<!-- Burn Rate Summary -->
{#if walletStats.length > 0}
  <div class="mt-4 px-4 pb-4">
    <h4 class="text-sm font-medium text-muted-foreground mb-2">Burn Rate (Last {chartData.length - 1} Days)</h4>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {#each walletStats as stats, idx}
        <div 
          class="rounded-lg border p-3 text-sm"
          style="border-left: 3px solid {CHART_COLORS[idx % CHART_COLORS.length]}"
        >
          <div class="font-medium mb-1">{formatAddress(stats.address)}</div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <span class="text-muted-foreground">Total Change:</span>
            <span class={stats.totalChange >= 0 ? 'text-green-500' : 'text-red-500'}>
              {stats.totalChange >= 0 ? '+' : ''}{stats.totalChange.toFixed(4)} VANA
            </span>
            <span class="text-muted-foreground">Daily Avg:</span>
            <span class={stats.avgDailyRate >= 0 ? 'text-green-500' : 'text-red-500'}>
              {stats.avgDailyRate >= 0 ? '+' : ''}{stats.avgDailyRate.toFixed(4)} VANA/day
            </span>
            {#if stats.daysUntilEmpty !== null}
              <span class="text-muted-foreground">Est. Empty In:</span>
              <span class="text-amber-500">{stats.daysUntilEmpty} days</span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}
