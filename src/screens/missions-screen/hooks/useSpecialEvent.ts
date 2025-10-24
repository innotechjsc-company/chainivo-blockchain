import { useState, useEffect } from "react";

interface SpecialEvent {
  title: string;
  description: string;
  reward: string;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
  };
}

export const useSpecialEvent = () => {
  const [event] = useState<SpecialEvent>({
    title: "🎉 Sự kiện đặc biệt",
    description:
      "Hoàn thành tất cả nhiệm vụ tháng này để nhận thưởng MEGA: 50,000 Coins + NFT độc quyền!",
    reward: "50,000 Coins + NFT độc quyền",
    timeLeft: {
      days: 12,
      hours: 5,
      minutes: 32,
    },
  });

  const [timeLeft, setTimeLeft] = useState(event.timeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes } = prev;

        if (minutes > 0) {
          minutes--;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
        }

        return { days, hours, minutes };
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return { event, timeLeft };
};
