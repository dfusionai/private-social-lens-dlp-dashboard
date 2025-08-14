<script lang="ts">
  import { cn } from "$lib/utils";
  import { onDestroy, onMount } from "svelte";
  import { CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PointElement, TimeScale, Title, Tooltip, BarController, BarElement } from "chart.js";
  import "chartjs-adapter-date-fns";

  // Register all necessary components
  Chart.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale, TimeScale, Legend, BarController, BarElement);

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
      cumulativeStakedAmount: number; // Added cumulative amount
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
      type: "bar", // Set base type to bar
      data: {
        labels: data.map((d) => d.date),
        datasets: [
          {
            label: "Cumulative Staked",
            data: data.map((d) => d.cumulativeStakedAmount),
            type: "bar", // Explicitly set as bar
            backgroundColor: "rgba(117, 71, 207, 0.4)", // Light green with transparency
            borderColor: "rgba(117, 71, 207, 1)",
            borderWidth: 1,
            order: 0, // Draw first (behind lines)
            yAxisID: "y", // Use primary y-axis
          },
          {
            label: "Staked Amount",
            data: data.map((d) => d.stakedAmount),
            type: "line", // Explicitly set as line
            borderColor: "#4ade80",
            backgroundColor: "#4ade80",
            tension: 0.4,
            pointRadius: 2,
            order: 1, // Draw after bars
            yAxisID: "y", // Use primary y-axis
          },
          {
            label: "Unstaked Amount",
            data: data.map((d) => d.unstakedAmount),
            type: "line", // Explicitly set as line
            borderColor: "#f87171",
            backgroundColor: "#f87171",
            tension: 0.4,
            pointRadius: 2,
            order: 1, // Draw after bars
            yAxisID: "y", // Use primary y-axis
          },
          {
            label: "Net Movement",
            data: data.map((d) => d.netMovement),
            type: "line", // Explicitly set as line
            borderColor: "#60a5fa",
            backgroundColor: "#60a5fa",
            tension: 0.4,
            pointRadius: 2,
            order: 1, // Draw after bars
            yAxisID: "y", // Use primary y-axis
          },
        ],
      },
      options: {
        responsive: true,
        interaction: {
          mode: "index",
          intersect: false,
        },
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
            type: "linear",
            display: true,
            position: "left",
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
      chart.data.datasets[0].data = data.map((d) => d.cumulativeStakedAmount);
      chart.data.datasets[1].data = data.map((d) => d.stakedAmount);
      chart.data.datasets[2].data = data.map((d) => d.unstakedAmount);
      chart.data.datasets[3].data = data.map((d) => d.netMovement);
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
