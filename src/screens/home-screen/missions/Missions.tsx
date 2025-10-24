"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Gift, Target, Trophy, CheckCircle2 } from "lucide-react";

const dailyMissions = [
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
];

const weeklyMissions = [
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
];

const monthlyMissions = [
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
];

const MissionCard = ({ mission }: { mission: any }) => (
  <div className="glass rounded-xl p-6 flex items-center justify-between hover:scale-105 transition-all">
    <div className="flex items-center space-x-4 flex-1">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          mission.completed ? "bg-green-500/20" : "bg-primary/20"
        }`}
      >
        {mission.completed ? (
          <CheckCircle2 className="w-6 h-6 text-green-400" />
        ) : (
          <Target className="w-6 h-6 text-primary" />
        )}
      </div>

      <div className="flex-1">
        <h4 className="font-bold text-lg mb-1">{mission.title}</h4>
        <div className="flex items-center space-x-2">
          <Gift className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary font-semibold">
            {mission.reward}
          </span>
        </div>

        {/* Progress Bar */}
        {!mission.completed && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Tiến độ</span>
              <span>{mission.progress}%</span>
            </div>
            <div className="w-full bg-muted/20 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all"
                style={{ width: `${mission.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>

    <Button
      variant={mission.completed ? "outline" : "default"}
      disabled={mission.completed}
      className="ml-4"
    >
      {mission.completed ? "Hoàn thành" : "Nhận thưởng"}
    </Button>
  </div>
);

export const Missions = () => {
  return (
    <section id="missions" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Nhiệm vụ & Phần thưởng</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hoàn thành nhiệm vụ hàng ngày để nhận coins và phần thưởng hấp dẫn
          </p>
        </div>

        {/* Rewards Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass rounded-xl p-6 text-center hover:scale-105 transition-all">
            <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
            <div className="text-3xl font-bold gradient-text mb-2">+500</div>
            <div className="text-sm text-muted-foreground">Coins hôm nay</div>
          </div>
          <div className="glass rounded-xl p-6 text-center hover:scale-105 transition-all">
            <Trophy className="w-12 h-12 text-secondary mx-auto mb-4" />
            <div className="text-3xl font-bold gradient-text mb-2">12/15</div>
            <div className="text-sm text-muted-foreground">
              Nhiệm vụ tuần này
            </div>
          </div>
          <div className="glass rounded-xl p-6 text-center hover:scale-105 transition-all">
            <Gift className="w-12 h-12 text-accent mx-auto mb-4" />
            <div className="text-3xl font-bold gradient-text mb-2">7 ngày</div>
            <div className="text-sm text-muted-foreground">Streak hiện tại</div>
          </div>
        </div>

        {/* Missions Tabs */}
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

          <TabsContent value="daily" className="space-y-4 animate-fade-in">
            {dailyMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4 animate-fade-in">
            {weeklyMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4 animate-fade-in">
            {monthlyMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </TabsContent>
        </Tabs>

        {/* Special Event */}
        <div className="mt-12 glass rounded-2xl p-8 text-center border-2 border-primary animate-glow">
          <Trophy className="w-16 h-16 text-primary mx-auto mb-4 animate-float" />
          <h3 className="text-2xl font-bold mb-2">🎉 Sự kiện đặc biệt</h3>
          <p className="text-muted-foreground mb-4">
            Hoàn thành tất cả nhiệm vụ tháng này để nhận thưởng MEGA: 50,000
            Coins + NFT độc quyền!
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-sm text-muted-foreground">Kết thúc sau:</div>
            <div className="flex space-x-2">
              <div className="bg-primary/20 px-3 py-2 rounded-lg">
                <div className="text-xl font-bold">12</div>
                <div className="text-xs text-muted-foreground">Ngày</div>
              </div>
              <div className="bg-primary/20 px-3 py-2 rounded-lg">
                <div className="text-xl font-bold">05</div>
                <div className="text-xs text-muted-foreground">Giờ</div>
              </div>
              <div className="bg-primary/20 px-3 py-2 rounded-lg">
                <div className="text-xl font-bold">32</div>
                <div className="text-xs text-muted-foreground">Phút</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
