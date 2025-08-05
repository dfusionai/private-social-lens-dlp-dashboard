<script lang="ts">
    import { onMount } from "svelte";
    import { chatStore, chatActions } from "$lib/stores/chatStore";
    import { toast } from "svelte-sonner";
    import CardInfo from "./card-info.svelte";
    import { fetchAvgChatsPerContributor } from "../../../../api/fetchAvgChatsPerContributor";
    import { fetchTotalUniqueChatIds } from "../../../../api/fetchTotalUniqueChatIds";

    let isTotalChatsIdLoading = $state(false);
    let isAvgChatsPerContributorLoading = $state(false);
    let data = $state({
        totalChatsId: "",
        avgChatsPerContributor: "",
    });
    const store = $chatStore;

    const queryTotalUniqueChats = async () => {
        try {
            isTotalChatsIdLoading = true;
            const totalChatsId = await fetchTotalUniqueChatIds();
            data.totalChatsId = String(totalChatsId.data);
            chatActions.setTotalChatIds(String(totalChatsId.data));
        } catch (error) {
            toast.error("Fetching total unique chats Failed!");
        } finally {
            isTotalChatsIdLoading = false;
        }
    };

    const queryAvgChatsPerContributor = async () => {
        try {
            isAvgChatsPerContributorLoading = true;
            const avgChatsPerContributor = await fetchAvgChatsPerContributor();
            data.avgChatsPerContributor = String(avgChatsPerContributor.data);
            chatActions.setAvgChatsPerContributor(
                String(avgChatsPerContributor.data)
            );
        } catch (error) {
            toast.error("Fetching avg chats per contributor Failed!");
        } finally {
            isAvgChatsPerContributorLoading = false;
        }
    };

    onMount(() => {
        if (!store.avgChatsPerContributor) {
            queryAvgChatsPerContributor();
        }

        if (!store.totalChatIds) {
            queryTotalUniqueChats();
        }
    });
</script>

<div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
    <CardInfo
        label="Total unique chat Ids"
        value={data.totalChatsId}
        description="Total number of unique chat Ids"
        isLoading={isTotalChatsIdLoading}
        reloadHandler={queryTotalUniqueChats}
    />
    <CardInfo
        label="Average chats per contributor"
        value={data.avgChatsPerContributor}
        description="Average number of chats generated per contributor over time"
        isLoading={isAvgChatsPerContributorLoading}
        reloadHandler={queryAvgChatsPerContributor}
    />
</div>
