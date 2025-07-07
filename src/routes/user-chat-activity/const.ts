import {
    Users,
    MessageSquare,
    Calculator,
    Calendar,
    CalendarDays,
    UserPlus,
    Shield,
    Coins,
    BarChart3,
    Gift,
} from "@lucide/svelte";

export const metrics = [
    {
        label: "Total Unique Users",
        value: 0,
        icon: Users,
        description: "Total unique users who have interacted with the platform",
    },
    {
        label: "Total Unique Chats",
        value: 0,
        icon: MessageSquare,
        description: "Total unique chats that have been sent",
    },
    {
        label: "Average Chats Per User",
        value: 0,
        icon: Calculator,
        description: "Average number of chats per user",
    },
    {
        label: "Median Chats Per User",
        value: 0,
        icon: Calculator,
        description: "Median number of chats per user",
    },
    {
        label: "Daily Active Users",
        value: 0,
        icon: Calendar,
        description: "Number of unique users who have interacted with the platform on a given day",
    },
    {
        label: "Weekly Active Users",
        value: 0,
        icon: CalendarDays,
        description: "Number of unique users who have interacted with the platform on a given week",
    },
    {
        label: "New Users Per Day",
        value: 0,
        icon: UserPlus,
        description: "Number of new users who have interacted with the platform on a given day",
    },
    {
        label: "Verified vs. Unverified Contributor Ratio",
        value: 0,
        icon: Shield,
        description: "Ratio of verified to unverified contributors",
    },
    {
        label: "Average VFSN Per Holder",
        value: 0,
        icon: Coins,
        description: "Average number of VFSN per holder",
    },
    {
        label: "Distribution of $VFSN Holders",
        value: 0,
        icon: Coins,
        description: "Distribution of $VFSN holders",
    },
    {
        label: "Average Rewards Per Chat",
        value: 0,
        icon: Gift,
        description: "Average number of rewards per chat",
    },
];


