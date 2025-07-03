import { ethers } from "ethers";
import stakingAbi from "../assets/contracts/staking-abi.json";
import { blockRangeForAWeek, ENV_CONFIG, maxBlockRange } from "$lib/const";

const provider = new ethers.JsonRpcProvider(ENV_CONFIG.VITE_RPC_URL);
const stakingContract = new ethers.Contract(
    ENV_CONFIG.VITE_STAKING_ADDRESS,
    stakingAbi.abi,
    provider
);

interface IFetchStakingInWeeksParams {
    weeks: number;
}

export async function fetchStakingInWeeks(params: IFetchStakingInWeeksParams) {
    const { weeks } = params;
    const currentBlock = await provider.getBlockNumber();
    const startBlock = Math.max(0, currentBlock - weeks * blockRangeForAWeek);

    const allStakesEvents = [];

    for (let i = 0; i < weeks; i++) {
        // Calculate block range
        const fromBlock = startBlock + i * blockRangeForAWeek;
        const toBlock = Math.min(fromBlock + blockRangeForAWeek, currentBlock);

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

            allStakesEvents.push(stakeResults.flat());
        } catch (error) {
            throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return allStakesEvents;
}
