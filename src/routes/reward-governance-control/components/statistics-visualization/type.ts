import type { ITotalRewards } from "../reward-statistics/type";

export interface IStatisticsVisualizationProps {
    totalRewards: ITotalRewards;
    totalDistributed: number;
    isLoading: boolean;
}
