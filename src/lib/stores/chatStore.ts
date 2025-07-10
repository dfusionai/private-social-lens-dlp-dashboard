import { writable } from 'svelte/store';

interface IChatDataItem {
    date: Date;
    newChats: number;
    refreshedChats: number;
}

export interface ChatState {
    totalChatIds: string;
    avgChatsPerContributor: string;
    chatData: IChatDataItem[] | null;
}

const initialState: ChatState = {
    totalChatIds: "",
    avgChatsPerContributor: "",
    chatData: null,
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
    setChatData: (chatData: IChatDataItem[]) => {
        chatStore.update(state => ({
            ...state,
            chatData,
        }));
    },
    clear: () => {
        chatStore.set(initialState);
    },
};