import { Users, BarChart3, MessageSquare, Monitor } from "@lucide/svelte";
import { generatePercentString, generateValueString } from "../../utils";

export const metrics = [
    {
        label: "Daily unique contributors",
        value: "",
        description:
            "Number of unique contributors who participated in token emission on a daily basis",
        icon: Users,
        helper: generateValueString
    },
    {
        label: "Average charts per contributor",
        value: "",
        description:
            "Average number of charts generated per contributor over time",
        icon: BarChart3,
        helper: generateValueString
    },
    {
        label: "Unique chat Ids (new vs refreshed)",
        value: "",
        description:
            "Comparison between new chat sessions and refreshed/reused chat sessions",
        icon: MessageSquare,
        helper: generatePercentString
    },
    {
        label: "Webapp users vs miner users",
        value: "",
        description:
            "Distribution of users between web application interface and mining operations",
        icon: Monitor,
        helper: generatePercentString
    },
];