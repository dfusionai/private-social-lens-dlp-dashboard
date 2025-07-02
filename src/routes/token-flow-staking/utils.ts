import type { ethers } from "ethers";
import { formatNumberWithDecimals } from "$lib/utils";
import { weiToEther } from "../../lib/utils";
import type { ITrendingData } from "./components/chart-footer/type";
import { queryMonthDuration } from "$lib/const";

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
            netFlow: "-",
            netFlowPerDay: "-",
            netFlowPerWeek: "-",
            totalStakeIn: "-",
            totalUnstakeOut: "-",
        };
    }

    const totalStakeIn = stakeEvents.flat().reduce((total, event) => {
        const eventLog = event as any;
        const amount = weiToEther(eventLog.args?.[1] || 0);
        return total + amount;
    }, 0);

    const totalUnstakeOut = unstakeEvents.flat().reduce((total, event) => {
        const eventLog = event as any;
        const amount = weiToEther(eventLog.args?.[1] || 0);
        return total + amount;
    }, 0);

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
        const allStakers = stakeEvents
            .flat()
            .map((data) => (data as any).args[0]);
        const allWithdrawers = unstakeEvents
            .flat()
            .map((data) => (data as any).args[0]);

        //get all addresses in the allStakers
        const uniqueStakers = [...new Set(allStakers)];
        const uniqueWithdrawers = [...new Set(allWithdrawers)];

        // Calculate total staking amount for each unique address
        const stakerAmounts = new Map<string, number>();
        uniqueStakers.forEach((address) => {
            const totalAmount = stakeEvents
                ?.flat()
                .filter((event: any) => (event as any).args[0] === address)
                .reduce(
                    (sum: number, event: any) =>
                        sum + weiToEther((event as any).args[1]),
                    0
                );
            stakerAmounts.set(address, totalAmount || 0);
        });

        // Sort by amount and get top 5
        const top5Stakers = Array.from(stakerAmounts.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([address, amount]) => ({
                address,
                amount: amount.toFixed(2),
            }));

        // find 5 top withdrawers from uniqueWithdrawers
        const withdrawerAmounts = new Map<string, number>();
        uniqueWithdrawers.forEach((address) => {
            const totalAmount = unstakeEvents
                ?.flat()
                .filter((event: any) => (event as any).args[0] === address)
                .reduce(
                    (sum: number, event: any) =>
                        sum + weiToEther((event as any).args[1]),
                    0
                );
            withdrawerAmounts.set(address, totalAmount || 0);
        });

        // Sort by amount and get top 5
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
        // Get all unique addresses that have both staked and unstaked
        const allStakeAddresses = new Set(
            stakeEvents.flat().map((event) => (event as any).args[0])
        );
        const allUnstakeAddresses = new Set(
            unstakeEvents.flat().map((event) => (event as any).args[0])
        );
        const addressesWithBoth = [...allStakeAddresses].filter((addr) =>
            allUnstakeAddresses.has(addr)
        );

        // Calculate hold durations for each address
        const holdDurations: number[] = [];

        addressesWithBoth.forEach((address) => {
            const allStakeEvents = stakeEvents
                .flat()
                .filter((event) => (event as any).args[0] === address)
                .map((event) => ({
                    blockNumber: Number((event as any).blockNumber),
                    amount: weiToEther((event as any).args[1]),
                }))
                .sort((a, b) => a.blockNumber - b.blockNumber);

            const allUnstakeEvents = unstakeEvents
                .flat()
                .filter((event) => (event as any).args[0] === address)
                .map((event) => ({
                    blockNumber: Number((event as any).blockNumber),
                    amount: weiToEther((event as any).args[1]),
                }))
                .sort((a, b) => a.blockNumber - b.blockNumber);

            // Calculate hold duration for each stake that has been withdrawn
            allStakeEvents.forEach((stake) => {
                // Find matching unstake event (same amount, later block)
                const matchingUnstake = allUnstakeEvents.find(
                    (unstake) =>
                        unstake.blockNumber > stake.blockNumber &&
                        Math.abs(unstake.amount - stake.amount) < 0.000001 // Account for rounding
                );

                if (matchingUnstake) {
                    // Calculate hold duration in blocks
                    const holdTime =
                        matchingUnstake.blockNumber - stake.blockNumber;
                    holdDurations.push(holdTime);
                }
            });
        });

        // Calculate average token velocity (average hold duration)
        const averageHoldDuration =
            holdDurations.length > 0
                ? holdDurations.reduce((sum, duration) => sum + duration, 0) /
                    holdDurations.length
                : 0;

        // Convert to days (assuming 12 second block time)
        const blocksPerDay = 7200; // 24 * 60 * 60 / 12
        const averageHoldDays = averageHoldDuration / blocksPerDay;
        const tokenVelocity = averageHoldDays.toFixed(2);

        return tokenVelocity;
    } catch (error) {
        console.error("Error calculating token velocity:", error);
    }
};

export const generateTrendingData = (
    chartData: {
        date: Date;
        stakingAmount: number;
    }[]
) => {
    const latestMonth = chartData[chartData.length - 1];
    const previousMonth = chartData[chartData.length - 2];
    const farestMonth = chartData[0];

    const percent =
        ((latestMonth.stakingAmount - previousMonth.stakingAmount) /
            previousMonth.stakingAmount) *
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


export const generateLatestMonths = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, now.getDate());
        months.push({ date, stakingAmount: 0 });
    }

    return months;
};