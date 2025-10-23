"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MissionCard } from "./MissionCard";
import { Mission } from "../hooks";

interface MissionsTabsCardProps {
  dailyMissions: Mission[];
  weeklyMissions: Mission[];
  monthlyMissions: Mission[];
  onClaimReward?: (missionId: number) => void;
}

export const MissionsTabsCard = ({
  dailyMissions,
  weeklyMissions,
  monthlyMissions,
  onClaimReward,
}: MissionsTabsCardProps) => {
  return (
    <Tabs defaultValue="daily" className="w-full">
      <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8 glass">
        <TabsTrigger value="daily" className="text-base">
          Hàng ngày
        </TabsTrigger>
        <TabsTrigger value="weekly" className="text-base">
          Hàng tuần
        </TabsTrigger>
        <TabsTrigger value="monthly" className="text-base">
          Hàng tháng
        </TabsTrigger>
      </TabsList>

      <TabsContent value="daily" className="space-y-4">
        {dailyMissions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            onClaimReward={onClaimReward}
          />
        ))}
      </TabsContent>

      <TabsContent value="weekly" className="space-y-4">
        {weeklyMissions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            onClaimReward={onClaimReward}
          />
        ))}
      </TabsContent>

      <TabsContent value="monthly" className="space-y-4">
        {monthlyMissions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            onClaimReward={onClaimReward}
          />
        ))}
      </TabsContent>
    </Tabs>
  );
};
