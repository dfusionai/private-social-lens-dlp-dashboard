import { ethers } from "ethers";
import stakingAbi from "../assets/contracts/staking-abi.json";
import { ENV_CONFIG } from "$lib/const";

const provider = new ethers.JsonRpcProvider(ENV_CONFIG.VITE_RPC_URL);
const stakingContract = new ethers.Contract(
    ENV_CONFIG.VITE_STAKING_ADDRESS,
    stakingAbi.abi,
    provider
);
const blockRangeForAMonth = 432000;
const maxBlockRange = 10000;

interface IFetchStakingParams {
    months: number;
}

export async function fetchUnstaking(params: IFetchStakingParams) {
    const { months } = params;
    const currentBlock = await provider.getBlockNumber();
    const startBlock = Math.max(0, currentBlock - months * blockRangeForAMonth);

    const allUnstakeEvents = [];

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
            const unstakePromises = blockRanges.map(({ from, to }) =>
                stakingContract.queryFilter(
                    stakingContract.filters.TokensUnstaked(),
                    from,
                    to
                )
            );

            const unstakeResults = await Promise.all(unstakePromises);

            const unstakeEvents = unstakeResults.flat();

            allUnstakeEvents.push(unstakeEvents);
        } catch (error) {
            console.error("🚀 ~ fetchUnstaking ~ error:", error);
            throw error;
        }
    }

    return allUnstakeEvents;
}
