import BankNoteArrowUp from "@lucide/svelte/icons/banknote-arrow-up";
import MessageCircleQuestion from "@lucide/svelte/icons/message-circle-question";
import BarChart from "@lucide/svelte/icons/bar-chart";
import Activity from "@lucide/svelte/icons/activity";
import HandCoins from "@lucide/svelte/icons/hand-coins";
import SlidersVertical from "@lucide/svelte/icons/sliders-vertical";
import Shield from "@lucide/svelte/icons/shield";

export const data = {
  user: {
    name: "Dfusion",
    email: "dfusion@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Staking Token Movement",
      url: "/",
      icon: BankNoteArrowUp,
    },
    {
      title: "Users Token Emission",
      url: "/users-token-emission",
      icon: BankNoteArrowUp,    
    },
    {
      title: "Token Gating Settings",
      url: "/token-gating-settings",
      icon: Shield,
    },
    // {
    //     title: "User Chat Activity",
    //     url: "/user-chat-activity",
    //     icon: MessageCircleQuestion,
    // },
    // {
    //     title: "Data Efficiency",
    //     url: "/data-efficiency",
    //     icon: BarChart,
    // },
    // {
    //     title: "Health Subnet Ops",
    //     url: "/health-subnet-ops",
    //     icon: Activity,
    // },
    // {
    //     title: "Pricing Monetization",
    //     url: "/pricing-monetization",
    //     icon: HandCoins,
    // },
    // {
    //     title: "Reward Governance Control",
    //     url: "/reward-governance-control",
    //     icon: SlidersVertical,
    // },
  ],
  navClouds: [
    {
      title: "Capture",
      isActive: true,
      url: "/capture",
      items: [
        {
          title: "Active Proposals",
          url: "/capture/proposals",
        },
        {
          title: "Archived",
          url: "/capture/archived",
        },
        {
            title: "$VFSN Token",
            url: "/token",
            icon: BankNoteArrowUp,
        },
        {
            title: "Staking",
            url: "/staking",
            icon: BankNoteArrowUp,
        },
        {
            title: "Files",
            url: "/files",
            icon: BankNoteArrowUp,
        },
        // {
        //     title: "User Chat Activity",
        //     url: "/user-chat-activity",
        //     icon: MessageCircleQuestion,
        // },
        // {
        //     title: "Data Efficiency",
        //     url: "/data-efficiency",
        //     icon: BarChart,
        // },
        // {
        //     title: "Health Subnet Ops",
        //     url: "/health-subnet-ops",
        //     icon: Activity,
        // },
        // {
        //     title: "Pricing Monetization",
        //     url: "/pricing-monetization",
        //     icon: HandCoins,
        // },
        // {
        //     title: "Reward Governance Control",
        //     url: "/reward-governance-control",
        //     icon: SlidersVertical,
        // },
    ],
    navClouds: [
        {
          title: "Active Proposals",
          url: "/proposal/active",
        },
        {
          title: "Archived",
          url: "/proposal/archived",
        },
      ],
    },
    {
      title: "Prompts",
      url: "/prompts",
      items: [
        {
          title: "Active Proposals",
          url: "/prompts/active",
        },
        {
          title: "Archived",
          url: "/prompts/archived",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
    },
    {
      title: "Get Help",
      url: "/help",
    },
    {
      title: "Search",
      url: "/search",
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "/documents/library",
    },
    {
      name: "Reports",
      url: "/documents/reports",
    },
    {
      name: "Word Assistant",
      url: "/documents/assistant",
    },
  ],
};
