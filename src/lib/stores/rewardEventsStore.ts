import { writable } from 'svelte/store';
import type { ethers } from 'ethers';

type TEventLog = ethers.Log | ethers.EventLog;

export interface RewardEventsState {
    contributorRewardEvents: TEventLog[][] | null;
    validatorRewardEvents: TEventLog[][] | null;
    ownerRewardEvents: TEventLog[][] | null;
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

    setContributorRewardEvents: (contributorRewardEvents: TEventLog[][]) => {
        rewardEventsStore.update(state => ({
            ...state,
            contributorRewardEvents,
        }));
    },

    setValidatorRewardEvents: (validatorRewardEvents: TEventLog[][]) => {
        rewardEventsStore.update(state => ({
            ...state,
            validatorRewardEvents,
        }));
    },

    setOwnerRewardEvents: (ownerRewardEvents: TEventLog[][]) => {
        rewardEventsStore.update(state => ({
            ...state,
            ownerRewardEvents,
        }));
    },

    clear: () => {
        rewardEventsStore.set(initialState);
    }
};