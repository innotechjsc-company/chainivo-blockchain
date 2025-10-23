import { useState } from "react";

interface MissionsStats {
  todayCoins: string;
  weeklyProgress: string;
  currentStreak: string;
}

export const useMissionsStats = () => {
  const [stats] = useState<MissionsStats>({
    todayCoins: "+500",
    weeklyProgress: "12/15",
    currentStreak: "7 ngày",
  });

  return { stats };
};
