import { ethers } from "ethers";
import dlpcAbi from "../assets/contracts/dlp-abi.json";
import { ENV_CONFIG } from "$lib/const";

const provider = new ethers.JsonRpcProvider(ENV_CONFIG.VITE_RPC_URL);
const dlpContract = new ethers.Contract(
    ENV_CONFIG.VITE_DLP_ADDRESS,
    dlpcAbi.abi,
    provider
);

export async function fetchTotalRewardDistributed() {
    const filter = dlpContract.filters.RewardRequested();

    // Adjust block ranges for your chain for performance
    const events = await dlpContract.queryFilter(filter, 0, "latest");

    const eventTopic = ethers.id("RewardRequested(address,uint256,uint256,uint256)");

    const logs = await provider.getLogs({
        address: ENV_CONFIG.VITE_DLP_ADDRESS,
        topics: [eventTopic],
        fromBlock: 0,
        toBlock: "latest",
    });

    let total = BigInt(0);

    for (const log of logs) {
        // Decode log data using ethers v6 syntax
        const decoded = ethers.AbiCoder.defaultAbiCoder().decode(["uint256"], log.data);
        const rewardAmount = BigInt(decoded[0]);
        total = total + rewardAmount;
    }

    return Number(total);
}
