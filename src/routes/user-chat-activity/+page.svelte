<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import { formatNumberIntoShort } from "$lib/utils";
    import { onMount } from "svelte";
    import { fetchTotalUniqueUsers } from "../../api/fetchTotalUniqueUsers";
    import { fetchTotalContributorsRewardAmount } from "../../api/fetchTotalContributorsRewardAmount";
    import { metrics } from "./const";
    import { ENV_CONFIG } from "$lib/const";
    import { ethers } from "ethers";
    import teepoolAbi from "../../assets/contracts/teepool-abi.json";
    import { fetchChatInfo } from "../../api/fetchChatInfo";

    const provider = new ethers.JsonRpcProvider(ENV_CONFIG.VITE_RPC_URL);

    const teepoolContract = new ethers.Contract(
        ENV_CONFIG.VITE_TEE_POOL_ADDRESS,
        teepoolAbi.abi,
        provider
    );

    let isLoading = $state(false);

    onMount(async () => {
        try {
            isLoading = true;
            const totalUniqueUsers = await fetchTotalUniqueUsers();
            const chatInfo = await fetchChatInfo();
            const totalUniqueChats = chatInfo.data.totalChats;
            const totalContributorsRewardAmount =
                await fetchTotalContributorsRewardAmount();
            const totalUniqueChatsPerUser = Math.floor(
                totalUniqueChats / totalUniqueUsers
            );
            const averageVFSNPerHolder =
                totalContributorsRewardAmount / totalUniqueUsers;
            const averageRewardsPerChat =
                totalContributorsRewardAmount / totalUniqueChats;

            metrics[0].value = totalUniqueUsers;
            metrics[1].value = totalUniqueChats; //total unique chats
            metrics[2].value = totalUniqueChatsPerUser;
            metrics[8].value = averageVFSNPerHolder;
            metrics[9].value = totalContributorsRewardAmount;
            metrics[10].value = averageRewardsPerChat;
        } catch (error) {
            throw error;
        } finally {
            isLoading = false;
        }
    });
</script>

<div>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {#each metrics as metric}
            <Card.Root>
                <Card.Header
                    class="flex flex-row items-center justify-between space-y-0 pb-2"
                >
                    <Card.Title class="text-sm font-medium"
                        >{metric.label}</Card.Title
                    >
                    <!-- svelte-ignore svelte_component_deprecated -->
                    <svelte:component
                        this={metric.icon}
                        class="h-4 w-4 text-gray-400"
                    />
                </Card.Header>
                <Card.Content>
                    <div class="space-y-1">
                        {#if isLoading}
                            <div class="flex flex-col h-[58px] justify-between">
                                <Skeleton class="h-8 w-20" />
                                <Skeleton class="h-4 w-16" />
                            </div>
                        {:else}
                            <div class="text-2xl font-bold">
                                {formatNumberIntoShort(metric.value)}
                            </div>
                            <div class="flex items-center gap-2">
                                <p class="text-xs text-gray-600">
                                    {metric.description}
                                </p>
                            </div>
                        {/if}
                    </div>
                </Card.Content>
            </Card.Root>
        {/each}
    </div>

    <!-- <div class="mt-4">
        <BarChat {chartConfig} {chartData} {series} />
    </div> -->
</div>
