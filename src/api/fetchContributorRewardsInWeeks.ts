import { ethers } from "ethers";
import dlpAbi from "../assets/contracts/dlp-abi.json";
import { blockRangeForAWeek, ENV_CONFIG, maxBlockRange } from "$lib/const";

const provider = new ethers.JsonRpcProvider(ENV_CONFIG.VITE_RPC_URL);
const dlpContract = new ethers.Contract(
    ENV_CONFIG.VITE_DLP_ADDRESS,
    dlpAbi.abi,
    provider
);

interface IFetchContributorRewardsInWeeksParams {
    weeks: number;
}

export async function fetchContributorRewardsInWeeks(params: IFetchContributorRewardsInWeeksParams) {
    const { weeks } = params;
    const currentBlock = await provider.getBlockNumber();
    const startBlock = Math.max(0, currentBlock - weeks * blockRangeForAWeek);

    const allContributorRewards = [];

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
            const contributorRewardsPromises = blockRanges.map(({ from, to }) =>
                dlpContract.queryFilter(
                    dlpContract.filters.RewardRequested(),
                    from,
                    to
                )
            );

            const contributorRewardsResults = await Promise.all(contributorRewardsPromises);

            allContributorRewards.push(contributorRewardsResults.flat());
        } catch (error) {
            throw error;
        }
    }

    return allContributorRewards;
}
