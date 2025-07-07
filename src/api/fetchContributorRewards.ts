import { ethers } from "ethers";
import dlpAbi from "../assets/contracts/dlp-abi.json";
import { blockRangeForAMonth, ENV_CONFIG, maxBlockRange } from "$lib/const";

const provider = new ethers.JsonRpcProvider(ENV_CONFIG.VITE_RPC_URL);
const dlpContract = new ethers.Contract(
    ENV_CONFIG.VITE_DLP_ADDRESS,
    dlpAbi.abi,
    provider
);

interface IFetchContributorRewardsParams {
    months: number;
}

export async function fetchContributorRewards(params: IFetchContributorRewardsParams) {
    const { months } = params;
    const currentBlock = await provider.getBlockNumber();
    const startBlock = Math.max(0, currentBlock - months * blockRangeForAMonth);

    const allContributorRewards = [];

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
                dlpContract.queryFilter(
                    dlpContract.filters.RewardRequested(),
                    from,
                    to
                )
            );

            const claimedResults = await Promise.all(claimedPromises);

            allContributorRewards.push(claimedResults.flat());
        } catch (error) {
            throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return allContributorRewards;
}
