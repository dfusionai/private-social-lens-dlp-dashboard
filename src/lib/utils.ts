import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
