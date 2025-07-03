import { writable } from 'svelte/store';
import type { ethers } from 'ethers';

export interface StakeEvent {
    blockNumber: number;
    args: any[];
    transactionHash: string;
    logIndex: number;
}

export interface ContributorRewardEventForDate {
    totalReward: number;
    totalEvents: number;
}

export interface RewardEventsState {
    contributorRewardEvents: (ethers.Log | ethers.EventLog)[][] | null;
    contributorRewardEventsInWeeks: (ethers.Log | ethers.EventLog)[][] | null;
    validatorRewardEvents: (ethers.Log | ethers.EventLog)[][] | null;
    ownerRewardEvents: (ethers.Log | ethers.EventLog)[][] | null;
    contributorRewardEventsForDate: ContributorRewardEventForDate | null;
    loading: boolean;
}

const initialState: RewardEventsState = {
    contributorRewardEvents: null,
    contributorRewardEventsInWeeks: null,
    validatorRewardEvents: null,
    ownerRewardEvents: null,
    contributorRewardEventsForDate: null,
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

    setContributorRewardEventsInWeeks: (contributorRewardEventsInWeeks: (ethers.Log | ethers.EventLog)[][]) => {
        rewardEventsStore.update(state => ({
            ...state,
            contributorRewardEventsInWeeks,
        }));
    },

    setContributorRewardEventsForDate: (contributorRewardEventsForDate: ContributorRewardEventForDate) => {
        rewardEventsStore.update(state => ({
            ...state,
            contributorRewardEventsForDate,
        }));
    },
    
    clear: () => {
        rewardEventsStore.set(initialState);
    }
};