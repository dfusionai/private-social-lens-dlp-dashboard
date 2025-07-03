import { ethers } from "ethers";
import stakingAbi from "../assets/contracts/staking-abi.json";
import { blockRangeForAMonth, ENV_CONFIG, maxBlockRange } from "$lib/const";

const provider = new ethers.JsonRpcProvider(ENV_CONFIG.VITE_RPC_URL);
const stakingContract = new ethers.Contract(
    ENV_CONFIG.VITE_STAKING_ADDRESS,
    stakingAbi.abi,
    provider
);

interface IFetchUnstakingParams {
    months: number;
}

export async function fetchUnstaking(params: IFetchUnstakingParams) {
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
            throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return allUnstakeEvents;
}
