export enum DurationType {
    MONTH = "month",
    WEEK = "week",
}

export interface IStakingFlowChartProps {
    durationType: DurationType;
}

export interface ITrendingData {
    percent: string;
    isUp: boolean;
    timeDuration: {
        from: string;
        to: string;
        year?: string;
    };
}

export interface IChartFooterProps {
    trendingData: ITrendingData;
}

