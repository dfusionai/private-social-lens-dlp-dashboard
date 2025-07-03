import { ethers } from "ethers";
import dlpAbi from "../assets/contracts/dlp-abi.json";
import { ENV_CONFIG, maxBlockRange } from "$lib/const";
import { weiToEther } from "$lib/utils";

const provider = new ethers.JsonRpcProvider(ENV_CONFIG.VITE_RPC_URL);
const dlpContract = new ethers.Contract(
    ENV_CONFIG.VITE_DLP_ADDRESS,
    dlpAbi.abi,
    provider
);

interface IFetchContributorRewardForDateParams {
    date: Date;
}

function splitBlockRange(startBlock: number, endBlock: number) {
    const ranges = [];
    let currentStart = startBlock;
    while (currentStart <= endBlock) {
        const currentEnd = Math.min(currentStart + maxBlockRange - 1, endBlock);
        ranges.push([currentStart, currentEnd]);
        currentStart = currentEnd + 1;
    }
    return ranges;
}

async function getBlockRangeForDate(date: string) {
    const startTimestamp = Math.floor(new Date(date + "T00:00:00Z").getTime() / 1000);
    const endTimestamp = Math.floor(new Date(date + "T23:59:59Z").getTime() / 1000);

    async function findBlockByTimestamp(targetTimestamp: number, startBlock: number, endBlock: number) {
        while (startBlock < endBlock) {
            const mid = Math.floor((startBlock + endBlock) / 2);
            const block = await provider.getBlock(mid);
            if (block && block.timestamp < targetTimestamp) {
            startBlock = mid + 1;
            } else {
            endBlock = mid;
            }
        }
        return startBlock;
    }

    const latestBlock = await provider.getBlockNumber();
    const earliestBlock = 1;

    const startBlock = await findBlockByTimestamp(startTimestamp, earliestBlock, latestBlock);
    const endBlock = await findBlockByTimestamp(endTimestamp, startBlock, latestBlock);

    return { startBlock, endBlock };
}

export async function fetchContributorRewardForDate(params: IFetchContributorRewardForDateParams) {
    const { date } = params;
    const { startBlock, endBlock } = await getBlockRangeForDate(date.toISOString().split('T')[0]);
    const blockRanges = splitBlockRange(startBlock, endBlock);

    let totalReward = 0n; // Use native BigInt for summation
    let totalEvents = 0;

    for (const [fromBlock, toBlock] of blockRanges) {
        const filter = dlpContract.filters.RewardRequested();
        const events = await dlpContract.queryFilter(filter, fromBlock, toBlock);
        for (const event of events) {
            // event.args.rewardAmount is a BigInt in ethers v6
            totalReward += (event as any).args.rewardAmount;
        }
        totalEvents += events.length;
    }

    return {
        totalReward: weiToEther(totalReward),
        totalEvents
    }
}
