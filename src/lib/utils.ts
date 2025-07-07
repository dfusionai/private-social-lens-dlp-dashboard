import { clsx, type ClassValue } from "clsx";
import { ethers } from "ethers";
import { twMerge } from "tailwind-merge";
import { ENV_CONFIG, maxBlockRange } from "$lib/const";
import dayjs from "dayjs";
import { DATE_FORMAT_CONST } from "./const";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export const padHex = (hex: string) => {
	return hex.replace(/^0x/, "").padStart(64, "0");
}

export const callRpc = async (method: string, params: any[], rpcUrl: string) => {
	const res = await fetch(rpcUrl, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
	});

	const { result, error } = await res.json();

	if (error) throw new Error(error.message);
	return result;
}

export function formatNumber(n: number) {
	return n.toLocaleString("en-US");
}

export const formatNumberIntoShort = (num: number) => {
	if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
	if (num >= 1000) return (num / 1000).toFixed(1) + "K";
	return num.toLocaleString();
};

export const formatNumberWithDecimals = (num: number, decimals: number = 2) => {
	return num.toFixed(decimals);
};

export const weiToEther = (weiAmount: bigint | string | number): number => {
    const wei = BigInt(weiAmount || 0);
    return Number(wei) / 1e18;
};

export const formatDecimalNumber = (num: number, decimals: number = 2) => {
	const decimalNumber = Number(formatNumberWithDecimals(num, decimals));

	return formatNumber(decimalNumber);
};

export const decodeHexData = (hexData: string) => {
    const coder = new ethers.AbiCoder();
    const decoded = coder.decode(["string"], hexData);
    return decoded;
}

export const splitBlockRange = (startBlock: number, endBlock: number) => {
    const ranges = [];
    let currentStart = startBlock;
    while (currentStart <= endBlock) {
        const currentEnd = Math.min(currentStart + maxBlockRange - 1, endBlock);
        ranges.push([currentStart, currentEnd]);
        currentStart = currentEnd + 1;
    }
    return ranges;
}

export const getBlockRangeForDate = async (date: string, provider: ethers.JsonRpcProvider) => {
    const startTimestamp = Math.floor(new Date(date + "T00:00:00Z").getTime() / 1000);
    const endTimestamp = Math.floor(new Date(date + "T23:59:59Z").getTime() / 1000);

    async function findBlockByTimestamp(targetTimestamp: number, startBlock: number, endBlock: number) {
        while (startBlock < endBlock) {
            const mid = Math.floor((startBlock + endBlock) / 2);
            const block = await provider.getBlock(mid);
            if (block && block.timestamp < targetTimestamp) {
            startBlock = mid + 1;
            } else {
            endBlock = mid;
            }
        }
        return startBlock;
    }

    const latestBlock = await provider.getBlockNumber();
    const earliestBlock = 1;

    const startBlock = await findBlockByTimestamp(startTimestamp, earliestBlock, latestBlock);
    const endBlock = await findBlockByTimestamp(endTimestamp, startBlock, latestBlock);

    return { startBlock, endBlock };
}

export const formatDate = (date: Date, format: keyof typeof DATE_FORMAT_CONST) => {
    return dayjs(date).format(DATE_FORMAT_CONST[format]);
}

export const getDateGap = (from: Date, to: Date) => {
    const fromDate = dayjs(from);

    const gap = fromDate.diff(to, "day");

    return gap;
};

export const generateDailyChartData = (from: number, to: number) => {
    const week = [];
    const now = new Date();

    for (let i = to; i >= from; i--) {
        const date = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - i
        );
        week.push({ date, amount: 0 });
    }

    return week;
};  

export const generateQuery = (params: Record<string, string>) => {
    const queryString= Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

    return `?${queryString}`
};
