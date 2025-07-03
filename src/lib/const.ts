export const ENV_CONFIG = {
    VITE_DLP_ADDRESS: import.meta.env.VITE_DLP_ADDRESS,
    VITE_STAKING_ADDRESS: import.meta.env.VITE_STAKING_ADDRESS,
    VITE_TOKEN_ADDRESS: import.meta.env.VITE_TOKEN_ADDRESS,
    VITE_RPC_URL: import.meta.env.VITE_RPC_URL,
    VITE_TEE_POOL_ADDRESS: import.meta.env.VITE_TEE_POOL_ADDRESS,
};

export const queryMonthDuration = 6;
export const queryWeekDuration = 4;
export const blockRangeForAMonth = 432000; // 60 * 60 * 24 * 30
export const blockRangeForAWeek = 100800; // 60 * 60 * 24 * 7
export const blockRangeForADay = 14400; // 60 * 60 * 24
export const maxBlockRange = 10000;
export const tokenSymbol = "VFSN";