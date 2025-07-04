import { writable } from 'svelte/store';
import type { ethers } from 'ethers';

export interface RewardEventsState {
    contributorRewardEvents: (ethers.Log | ethers.EventLog)[][] | null;
    validatorRewardEvents: (ethers.Log | ethers.EventLog)[][] | null;
    ownerRewardEvents: (ethers.Log | ethers.EventLog)[][] | null;
    loading: boolean;
}

const initialState: RewardEventsState = {
    contributorRewardEvents: null,
    validatorRewardEvents: null,
    ownerRewardEvents: null,
    loading: false,
};

export const rewardEventsStore = writable<RewardEventsState>(initialState);

// Actions
export const rewardEventsActions = {
    setLoading: (loading: boolean) => {
        rewardEventsStore.update(state => ({ ...state, loading }));
    },

    setContributorRewardEvents: (contributorRewardEvents: (ethers.Log | ethers.EventLog)[][]) => {
        rewardEventsStore.update(state => ({
            ...state,
            contributorRewardEvents,
        }));
    },

    setValidatorRewardEvents: (validatorRewardEvents: (ethers.Log | ethers.EventLog)[][]) => {
        rewardEventsStore.update(state => ({
            ...state,
            validatorRewardEvents,
        }));
    },

    setOwnerRewardEvents: (ownerRewardEvents: (ethers.Log | ethers.EventLog)[][]) => {
        rewardEventsStore.update(state => ({
            ...state,
            ownerRewardEvents,
        }));
    },

    clear: () => {
        rewardEventsStore.set(initialState);
    }
};