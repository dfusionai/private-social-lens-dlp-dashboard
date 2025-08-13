<script lang="ts">
  import { cn } from "$lib/utils";
  import { onDestroy, onMount } from "svelte";

  import { CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PointElement, TimeScale, Title, Tooltip } from "chart.js";
  import "chartjs-adapter-date-fns";

  Chart.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale, TimeScale, Legend);

  const {
    data = [],
    title = "VFSN Token Emission",
    description = "Total VFSN rewards per day (last 30 days)",
    className = "",
  } = $props<{
    data: Array<{ date: Date; rewardAmount: number }>;
    title?: string;
    description?: string;
    isLoading?: boolean;
    skeletonClass?: string;
    className?: string;
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
            label: "Daily Rewards ($VFSN)",
            data: data.map((d) => d.rewardAmount),
            borderColor: "#4ade80",
            backgroundColor: "#4ade80",
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
            // text: title
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
                return new Date(ts).toDateString(); // e.g., "8/4/2025"
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
              //   tooltipFormat: 'yyyy-MMMM-dddd',
            },
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            title: {
              display: true,
              text: "$VFSN",
            },
            beginAtZero: true,
          },
        },
      },
    });
  };

  onMount(buildChart);

  $effect(() => {
    if (!chart && data.length) {
      buildChart();
    } else if (chart && data.length && chart.data.datasets.length > 0) {
      chart.data.labels = data.map((d) => d.date);
      chart.data.datasets[0].data = data.map((d) => d.rewardAmount);
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
