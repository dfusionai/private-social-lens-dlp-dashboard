<script lang="ts">
    import { onMount } from "svelte";
    import { formatDate, generateDailyChartData } from "$lib/utils";
    import { daysPerMonth, fromIndex } from "$lib/const";
    import UniqueChatId from "./unique-chat-id.svelte";
    import UserDistribution from "./user-distribution.svelte";
    import { fetchAvgChatsPerContributor } from "../../../../api/fetchAvgChatsPerContributor";
    import {
        fetchDailyUniqueContributors,
        type IDailyUniqueContributorsItem,
    } from "../../../../api/fetchDailyUniqueContributors";
    import CardInfo from "./card-info.svelte";

    let isContributorLoading = $state(false);
    let isAvgChatsPerContributorLoading = $state(false);
    let data = $state({
        dailyUniqueContributors: "",
        avgChatsPerContributor: "",
    });

    let monthData = generateDailyChartData(fromIndex, daysPerMonth);

    let params = {
        startDate: formatDate(monthData[0].date, "YMD_DASH"),
        endDate: formatDate(monthData[monthData.length - 1].date, "YMD_DASH"),
    };

    const sum = (data: IDailyUniqueContributorsItem[]) => {
        return data.reduce(
            (acc, curr) => acc + curr.dailyUniqueContributors,
            0
        );
    };

    const queryUniqueContributors = async () => {
        try {
            isContributorLoading = true;
            const dailyUniqueContributors =
                await fetchDailyUniqueContributors(params);
            const sumDailyUniqueContributors = sum(
                dailyUniqueContributors.data
            );
            data.dailyUniqueContributors = String(sumDailyUniqueContributors);
        } catch (error) {
            throw error;
        } finally {
            isContributorLoading = false;
        }
    };

    const queryAvgChatsPerContributor = async () => {
        try {
            isAvgChatsPerContributorLoading = true;
            const avgChatsPerContributor = await fetchAvgChatsPerContributor();
            data.avgChatsPerContributor = String(avgChatsPerContributor);
        } catch (error) {
            throw error;
        } finally {
            isAvgChatsPerContributorLoading = false;
        }
    };

    onMount(async () => {
        await Promise.all([
            queryUniqueContributors(),
            queryAvgChatsPerContributor(),
        ]);
    });
</script>

<div class="grid grid-cols-2 gap-8">
    <UniqueChatId />
    <UserDistribution />
</div>

<div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
    <CardInfo
        label="Daily unique contributors"
        value={data.dailyUniqueContributors}
        description="Number of unique contributors who participated in token emission on a daily basis"
        isLoading={isContributorLoading}
        reloadHandler={queryUniqueContributors}
    />
    <CardInfo
        label="Average charts per contributor"
        value={data.avgChatsPerContributor}
        description="Average number of charts generated per contributor over time"
        isLoading={isAvgChatsPerContributorLoading}
        reloadHandler={queryAvgChatsPerContributor}
    />
</div>
