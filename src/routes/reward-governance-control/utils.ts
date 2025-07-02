import { queryMonthDuration } from "$lib/const";
import { weiToEther } from "$lib/utils";
import type { IGetRewardStatistics } from "./components/reward-statistics/type";

export const getRewardStatistics = ({
    contributorRewardEvents,
    validatorRewardEvents,
}: IGetRewardStatistics) => {
    if (!validatorRewardEvents || !contributorRewardEvents) {
        return;
    }
    const allValidatorEvent = validatorRewardEvents.flat();
    const allValidatorReward = allValidatorEvent.map(
        (event) => (event as any).args[3]
    );
    const allContributorEvent = contributorRewardEvents.flat();
    const allContributorReward = allContributorEvent.map(
        (event) => (event as any).args[3]
    );

    const contributorReward = allContributorReward.reduce(
        (acc, curr) => acc + weiToEther(curr),
        0
    );
    const validatorReward = allValidatorReward.reduce(
        (acc, curr) => acc + weiToEther(curr),
        0
    );

    return {
        contributorReward,
        validatorReward,
    };
};

export const generateDataFor6Months = () => {
    const months = [];
    const now = new Date();
    
    // Sample contributor reward data for each month
    for (let i = 5; i >= 0; i--) {
        const date = new Date(
            now.getFullYear(),
            now.getMonth() - i,
            now.getDate()
        );
        months.push({
            date,
            contributor: 0,
            validator: 0,
            owner: 0,
        });
    }
    
    return months; // Reverse to show oldest to newest
};