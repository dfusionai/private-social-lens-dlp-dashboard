import { writable } from 'svelte/store';
import type { ethers } from 'ethers';

export interface StakeEvent {
    blockNumber: number;
    args: any[];
    transactionHash: string;
    logIndex: number;
}

export interface StakeEventsState {
    stakeEventsInWeeks: (ethers.Log | ethers.EventLog)[][] | null;
    stakeEvents: (ethers.Log | ethers.EventLog)[][] | null;
    unstakeEvents: (ethers.Log | ethers.EventLog)[][] | null;
    loading: boolean;
}

const initialState: StakeEventsState = {
    stakeEventsInWeeks: null,
    stakeEvents: null,
    unstakeEvents: null,
    loading: false,
};

export const stakeEventsStore = writable<StakeEventsState>(initialState);

// Actions
export const stakeEventsActions = {
    setLoading: (loading: boolean) => {
        stakeEventsStore.update(state => ({ ...state, loading }));
    },

    setStakeEvents: (stakeEvents: (ethers.Log | ethers.EventLog)[][]) => {
        stakeEventsStore.update(state => ({
            ...state,
            stakeEvents,
        }));
    },

    setUnstakeEvents: (unstakeEvents: (ethers.Log | ethers.EventLog)[][]) => {
        stakeEventsStore.update(state => ({
            ...state,
            unstakeEvents,
        }));
    },

    setStakeEventsInWeeks: (stakeEventsInWeeks: (ethers.Log | ethers.EventLog)[][]) => {
        stakeEventsStore.update(state => ({
            ...state,
            stakeEventsInWeeks,
        }));
    },

    clear: () => {
        stakeEventsStore.set(initialState);
    }
};