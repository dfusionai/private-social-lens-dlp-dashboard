import Users from "@lucide/svelte/icons/users";
import MessageSquare from "@lucide/svelte/icons/message-square";
import TrendingUp from "@lucide/svelte/icons/trending-up";
import Calendar from "@lucide/svelte/icons/calendar";
import UserCheck from "@lucide/svelte/icons/user-check";
import Coins from "@lucide/svelte/icons/coins";
import Gift from "@lucide/svelte/icons/gift";

export const metrics = [
    {
        title: "Total Unique Users",
        value: 0,
        icon: Users,
        description: "All registered users",
        trend: "+12.5%",
        trendUp: true,
        category: "users",
    },
    {
        title: "Total Unique Chats",
        value: 0,
        icon: MessageSquare,
        description: "Thread/group level conversations",
        trend: "+8.3%",
        trendUp: true,
        category: "chats",
    },
    {
        title: "Average Chats per User",
        value: 0,
        icon: TrendingUp,
        description: "Mean engagement level",
        trend: "+2.1%",
        trendUp: true,
        category: "chats",
    },
    {
        title: "Average $VFSN per Holder",
        value: 0,
        icon: Coins,
        description: "Token distribution average",
        trend: "+7.4%",
        trendUp: true,
        category: "users",
    },
    {
        title: "Distribution of $VFSN holders ",
        value: 0,
        icon: Gift,
        description: "All token distribution",
        trend: "-2.1%",
        trendUp: false,
        category: "chats",
    },
    {
        title: "Average Rewards per Chat",
        value: 0,
        icon: Gift,
        description: "Reward distribution rate",
        trend: "-2.1%",
        trendUp: false,
        category: "chats",
    },
    {
        title: "Median Chats per User",
        value: 0,
        icon: TrendingUp,
        description: "Typical user engagement",
        trend: "0%",
        trendUp: null,
        category: "chats",
    },
    {
        title: "Daily Active Users",
        value: 0,
        icon: Calendar,
        description: "Users active today",
        trend: "+5.7%",
        trendUp: true,
        category: "activity",
    },
    {
        title: "Weekly Active Users",
        value: 0,
        icon: Calendar,
        description: "Users active this week",
        trend: "+3.2%",
        trendUp: true,
        category: "activity",
    },
    {
        title: "New Users Today",
        value: 0,
        icon: Users,
        description: "Fresh registrations",
        trend: "+15.8%",
        trendUp: true,
        category: "users",
    },
    {
        title: "Verified Contributors",
        value: 0,
        icon: UserCheck,
        description: "Verified vs unverified ratio",
        trend: "+1.2%",
        trendUp: true,
        category: "users",
    },
];