import { writable } from 'svelte/store';

interface IReward {
    date: Date;
    amount: number;
}

interface IDailyContributorItem {
    date: Date;
    amount: number;
}

export interface TokenEmissionState {
    rewardOnMonth: IReward[] | null;
    rewardOnWeek: IReward[] | null;
    dailyContributor: IDailyContributorItem[] | null;
    loading: boolean;
    selectedDateIndex: number;
}

const initialState: TokenEmissionState = {
    rewardOnMonth: null,
    rewardOnWeek: null,
    dailyContributor: null,
    loading: false,
    selectedDateIndex: 0,
};

export const tokenEmissionStore = writable<TokenEmissionState>(initialState);

// Actions
export const tokenEmissionActions = {
    setLoading: (loading: boolean) => {
        tokenEmissionStore.update(state => ({ ...state, loading }));
    },
    setRewardOnMonth: (rewardOnMonth: { date: Date; amount: number }[]) => {
        tokenEmissionStore.update(state => ({
            ...state,
            rewardOnMonth,
        }));
    },
    setSelectedDateIndex: (selectedDateIndex: number) => {
        tokenEmissionStore.update(state => ({
            ...state,
            selectedDateIndex,
        }));
    },
    setRewardOnWeek: (rewardOnWeek: { date: Date; amount: number }[]) => {
        tokenEmissionStore.update(state => ({
            ...state,
            rewardOnWeek,
        }));
    },
    setDailyContributor: (dailyContributor: IDailyContributorItem[]) => {
        tokenEmissionStore.update(state => ({
            ...state,
            dailyContributor,
        }));
    },
    clear: () => {
        tokenEmissionStore.set(initialState);
    },
};