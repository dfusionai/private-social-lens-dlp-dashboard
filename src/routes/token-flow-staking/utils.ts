import type { ethers } from "ethers";
import { formatNumberWithDecimals } from "$lib/utils";
import { weiToEther } from "../../lib/utils";
import type { ITrendingData } from "./components/chart-footer/type";
import { blockRangeForADay, queryMonthDuration, queryWeekDuration } from "$lib/const";

export const calculateTotalFromEvents = (
    events: (ethers.Log | ethers.EventLog)[]
): number => {
    return events.reduce((total, event) => {
        const eventLog = event as any;
        const amount = weiToEther(eventLog.args?.[1]);
        return total + amount;
    }, 0);
};

export const calculateStakeAmount = (
    stakeEvents: (ethers.Log | ethers.EventLog)[][]
) => {
    return stakeEvents.map(calculateTotalFromEvents);
};

export const calculateNetFlowInfo = (
    stakeEvents: (ethers.Log | ethers.EventLog)[][],
    unstakeEvents: (ethers.Log | ethers.EventLog)[][]
): {
    netFlow: string;
    netFlowPerDay: string;
    netFlowPerWeek: string;
    totalStakeIn: string;
    totalUnstakeOut: string;
} => {
    if (!stakeEvents || !unstakeEvents) {
        return {
            netFlow: "",
            netFlowPerDay: "",
            netFlowPerWeek: "",
            totalStakeIn: "",
            totalUnstakeOut: "",
        };
    }

    // Single flat operation for better performance
    const flatStakeEvents = stakeEvents.flat();
    const flatUnstakeEvents = unstakeEvents.flat();

    // Use reduce for O(n) calculation instead of multiple operations
    const totalStakeIn = calculateTotalFromEvents(flatStakeEvents);

    const totalUnstakeOut = calculateTotalFromEvents(flatUnstakeEvents);

    // Calculate net flow
    const netFlow = totalStakeIn - totalUnstakeOut;

    // Calculate per day (assuming 6 months = 180 days)
    const daysInPeriod = queryMonthDuration * 30;
    const netFlowPerDay = netFlow / daysInPeriod;

    // Calculate per week
    const weeksInPeriod = 4 * queryMonthDuration; // 6 months ≈ 26 weeks
    const netFlowPerWeek = netFlow / weeksInPeriod;

    return {
        netFlow: formatNumberWithDecimals(netFlow),
        netFlowPerDay: formatNumberWithDecimals(netFlowPerDay),
        netFlowPerWeek: formatNumberWithDecimals(netFlowPerWeek),
        totalStakeIn: formatNumberWithDecimals(totalStakeIn),
        totalUnstakeOut: formatNumberWithDecimals(totalUnstakeOut),
    };
};

export const getTopStakers = (
    stakeEvents: (ethers.Log | ethers.EventLog)[][],
    unstakeEvents: (ethers.Log | ethers.EventLog)[][]
) => {
    if (!stakeEvents || !unstakeEvents) return;

    try {
        // Single flat operation for better performance
        const flatStakeEvents = stakeEvents.flat();
        const flatUnstakeEvents = unstakeEvents.flat();

        // Use Maps for O(1) lookups instead of Sets and filters
        const stakerAmounts = new Map<string, number>();
        const withdrawerAmounts = new Map<string, number>();

        // Process stake events in single pass - O(n)
        flatStakeEvents.forEach((event) => {
            const address = (event as any).args[0];
            const amount = weiToEther((event as any).args[1]);
            
            const currentAmount = stakerAmounts.get(address) || 0;
            stakerAmounts.set(address, currentAmount + amount);
        });

        // Process unstake events in single pass - O(n)
        flatUnstakeEvents.forEach((event) => {
            const address = (event as any).args[0];
            const amount = weiToEther((event as any).args[1]);
            
            const currentAmount = withdrawerAmounts.get(address) || 0;
            withdrawerAmounts.set(address, currentAmount + amount);
        });

        // Sort and get top 5 stakers - O(n log n) but n is small (unique addresses)
        const top5Stakers = Array.from(stakerAmounts.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([address, amount]) => ({
                address,
                amount: amount.toFixed(2),
            }));

        // Sort and get top 5 withdrawers - O(n log n) but n is small
        const top5Withdrawers = Array.from(withdrawerAmounts.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([address, amount]) => ({
                address,
                amount: amount.toFixed(2),
            }));

        return {
            top5Stakers,
            top5Withdrawers,
        };
    } catch (error) {
        throw error;
    }
};

export const getTokenVelocity = (
    stakeEvents: (ethers.Log | ethers.EventLog)[][],
    unstakeEvents: (ethers.Log | ethers.EventLog)[][]
) => {
    if (!stakeEvents || !unstakeEvents) return;

    try {
        // Flatten events once - O(n)
        const flatStakeEvents = stakeEvents.flat();
        const flatUnstakeEvents = unstakeEvents.flat();

        // Create Maps for O(1) lookups instead of Sets and filters - O(n)
        const stakeAddressMap = new Map<string, Array<{blockNumber: number, amount: number}>>();
        const unstakeAddressMap = new Map<string, Array<{blockNumber: number, amount: number}>>();

        // Process stake events - O(n)
        flatStakeEvents.forEach((event) => {
            const address = (event as any).args[0];
            const blockNumber = Number((event as any).blockNumber);
            const amount = weiToEther((event as any).args[1]);
            
            if (!stakeAddressMap.has(address)) {
                stakeAddressMap.set(address, []);
            }
            stakeAddressMap.get(address)!.push({ blockNumber, amount });
        });

        // Process unstake events - O(n)
        flatUnstakeEvents.forEach((event) => {
            const address = (event as any).args[0];
            const blockNumber = Number((event as any).blockNumber);
            const amount = weiToEther((event as any).args[1]);
            
            if (!unstakeAddressMap.has(address)) {
                unstakeAddressMap.set(address, []);
            }
            unstakeAddressMap.get(address)!.push({ blockNumber, amount });
        });

        // Find addresses with both stake and unstake events - O(n)
        const addressesWithBoth = Array.from(stakeAddressMap.keys()).filter(addr => 
            unstakeAddressMap.has(addr)
        );

        // Calculate hold durations - O(n)
        const holdDurations: number[] = [];

        addressesWithBoth.forEach((address) => {
            const stakeEvents = stakeAddressMap.get(address)!.sort((a, b) => a.blockNumber - b.blockNumber);
            const unstakeEvents = unstakeAddressMap.get(address)!.sort((a, b) => a.blockNumber - b.blockNumber);

            // Use two pointers for O(n) matching instead of nested loops
            let stakeIndex = 0;
            let unstakeIndex = 0;

            while (stakeIndex < stakeEvents.length && unstakeIndex < unstakeEvents.length) {
                const stake = stakeEvents[stakeIndex];
                const unstake = unstakeEvents[unstakeIndex];

                if (unstake.blockNumber > stake.blockNumber && 
                    Math.abs(unstake.amount - stake.amount) < 0.000001) {
                    // Found matching pair
                    const holdTime = unstake.blockNumber - stake.blockNumber;
                    holdDurations.push(holdTime);
                    stakeIndex++;
                    unstakeIndex++;
                } else if (unstake.blockNumber <= stake.blockNumber) {
                    unstakeIndex++;
                } else {
                    stakeIndex++;
                }
            }
        });

        // Calculate average - O(n)
        const averageHoldDuration = holdDurations.length > 0
            ? holdDurations.reduce((sum, duration) => sum + duration, 0) / holdDurations.length
            : 0;

        // Convert to days (assuming 12 second block time)
        const blocksPerDay = blockRangeForADay; // 24 * 60 * 60 / 6
        const averageHoldDays = averageHoldDuration / blocksPerDay;
        const tokenVelocity = averageHoldDays.toFixed(2);

        return tokenVelocity;
    } catch (error) {
        throw error;
    }
};

export const generateTrendingData = (
    chartData: {
        date: Date;
        amount: number;
    }[]
) => {
    const latestMonth = chartData[chartData.length - 1];
    const previousMonth = chartData[chartData.length - 2];
    const farestMonth = chartData[0];

    const percent =
        ((latestMonth.amount - previousMonth.amount) /
            previousMonth.amount) *
        100;

    const trendingData: ITrendingData = {
        percent: percent.toFixed(2),
        isUp: percent > 0,
        timeDuration: {
            from: farestMonth.date.toLocaleDateString("en-US", {
                month: "long",
            }),
            to: latestMonth.date.toLocaleDateString("en-US", {
                month: "long",
            }),
            year: latestMonth.date.getFullYear().toString(),
        },
    };

    return trendingData;
};

export const generateWeekTrendingData = (
    chartData: {
        date: Date;
        amount: number;
    }[]
) => {
    const latestWeek = chartData[chartData.length - 1];
    const previousWeek = chartData[chartData.length - 2];
    const farestWeek = chartData[0];

    const percent =
        ((latestWeek.amount - previousWeek.amount) /
        previousWeek.amount) *
        100;


    const trendingData: ITrendingData = {
        percent: percent.toFixed(2),
        isUp: percent > 0,
        timeDuration: {
            from: farestWeek.date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            to: latestWeek.date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
        },
    };

    return trendingData;
};

export const generateLatestMonths = () => {
    const months = [];
    const now = new Date();
    
    for (let i = queryMonthDuration - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, now.getDate());
        months.push({ date, amount: 0 });
    }

    return months;
};
export const generateRewardLatestMonths = () => {
    const months = [];
    const now = new Date();
    
    for (let i = queryMonthDuration - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, now.getDate());
        months.push({ date, amount: 0 });
    }

    return months;
};

export const generateLatestWeeks = () => {
    const weeks = [];
    const now = new Date();

    for (let i = queryWeekDuration - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i * 7);
        weeks.push({ date, amount: 0 });
    }

    return weeks;
};

export const generateRewardLatestWeeks = () => {
    const weeks = [];
    const now = new Date();

    for (let i = queryWeekDuration - 1; i >= 0; i--) {
        const date = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - i * 7
        );
        weeks.push({ date, amount: 0 });
    }

    return weeks;
};