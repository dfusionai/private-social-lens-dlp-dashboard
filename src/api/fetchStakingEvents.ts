import { ethers } from "ethers";
import stakingAbi from "../assets/contracts/staking-abi.json";
import { blockRangeForAMonth, ENV_CONFIG, maxBlockRange } from "$lib/const";

const provider = new ethers.JsonRpcProvider(ENV_CONFIG.VITE_RPC_URL);
const stakingContract = new ethers.Contract(
    ENV_CONFIG.VITE_STAKING_ADDRESS,
    stakingAbi.abi,
    provider
);

interface IFetchStakingParams {
    months: number;
}

export async function fetchStaking(params: IFetchStakingParams) {
    const { months } = params;
    const currentBlock = await provider.getBlockNumber();
    const startBlock = Math.max(0, currentBlock - months * blockRangeForAMonth);

    const allStakesEvents = [];

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
            const stakePromises = blockRanges.map(({ from, to }) => {
                return stakingContract.queryFilter(
                    stakingContract.filters.TokensStaked(),
                    from,
                    to
                );
            });

            const stakeResults = await Promise.all(stakePromises);

            const stakeEvents = stakeResults.flat();

            allStakesEvents.push(stakeEvents);
        } catch (error) {
            console.error("🚀 ~ fetchStaking ~ error:", error);
            throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return allStakesEvents;
}
