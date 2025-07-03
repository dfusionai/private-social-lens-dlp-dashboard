import { ethers } from "ethers";
import dlpAbi from "../assets/contracts/dlp-abi.json";
import { ENV_CONFIG } from "$lib/const";
import { weiToEther } from "$lib/utils";
import { getBlockRangeForDate, splitBlockRange } from "../lib/utils";
import { formatDate } from "$lib/utils";

const provider = new ethers.JsonRpcProvider(ENV_CONFIG.VITE_RPC_URL);
const dlpContract = new ethers.Contract(
    ENV_CONFIG.VITE_DLP_ADDRESS,
    dlpAbi.abi,
    provider
);

export async function fetchRewardRequestForDate(date: Date) {
    const formattedDate = formatDate(date, "YMD_DASH");
    const { startBlock, endBlock } = await getBlockRangeForDate(formattedDate, provider);
    const blockRanges = splitBlockRange(startBlock, endBlock);
    console.log("🚀 ~ fetchRewardRequestForDate ~ blockRanges:", blockRanges)

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
