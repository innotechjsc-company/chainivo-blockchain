"use client";

import {
  MissionCard,
  RewardsSummaryCard,
  MissionsTabsCard,
  SpecialEventCard,
} from "./components";
import { useMissionsData, useMissionsStats, useSpecialEvent } from "./hooks";

export default function MissionsScreen() {
  // 1. Fetch dữ liệu qua hooks
  const { dailyMissions, weeklyMissions, monthlyMissions } = useMissionsData();
  const { stats } = useMissionsStats();
  const { event, timeLeft } = useSpecialEvent();

  // 2. Event handlers
  const handleClaimReward = (missionId: number) => {
    // TODO: Implement reward claim logic
    console.log("Claim reward for mission:", missionId);
  };

  // 3. Compose UI
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Nhiệm vụ & Phần thưởng</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hoàn thành nhiệm vụ hàng ngày để nhận coins và phần thưởng hấp dẫn
          </p>
        </div>

        {/* Rewards Summary */}
        <RewardsSummaryCard stats={stats} />

        {/* Missions Tabs */}
        <MissionsTabsCard
          dailyMissions={dailyMissions}
          weeklyMissions={weeklyMissions}
          monthlyMissions={monthlyMissions}
          onClaimReward={handleClaimReward}
        />

        {/* Special Event */}
        <div className="mt-12">
          <SpecialEventCard
            title={event.title}
            description={event.description}
            timeLeft={timeLeft}
          />
        </div>
      </main>
    </div>
  );
}
