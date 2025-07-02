import { ethers } from "ethers";
import teePoolAbi from "../assets/contracts/teepool-abi.json";
import { blockRangeForAMonth, ENV_CONFIG, maxBlockRange } from "$lib/const";

const provider = new ethers.JsonRpcProvider(ENV_CONFIG.VITE_RPC_URL);
const teePoolContract = new ethers.Contract(
    ENV_CONFIG.VITE_TEE_POOL_ADDRESS,
    teePoolAbi.abi,
    provider
);

interface IFetchTotalDistributedForValidatorParams {
    months: number;
}

export async function fetchTotalDistributedForValidator(params: IFetchTotalDistributedForValidatorParams) {
    const { months } = params;
    const currentBlock = await provider.getBlockNumber();
    const startBlock = Math.max(0, currentBlock - months * blockRangeForAMonth);

    const allClaimedEvents = [];

    for (let i = 0; i < months; i++) {
        // Calculate block range
        const fromBlock = startBlock + i * blockRangeForAMonth;
        const toBlock = Math.min(fromBlock + blockRangeForAMonth, currentBlock);

        if (fromBlock >= currentBlock) {
            break;
        }

        const blockRanges = [];

        for (let from = fromBlock; from <= toBlock; from += maxBlockRange) {
            const to = Math.min(from + maxBlockRange - 1, toBlock);
            blockRanges.push({ from, to });
        }

        try {
            const claimedPromises = blockRanges.map(({ from, to }) =>
                teePoolContract.queryFilter(
                    teePoolContract.filters.Claimed(),
                    from,
                    to
                )
            );

            const claimedResults = await Promise.all(claimedPromises);

            const claimedEvents = claimedResults.flat();

            allClaimedEvents.push(claimedEvents);
        } catch (error) {
            console.error("🚀 ~ fetchTotalDistributedForValidator ~ error:", error);
            throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return allClaimedEvents;
}
