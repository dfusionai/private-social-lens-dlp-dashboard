<script lang="ts">
  import { cn } from "$lib/utils";
  import { onDestroy, onMount } from "svelte";
  import { CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PointElement, TimeScale, Title, Tooltip } from "chart.js";
  import "chartjs-adapter-date-fns";

  Chart.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale, TimeScale, Legend);

  const {
    data = [],
    title = "",
    description = "",
    className = "",
  } = $props<{
    data: Array<{
      date: Date;
      stakedAmount: number;
      unstakedAmount: number;
      netMovement: number;
    }>;
    title?: string;
    description?: string;
    isLoading?: boolean;
  }>();

  let canvas: HTMLCanvasElement;
  let chart: Chart | null = null;

  const buildChart = () => {
    if (chart) chart.destroy();

    chart = new Chart(canvas, {
      type: "line",
      data: {
        labels: data.map((d) => d.date),
        datasets: [
          {
            label: "Staked Amount",
            data: data.map((d) => d.stakedAmount),
            borderColor: "#4ade80",
            backgroundColor: "#4ade80",
            tension: 0.4,
            pointRadius: 2,
          },
          {
            label: "Unstaked Amount",
            data: data.map((d) => d.unstakedAmount),
            borderColor: "#f87171",
            backgroundColor: "#f87171",
            tension: 0.4,
            pointRadius: 2,
          },
          {
            label: "Net Movement",
            data: data.map((d) => d.netMovement),
            borderColor: "#60a5fa",
            backgroundColor: "#60a5fa",
            tension: 0.4,
            pointRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: !!title,
            text: title,
          },
          legend: {
            position: "top",
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              title: (tooltipItems) => {
                const ts = tooltipItems[0].parsed.x;
                return new Date(ts).toDateString();
              },
            },
          },
        },
        interaction: {
          mode: "nearest",
          intersect: false,
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
            },
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            title: {
              display: true,
              text: "Amount ($VFSN)",
            },
            beginAtZero: true,
          },
        },
      },
    });
  };

  onMount(() => {
    buildChart();
  });

  $effect(() => {
    if (!chart && data.length) {
      buildChart();
    } else if (chart && data.length) {
      // Update only datasets and labels
      chart.data.labels = data.map((d) => d.date);
      chart.data.datasets[0].data = data.map((d) => d.stakedAmount);
      chart.data.datasets[1].data = data.map((d) => d.unstakedAmount);
      chart.data.datasets[2].data = data.map((d) => d.netMovement);
      chart.update();
    }
  });

  onDestroy(() => {
    if (chart) chart.destroy();
  });
</script>

<div class={cn("w-full", className)}>
    <canvas class="h-full w-full" bind:this={canvas}></canvas>
</div>
