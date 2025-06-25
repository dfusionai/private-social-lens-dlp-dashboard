<script lang="ts">
    import LineChart from "$lib/components/common/line-chart/line-chart.svelte";
    import * as Chart from "$lib/components/ui/chart/index.js";
    import { ethers } from "ethers";
    import { onMount } from "svelte";
    import { ENV_CONFIG } from "$lib/const";
    import StatisticGrid from "./components/statistic-grid/statistic-grid.svelte";
    import stakingAbi from "../../assets/contracts/staking-abi.json";
    import ChartFooter from "./components/chart-footer/chart-footer.svelte";

    const provider = new ethers.JsonRpcProvider(ENV_CONFIG.VITE_RPC_URL);

    const stakingContract = new ethers.Contract(
        ENV_CONFIG.VITE_STAKING_ADDRESS,
        stakingAbi.abi,
        provider
    );

    const blockRangeForAMonth = 432000;

    const scanStakeEvents = async () => {
        const monthlyData = [];
        const currentBlock = await provider.getBlockNumber();
        const startBlock = Math.max(0, currentBlock - 6 * blockRangeForAMonth);

        for (let i = 0; i < 6; i++) {
            // Calculate block range
            const fromBlock = startBlock + i * blockRangeForAMonth;
            const toBlock = Math.min(
                fromBlock + blockRangeForAMonth,
                currentBlock
            );

            if (fromBlock >= currentBlock) {
                break;
            }

            try {
                // Split into 10,000-block chunks and query concurrently
                const maxBlockRange = 10000;
                const blockRanges = [];
                for (
                    let from = fromBlock;
                    from <= toBlock;
                    from += maxBlockRange
                ) {
                    const to = Math.min(from + maxBlockRange - 1, toBlock);
                    blockRanges.push({ from, to });
                }

                // Query stake and unstake events concurrently
                const stakePromises = blockRanges.map(({ from, to }) =>
                    stakingContract.queryFilter(
                        stakingContract.filters.TokensStaked(),
                        from,
                        to
                    )
                );
                const unstakePromises = blockRanges.map(({ from, to }) =>
                    stakingContract.queryFilter(
                        stakingContract.filters.TokensUnstaked(),
                        from,
                        to
                    )
                );

                const [stakeResults, unstakeResults] = await Promise.all([
                    Promise.all(stakePromises),
                    Promise.all(unstakePromises),
                ]);

                // Flatten results
                const stakeEvents = stakeResults.flat();
                const unstakeEvents = unstakeResults.flat();

                // Calculate totals using BigInt (ethers v6)
                const totalStaked = stakeEvents.reduce((sum, event) => {
                    const eventLog = event as any;
                    const amount = eventLog.args[1]
                        ? BigInt(eventLog.args[1])
                        : BigInt(0);
                    return sum + amount;
                }, BigInt(0));

                const totalUnstaked = unstakeEvents.reduce((sum, event) => {
                    const eventLog = event as any;
                    const amount = eventLog.args?.amount
                        ? BigInt(eventLog.args.amount)
                        : BigInt(0);
                    return sum + amount;
                }, BigInt(0));

                const monthData = {
                    totalStaked: Number(ethers.formatEther(totalStaked)),
                    totalUnstaked: Number(ethers.formatEther(totalUnstaked)),
                    eventCount: stakeEvents.length + unstakeEvents.length,
                };

                monthlyData.push(monthData);
            } catch (error) {
                monthlyData.push({
                    totalStaked: 0,
                    totalUnstaked: 0,
                    eventCount: 0,
                });
            }
        }

        return monthlyData;
    };

    let chartData = $state([
        { date: new Date("2025-01-01"), stakingAmount: 0 },
        { date: new Date("2025-02-01"), stakingAmount: 0 },
        { date: new Date("2025-03-01"), stakingAmount: 0 },
        { date: new Date("2025-04-01"), stakingAmount: 0 },
        { date: new Date("2025-05-01"), stakingAmount: 0 },
        { date: new Date("2025-06-01"), stakingAmount: 0 },
    ]);

    const ChartConfig = {
        stakingAmount: { label: "Staking Amount", color: "var(--chart-1)" },
    } satisfies Chart.ChartConfig;

    const series = [
        {
            key: "stakingAmount",
            label: "Staking Amount",
            color: ChartConfig.stakingAmount.color,
        },
    ];

    onMount(async () => {
        const data = await scanStakeEvents();
        chartData = chartData.map((item, index) => {
            return {
                ...item,
                stakingAmount: data[index].totalStaked,
            };
        });
    });
</script>

<div>
    <StatisticGrid />
    <LineChart
        className="h-[300px] w-full"
        title="Staking Through Time"
        description="Showing total staking amount for the last year"
        chartConfig={ChartConfig}
        data={chartData}
        {series}
        footer={ChartFooter}
    />
</div>
