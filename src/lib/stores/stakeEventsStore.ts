import { writable } from 'svelte/store';

interface IStake {
    date: Date;
    amount: number;
}

export interface StakeEventsState {
    stakeOnMonth: IStake[] | null;
    stakeOnWeek: IStake[] | null;
}

const initialState: StakeEventsState = {
    stakeOnMonth: null,
    stakeOnWeek: null,
};

export const stakeEventsStore = writable<StakeEventsState>(initialState);

// Actions
export const stakeEventsActions = {
    setStakeOnMonth: (stakeOnMonth: IStake[]) => {
        stakeEventsStore.update(state => ({
            ...state,
            stakeOnMonth,
        }));
    },
    setStakeOnWeek: (stakeOnWeek: IStake[]) => {
        stakeEventsStore.update(state => ({
            ...state,
            stakeOnWeek,
        }));
    },
    clear: () => {
        stakeEventsStore.set(initialState);
    }
};