import { writable } from "svelte/store";
import { ethers } from "ethers";
import { ENV_CONFIG } from "../const";
import dplAbi from "../../assets/contracts/dpl-abi.json";
import stakingAbi from "../../assets/contracts/staking-abi.json";
import tokenAbi from "../../assets/contracts/token-abi.json";

function createContractStore() {
    const { subscribe, set } = writable<{
        dlpContract: ethers.Contract | null;
        stakingContract: ethers.Contract | null;
        tokenContract: ethers.Contract | null;
        provider: ethers.JsonRpcProvider | null;
        error: string | null;
    }>({
        dlpContract: null,
        stakingContract: null,
        tokenContract: null,
        provider: null,
        error: null,
    });

    async function initializeContract() {
        try {
            // Initialize provider
            const provider = new ethers.JsonRpcProvider(ENV_CONFIG.VITE_RPC_URL);

            const dlpContract = new ethers.Contract(
                ENV_CONFIG.VITE_DLP_ADDRESS,
                dplAbi.abi,
                provider
            );

            const stakingContract = new ethers.Contract(
                ENV_CONFIG.VITE_STAKING_ADDRESS,
                stakingAbi.abi,
                provider
            );

            const tokenContract = new ethers.Contract(
                ENV_CONFIG.VITE_TOKEN_ADDRESS,
                tokenAbi.abi,
                provider
            );
            
            // Update store
            set({
                dlpContract,
                stakingContract,
                tokenContract,  
                provider,
                error: null,
            });
        } catch (err: any) {
            set({
                dlpContract: null,
                stakingContract: null,
                tokenContract: null,
                provider: null,
                error: err.message
            });
        }
    }
}

export const contractStore = createContractStore();
