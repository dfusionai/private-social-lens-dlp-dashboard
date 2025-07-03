<script lang="ts">
    import LineChart from "$lib/components/common/line-chart/line-chart.svelte";
    import CardContent from "$lib/components/ui/card/card-content.svelte";
    import CardDescription from "$lib/components/ui/card/card-description.svelte";
    import CardHeader from "$lib/components/ui/card/card-header.svelte";
    import CardTitle from "$lib/components/ui/card/card-title.svelte";
    import Card from "$lib/components/ui/card/card.svelte";
    import * as Chart from "$lib/components/ui/chart/index.js";
    import { generateDataFor6Months } from "../../utils";
    import { rewardEventsStore } from "$lib/stores/rewardEventsStore";
    import { weiToEther } from "$lib/utils";

    let chartData: {
        date: Date;
        contributor: number;
        validator: number;
        owner: number;
    }[] = $state(generateDataFor6Months());

    let isLoading = $state(false);

    const ChartConfig = {
        contributor: { label: "Contributor", color: "var(--chart-1)" },
        validator: { label: "Validator", color: "var(--chart-2)" },
        owner: { label: "Owner", color: "var(--chart-3)" },
    } satisfies Chart.ChartConfig;

    const series = [
        {
            key: "contributor",
            label: "Contributor",
            color: ChartConfig.contributor.color,
        },
        {
            key: "validator",
            label: "Validator",
            color: ChartConfig.validator.color,
        },
        {
            key: "owner",
            label: "Owner",
            color: ChartConfig.owner.color,
        },
    ];

    rewardEventsStore.subscribe((state) => {
        const { contributorRewardEvents, loading } = state;
        isLoading = loading;

        if (!contributorRewardEvents) {
            return;
        }

        contributorRewardEvents.forEach((monthData, index) => {
            const monthReward = monthData.reduce(
                (acc, curr) => acc + weiToEther((curr as any).args[3]),
                0
            );
            chartData[index].contributor = monthReward;
        });
    });
</script>

<Card>
    <CardHeader>
        <CardTitle>Reward Distribution Curve</CardTitle>
        <CardDescription
            >Visualization of reward allocation patterns</CardDescription
        >
    </CardHeader>
    <CardContent>
        <LineChart
            data={chartData}
            {series}
            chartConfig={ChartConfig}
            title="Reward Distribution Over Time"
            description="Showing reward distribution by role"
            className="h-[300px] w-full"
            {isLoading}
        />
    </CardContent>
</Card>
