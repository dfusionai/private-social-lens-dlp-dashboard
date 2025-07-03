import type { ethers } from "ethers";

export interface ITotalRewards {
    contributor: string;
    validator: string;
    owner: string;
}

export interface IRewardStatisticsProps {
    totalRewards: ITotalRewards;
}

export interface IGetRewardStatistics {
    contributorRewardEvents: (ethers.Log | ethers.EventLog)[][] | null;
    // validatorRewardEvents: (ethers.Log | ethers.EventLog)[][] | null;
    // ownerRewardEvents: (ethers.Log | ethers.EventLog)[][] | null;
}