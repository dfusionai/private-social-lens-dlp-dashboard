export const ENV_CONFIG = {
    VITE_DLP_ADDRESS: import.meta.env.VITE_DLP_ADDRESS,
    VITE_STAKING_ADDRESS: import.meta.env.VITE_STAKING_ADDRESS,
    VITE_TOKEN_ADDRESS: import.meta.env.VITE_TOKEN_ADDRESS,
    VITE_RPC_URL: import.meta.env.VITE_RPC_URL,
    VITE_TEE_POOL_ADDRESS: import.meta.env.VITE_TEE_POOL_ADDRESS,
    VITE_DF_BASE_URL: import.meta.env.VITE_DF_BASE_URL,
    VITE_INDEXER_BASE_URL: import.meta.env.VITE_INDEXER_BASE_URL,
};

export const queryMonthDuration = 6;
export const queryWeekDuration = 4;
// On Vana Chain, a block is created every 6 secs
export const blockRangeForAMonth = 432000; // 60 * 60 * 24 * 30 / 6
export const blockRangeForAWeek = 100800; // 60 * 60 * 24 * 7 / 6
export const blockRangeForADay = 14400; // 60 * 60 * 24 / 6
export const maxBlockRange = 10000;
export const tokenSymbol = "VFSN";
export const weeksPerMonth = 4;
export const daysPerMonth = 30;
export const fromIndex = 0;
export const lastWeekDayInx = 6;
export const daysPerWeek = 7;

export const DATE_FORMAT_CONST = {
    YMD_DASH: "YYYY-MM-DD",
};

export const DECIMAL_OPS = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
};
