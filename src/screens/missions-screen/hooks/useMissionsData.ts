import { useState } from "react";

export interface Mission {
  id: number;
  title: string;
  reward: string;
  progress: number;
  completed: boolean;
}

export const useMissionsData = () => {
  const [dailyMissions] = useState<Mission[]>([
    {
      id: 1,
      title: "Đăng nhập hàng ngày",
      reward: "50 Coins",
      progress: 100,
      completed: true,
    },
    {
      id: 2,
      title: "Giao dịch NFT",
      reward: "100 Coins",
      progress: 0,
      completed: false,
    },
    {
      id: 3,
      title: "Tham gia staking",
      reward: "150 Coins",
      progress: 50,
      completed: false,
    },
    {
      id: 4,
      title: "Mời bạn bè",
      reward: "200 Coins",
      progress: 0,
      completed: false,
    },
  ]);

  const [weeklyMissions] = useState<Mission[]>([
    {
      id: 1,
      title: "Giao dịch 5 lần",
      reward: "500 Coins",
      progress: 60,
      completed: false,
    },
    {
      id: 2,
      title: "Mua 2 Mystery Box",
      reward: "300 Coins",
      progress: 50,
      completed: false,
    },
    {
      id: 3,
      title: "Đầu tư $100",
      reward: "1,000 Coins",
      progress: 0,
      completed: false,
    },
  ]);

  const [monthlyMissions] = useState<Mission[]>([
    {
      id: 1,
      title: "Đạt hạng Silver",
      reward: "2,000 Coins + NFT",
      progress: 75,
      completed: false,
    },
    {
      id: 2,
      title: "Giao dịch $1000",
      reward: "5,000 Coins",
      progress: 30,
      completed: false,
    },
    {
      id: 3,
      title: "Giới thiệu 10 người",
      reward: "10,000 Coins + Bonus",
      progress: 40,
      completed: false,
    },
  ]);

  return { dailyMissions, weeklyMissions, monthlyMissions };
};
