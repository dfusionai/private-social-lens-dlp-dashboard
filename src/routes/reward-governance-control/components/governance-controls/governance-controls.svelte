<script lang="ts">
    import Tabs from "$lib/components/ui/tabs/tabs.svelte";
    import TabsList from "$lib/components/ui/tabs/tabs-list.svelte";
    import TabsTrigger from "$lib/components/ui/tabs/tabs-trigger.svelte";
    import TabsContent from "$lib/components/ui/tabs/tabs-content.svelte";
    import CardHeader from "$lib/components/ui/card/card-header.svelte";
    import CardTitle from "$lib/components/ui/card/card-title.svelte";
    import Card from "$lib/components/ui/card/card.svelte";
    import CardDescription from "$lib/components/ui/card/card-description.svelte";
    import CardContent from "$lib/components/ui/card/card-content.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import Slider from "$lib/components/ui/slider/slider.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Switch from "$lib/components/ui/switch/switch.svelte";
    import Separator from "$lib/components/ui/separator/separator.svelte";
    import Settings from "@lucide/svelte/icons/settings";
    import Clock from "@lucide/svelte/icons/clock";

    // State variables
    let difficultyReward = $state([100]);
    let contributorMultiplier = $state([1.5]);
    let validatorThreshold = $state([75]);
    let minReward = $state("10");
    let maxReward = $state("1000");
    let earlyBonus = $state(false);
    let bonusPercentage = $state([25]);

    // Setter functions
    function setDifficultyReward(value: number) {
        difficultyReward[0] = value;
    }

    function setContributorMultiplier(value: number) {
        contributorMultiplier[0] = value;
    }

    function setValidatorThreshold(value: number) {
        validatorThreshold[0] = value;
    }

    function setMinReward(value: string) {
        minReward = value;
    }

    function setMaxReward(value: string) {
        maxReward = value;
    }

    function setEarlyBonus(value: boolean) {
        earlyBonus = value;
    }

    function setBonusPercentage(value: number[]) {
        bonusPercentage = value;
    }
</script>

<div>
    <Tabs class="space-y-6" value={"sliders"}>
        <TabsList class="grid w-full grid-cols-3">
            <TabsTrigger value="sliders">Parameter Controls</TabsTrigger>
            <TabsTrigger value="caps">Reward Caps</TabsTrigger>
            <TabsTrigger value="boosts">Time-based Boosts</TabsTrigger>
        </TabsList>

        <TabsContent value="sliders" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <Settings class="w-5 h-5" />
                            Rubric Difficulty vs. Reward
                        </CardTitle>
                        <CardDescription
                            >Adjust reward scaling based on task difficulty</CardDescription
                        >
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="space-y-2">
                            <Label
                                >Difficulty Multiplier: {difficultyReward[0]}%</Label
                            >
                            <Slider
                                type="single"
                                value={difficultyReward[0]}
                                onValueChange={setDifficultyReward}
                                max={200}
                                min={25}
                                step={5}
                                class="w-full"
                            />
                            <div
                                class="flex justify-between text-xs text-muted-foreground"
                            >
                                <span>Low Difficulty (25%)</span>
                                <span>High Difficulty (200%)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Contributor Tier Multipliers</CardTitle>
                        <CardDescription
                            >Reward multiplier based on contributor experience</CardDescription
                        >
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="space-y-2">
                            <Label
                                >Tier Multiplier: {contributorMultiplier[0]}x</Label
                            >
                            <Slider
                                type="single"
                                value={contributorMultiplier[0]}
                                onValueChange={setContributorMultiplier}
                                max={3}
                                min={0.5}
                                step={0.1}
                                class="w-full"
                            />
                            <div
                                class="flex justify-between text-xs text-muted-foreground"
                            >
                                <span>Novice (0.5x)</span>
                                <span>Expert (3x)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Validator Performance Thresholds</CardTitle>
                        <CardDescription
                            >Minimum accuracy required for validator rewards</CardDescription
                        >
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="space-y-2">
                            <Label
                                >Accuracy Threshold: {validatorThreshold[0]}%</Label
                            >
                            <Slider
                                type="single"
                                value={validatorThreshold[0]}
                                onValueChange={setValidatorThreshold}
                                max={100}
                                min={50}
                                step={1}
                                class="w-full"
                            />
                            <div
                                class="flex justify-between text-xs text-muted-foreground"
                            >
                                <span>Minimum (50%)</span>
                                <span>Perfect (100%)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="caps" class="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Reward Caps Configuration</CardTitle>
                    <CardDescription
                        >Set minimum and maximum reward limits</CardDescription
                    >
                </CardHeader>
                <CardContent class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <Label>Minimum Reward (TOKENS)</Label>
                            <Input
                                id="min-reward"
                                type="number"
                                value={minReward}
                                placeholder="10"
                            />
                            <p class="text-xs text-muted-foreground">
                                Minimum tokens per verified contribution
                            </p>
                        </div>
                        <div class="space-y-2">
                            <Label>Maximum Reward (TOKENS)</Label>
                            <Input
                                id="max-reward"
                                type="number"
                                value={maxReward}
                                placeholder="1000"
                            />
                            <p class="text-xs text-muted-foreground">
                                Maximum tokens per verified contribution
                            </p>
                        </div>
                    </div>
                    <Separator />
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h4 class="font-medium mb-2">Current Range</h4>
                        <p class="text-sm text-gray-600">
                            Rewards will be distributed between {minReward} and {maxReward}
                            tokens based on difficulty, contributor tier, and validation
                            accuracy.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="boosts" class="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <Clock class="w-5 h-5" />
                        Time-based Reward Boosts
                    </CardTitle>
                    <CardDescription
                        >Configure early contributor bonuses and time-sensitive
                        incentives</CardDescription
                    >
                </CardHeader>
                <CardContent class="space-y-6">
                    <div class="flex items-center justify-between">
                        <div class="space-y-1">
                            <Label>Early Contributor Bonus</Label>
                            <p class="text-sm text-muted-foreground">
                                Provide additional rewards for early network
                                participants
                            </p>
                        </div>
                        <Switch
                            id="early-bonus"
                            checked={earlyBonus}
                            onCheckedChange={setEarlyBonus}
                        />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
</div>
