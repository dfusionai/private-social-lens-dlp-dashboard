import { writable } from 'svelte/store';
import type { ethers } from 'ethers';

type TEventLog = ethers.Log | ethers.EventLog;

export interface RewardEventsState {
    contributorRewardEvents: TEventLog[][] | null;
    loading: boolean;
}

const initialState: RewardEventsState = {
    contributorRewardEvents: null,
    loading: false,
};

export const rewardEventsStore = writable<RewardEventsState>(initialState);

// Actions
export const rewardEventsActions = {
    setLoading: (loading: boolean) => {
        rewardEventsStore.update(state => ({ ...state, loading }));
    },
    setContributorRewardEvents: (contributorRewardEvents: TEventLog[][]) => {
        rewardEventsStore.update(state => ({
            ...state,
            contributorRewardEvents,
        }));
    },
    clear: () => {
        rewardEventsStore.set(initialState);
    }
};