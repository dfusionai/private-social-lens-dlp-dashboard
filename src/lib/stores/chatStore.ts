import { writable } from 'svelte/store';


export interface ChatState {
    totalChatIds: string;
    avgChatsPerContributor: string;
    selectedDateIndex: number;
}

const initialState: ChatState = {
    totalChatIds: "",
    avgChatsPerContributor: "",
    selectedDateIndex: 0,
};

export const chatStore = writable<ChatState>(initialState);

// Actions
export const chatActions = {
    setTotalChatIds: (totalChatIds: string) => {
        chatStore.update(state => ({
            ...state,
            totalChatIds,
        }));
    },
    setAvgChatsPerContributor: (avgChatsPerContributor: string) => {
        chatStore.update(state => ({
            ...state,
            avgChatsPerContributor,
        }));
    },
    setSelectedDateIndex: (selectedDateIndex: number) => {
        chatStore.update(state => ({
            ...state,
            selectedDateIndex,
        }));
    },
    clear: () => {
        chatStore.set(initialState);
    },
};