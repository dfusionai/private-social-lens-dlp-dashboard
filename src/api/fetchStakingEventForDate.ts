import { ethers } from "ethers";
import { ENV_CONFIG } from "$lib/const";
import { weiToEther } from "$lib/utils";
import { getBlockRangeForDate, splitBlockRange } from "../lib/utils";
import { formatDate } from "$lib/utils";
import stakingAbi from "../assets/contracts/staking-abi.json";

const provider = new ethers.JsonRpcProvider(ENV_CONFIG.VITE_RPC_URL);
const stakingContract = new ethers.Contract(
    ENV_CONFIG.VITE_STAKING_ADDRESS,
    stakingAbi.abi,
    provider
);

export async function fetchStakingEventForDate(date: Date) {
    const formattedDate = formatDate(date, "YMD_DASH");
    const { startBlock, endBlock } = await getBlockRangeForDate(formattedDate, provider);
    const blockRanges = splitBlockRange(startBlock, endBlock);

    let totalStake = 0n; // Use native BigInt for summation
    let totalEvents = 0;

    for (const [fromBlock, toBlock] of blockRanges) {
        const filter = stakingContract.filters.TokensStaked();
        const events = await stakingContract.queryFilter(filter, fromBlock, toBlock);
        for (const event of events) {
            // event.args.rewardAmount is a BigInt in ethers v6
            totalStake += (event as any).args.amount;
        }
        totalEvents += events.length;
    }

    return {
        totalStake: weiToEther(totalStake),
        totalEvents
    }
}
