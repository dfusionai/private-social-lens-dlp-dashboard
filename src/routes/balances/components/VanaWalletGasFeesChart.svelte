<script lang="ts">
  import { onMount } from "svelte";
  import { scaleBand } from "d3-scale";
  import BarChart from "$lib/components/common/bar-chart/bar-chart.svelte";
  import { ENV_CONFIG, VANASCAN_API_V2 } from "$lib/const";
  import * as Chart from "$lib/components/ui/chart/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { RefreshCwIcon } from "@lucide/svelte";
  import type { BarChartPropsObjProp } from "layerchart";
  import { toast } from "svelte-sonner";

  const WALLET_ADDRESSES: string[] = JSON.parse(ENV_CONFIG.VITE_RELAY_WALLET_ADDRESSES || "[]");

  const TRANSACTION_LIMITS = [100, 200, 500] as const;
  type TransactionLimit = (typeof TRANSACTION_LIMITS)[number];

  interface ChartDatum {
    index: number;
    date: Date;
    gasFee: number;
    hash: string;
    method: string;
  }

  interface BlockscoutTxItem {
    timestamp: string;
    hash?: string;
    method?: string;
    fee?: { type?: string; value?: string };
  }

  interface BlockscoutResponse {
    items: BlockscoutTxItem[];
    next_page_params?: {
      block_number: number;
      index: number;
      items_count: number;
    };
  }

  function formatAddress(address: string) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  function formatDateUtc(date: Date): string {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, "0");
    const d = String(date.getUTCDate()).padStart(2, "0");
    const h = String(date.getUTCHours()).padStart(2, "0");
    const min = String(date.getUTCMinutes()).padStart(2, "0");
    const s = String(date.getUTCSeconds()).padStart(2, "0");
    return `${y}/${m}/${d} ${h}:${min}:${s} UTC`;
  }

  function handleBarClick(_e: MouseEvent, detail: { data: ChartDatum }) {
    const hash = detail?.data?.hash;
    if (hash) {
      window.open(`https://vanascan.io/tx/${hash}`, "_blank", "noopener,noreferrer");
    }
  }

  let selectedAddress = $state(WALLET_ADDRESSES[0] ?? "");
  let transactionLimit = $state<TransactionLimit>(100);
  let chartData = $state<ChartDatum[]>([]);
  let isLoading = $state(false);
  let error = $state<string | null>(null);

  const ChartConfig: Chart.ChartConfig = {
    gasFee: { label: "Gas fee (VANA)", color: "var(--chart-gas-bar)" },
  };

  const series = [
    {
      key: "gasFee",
      label: "Gas fee (VANA)",
      color: ChartConfig.gasFee.color,
      value: (d: ChartDatum) => d.gasFee,
    },
  ];

  const gasChartXScale = $derived(
    chartData.length > 0
      ? scaleBand()
          .domain(chartData.map((d) => d.index))
          .padding(0.2)
      : scaleBand().domain([0]).padding(0.2)
  );

  const gasChartVisConfig: BarChartPropsObjProp<Record<string, unknown>> = {
    xAxis: {
      label: "Transaction",
      format: () => "",
      tickMarks: false,
    },
    yAxis: {
      label: "Gas fees (VANA)",
      format: (v: number) => v.toFixed(6),
    },
    highlight: {
      onAreaClick: handleBarClick,
    },
  };

  async function fetchTransactionsForAddress(
    address: string,
    limit: number
  ): Promise<BlockscoutTxItem[]> {
    const allItems: BlockscoutTxItem[] = [];
    let nextParams: BlockscoutResponse["next_page_params"] = undefined;
    const pageSize = 50;
    const pagesNeeded = Math.ceil(limit / pageSize);

    for (let page = 0; page < pagesNeeded; page++) {
      let url = `${VANASCAN_API_V2}/addresses/${address}/transactions`;
      if (nextParams) {
        const params = new URLSearchParams({
          block_number: String(nextParams.block_number),
          index: String(nextParams.index),
          items_count: String(nextParams.items_count),
        });
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: BlockscoutResponse = await response.json();

      if (data.items?.length) {
        allItems.push(...data.items);
        if (allItems.length >= limit) break;
      }

      nextParams = data.next_page_params ?? undefined;
      if (!nextParams) break;
    }

    return allItems.slice(0, limit);
  }

  async function loadChartData() {
    if (!selectedAddress || WALLET_ADDRESSES.length === 0) {
      chartData = [];
      return;
    }

    try {
      isLoading = true;
      error = null;
      const limit = Number(transactionLimit) || 100;
      const items = await fetchTransactionsForAddress(selectedAddress, limit);

      const sorted = items
        .map((item) => {
          const feeWei = item.fee?.value ?? "0";
          const gasFeeVana = Number(BigInt(feeWei)) / 1e18;
          const date = new Date(item.timestamp);
          return {
            date,
            gasFee: gasFeeVana,
            hash: item.hash ?? "",
            method: item.method ?? "",
          };
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      chartData = sorted.map((d, i) => ({
        index: i,
        date: d.date,
        gasFee: d.gasFee,
        hash: d.hash,
        method: d.method,
      }));
    } catch (err) {
      console.error("Error fetching transactions:", err);
      error = err instanceof Error ? err.message : "Failed to load transactions";
      toast.error(error);
      chartData = [];
    } finally {
      isLoading = false;
    }
  }

  $effect(() => {
    if (selectedAddress && transactionLimit) {
      loadChartData();
    }
  });

  const selectedWalletLabel = $derived(
    selectedAddress ? formatAddress(selectedAddress) : "Select wallet"
  );

  onMount(() => {
    if (WALLET_ADDRESSES.length > 0 && !selectedAddress) {
      selectedAddress = WALLET_ADDRESSES[0];
    }
  });
</script>

<div class="flex flex-col gap-4">
  <div class="flex flex-wrap items-center gap-4">
    <div class="flex flex-col gap-1.5">
      <Select.Root
        type="single"
        bind:value={selectedAddress}
        disabled={WALLET_ADDRESSES.length === 0}
      >
        <Select.Label class="text-sm font-medium text-muted-foreground">
          Wallet
        </Select.Label>
        <Select.Trigger
          class="w-[200px]"
          aria-label="Select wallet"
        >
          {selectedWalletLabel}
        </Select.Trigger>
        <Select.Content>
          {#each WALLET_ADDRESSES as addr}
            <Select.Item value={addr} label={formatAddress(addr)} />
          {/each}
        </Select.Content>
      </Select.Root>
    </div>
    <div class="flex flex-col gap-1.5">
      <span class="text-sm font-medium text-muted-foreground"
        >Transactions</span
      >
      <div class="flex gap-2">
        {#each TRANSACTION_LIMITS as count}
          <label
            class="flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/10"
          >
            <input
              type="radio"
              name="tx-limit"
              value={count}
              bind:group={transactionLimit}
              class="sr-only"
              aria-label="Last {count} transactions"
            />
            <span>Last {count}</span>
          </label>
        {/each}
      </div>
    </div>
  </div>

  {#if error}
    <p class="text-sm text-destructive">{error}</p>
  {/if}

  {#if WALLET_ADDRESSES.length === 0}
    <p class="text-sm text-muted-foreground"
      >No relay wallet addresses configured.</p
    >
  {:else}
    <div class="relative">
      {#snippet gasFeeTooltip(tooltipProps)}
        {@const datum = tooltipProps.item?.payload as ChartDatum | undefined}
        {#if datum}
          <div class="grid gap-1.5 text-xs">
            <div class="grid gap-0.5">
              <span class="text-muted-foreground">Transaction hash</span>
              <span class="font-mono break-all">{datum.hash || "—"}</span>
            </div>
            <div class="grid gap-0.5">
              <span class="text-muted-foreground">Time</span>
              <span>{datum.date instanceof Date ? formatDateUtc(datum.date) : "—"}</span>
            </div>
            <div class="grid gap-0.5">
              <span class="text-muted-foreground">Gas fee (VANA)</span>
              <span class="font-mono">{datum.gasFee != null ? datum.gasFee.toFixed(6) : "—"}</span>
            </div>
            <div class="grid gap-0.5">
              <span class="text-muted-foreground">Method</span>
              <span>{datum.method || "—"}</span>
            </div>
          </div>
        {:else}
          <div>
            <strong>{tooltipProps.name}:</strong> {Number(tooltipProps.value).toFixed(6)}
          </div>
        {/if}
      {/snippet}
      <BarChart
        className="h-[300px] w-full [&_.lc-tooltip-rect]:cursor-pointer"
        title="Gas fees per transaction"
        description="Last {transactionLimit} transactions (chronological) for {selectedAddress ? formatAddress(selectedAddress) : '...'}"
        chartConfig={ChartConfig}
        data={chartData}
        x="index"
        xScale={gasChartXScale}
        props={gasChartVisConfig}
        {series}
        {isLoading}
        showDateInTooltip={false}
        formatter={gasFeeTooltip}
        onBarClick={handleBarClick}
        onTooltipClick={handleBarClick}
      />
      <Button
        class="bg-transparent cursor-pointer hover:bg-background absolute top-4 right-4"
        disabled={isLoading}
        onclick={() => loadChartData()}
        aria-label="Refresh gas fees"
      >
        <RefreshCwIcon class="h-4 w-4 text-foreground" />
      </Button>
    </div>
  {/if}
</div>
