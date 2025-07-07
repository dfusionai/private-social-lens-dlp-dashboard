import { writable } from 'svelte/store';
import type { ethers } from 'ethers';

interface IStake {
    date: Date;
    amount: number;
}

type TEventLog = ethers.Log | ethers.EventLog;

export interface StakeEvent {
    blockNumber: number;
    args: any[];
    transactionHash: string;
    logIndex: number;
}

export interface StakeEventsState {
    stakeOnMonth: IStake[] | null;
    stakeOnWeek: IStake[] | null;
    stakeEvents: TEventLog[][] | null;
    unstakeEvents: TEventLog[][] | null;
    loading: boolean;
}

const initialState: StakeEventsState = {
    stakeOnMonth: null,
    stakeOnWeek: null,
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