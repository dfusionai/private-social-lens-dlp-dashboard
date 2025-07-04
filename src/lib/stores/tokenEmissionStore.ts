import { writable } from 'svelte/store';

export interface TokenEmissionState {
    rewardOnMonth: {
        date: Date;
        amount: number;
    }[] | null;
    rewardOnWeek: {
        date: Date;
        amount: number;
    }[] | null;
    loading: boolean;
    selectedDateIndex: number;
}

const initialState: TokenEmissionState = {
    rewardOnMonth: null,
    rewardOnWeek: null,
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

    clear: () => {
        tokenEmissionStore.set(initialState);
    },
};