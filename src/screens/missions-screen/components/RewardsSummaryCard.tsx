"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Trophy, Gift } from "lucide-react";

interface MissionsStats {
  todayCoins: string;
  weeklyProgress: string;
  currentStreak: string;
}

interface RewardsSummaryCardProps {
  stats: MissionsStats;
}

export const RewardsSummaryCard = ({ stats }: RewardsSummaryCardProps) => {
  const summaryItems = [
    {
      icon: Calendar,
      value: stats.todayCoins,
      label: "Coins hôm nay",
      color: "text-primary",
    },
    {
      icon: Trophy,
      value: stats.weeklyProgress,
      label: "Nhiệm vụ tuần này",
      color: "text-secondary",
    },
    {
      icon: Gift,
      value: stats.currentStreak,
      label: "Streak hiện tại",
      color: "text-accent",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {summaryItems.map((item, index) => (
        <Card
          key={item.label}
          className="glass hover:scale-105 transition-all"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardContent className="p-6 text-center">
            <item.icon className={`w-12 h-12 ${item.color} mx-auto mb-4`} />
            <div className="text-3xl font-bold gradient-text mb-2">
              {item.value}
            </div>
            <div className="text-sm text-muted-foreground">{item.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
