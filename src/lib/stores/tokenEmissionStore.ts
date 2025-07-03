import { writable } from 'svelte/store';

export interface TokenEmissionState {
    rewardOnMonth: {
        date: Date;
        amount: number;
    }[] | null;
    loading: boolean;
}

const initialState: TokenEmissionState = {
    rewardOnMonth: null,
    loading: false,
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
    
    clear: () => {
        tokenEmissionStore.set(initialState);
    }
};