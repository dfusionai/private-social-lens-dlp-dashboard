import type { ethers } from "ethers";
import { formatNumberWithDecimals } from "$lib/utils";
import { weiToEther } from "../../lib/utils";
import { blockRangeForADay, queryMonthDuration, daysPerMonth, weeksPerMonth } from "$lib/const";

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
    const daysInPeriod = daysPerMonth * queryMonthDuration;
    const netFlowPerDay = netFlow / daysInPeriod;

    // Calculate per week
    const weeksInPeriod = weeksPerMonth * queryMonthDuration;
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

        // Convert to days (assuming 6 second block time)
        const blocksPerDay = blockRangeForADay; // 24 * 60 * 60 / 6
        const averageHoldDays = averageHoldDuration / blocksPerDay;
        const tokenVelocity = averageHoldDays.toFixed(2);

        return tokenVelocity;
    } catch (error) {
        throw error;
    }
};
