"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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

export const Missions = () => {
  const allMissions = useMemo(() => {
    return [
      ...dailyMissions.map((m) => ({ ...m, type: "Hàng ngày" as const })),
      ...weeklyMissions.map((m) => ({ ...m, type: "Hàng tuần" as const })),
      ...monthlyMissions.map((m) => ({ ...m, type: "Hàng tháng" as const })),
    ];
  }, []);

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "Hàng ngày":
        return "bg-blue-500/20 text-blue-300";
      case "Hàng tuần":
        return "bg-purple-500/20 text-purple-300";
      case "Hàng tháng":
        return "bg-pink-500/20 text-pink-300";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };
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

        {/* Missions Table */}
        <Card className="glass">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="w-[120px]">Loại</TableHead>
                    <TableHead className="min-w-[200px]">Nhiệm vụ</TableHead>
                    <TableHead className="w-[150px]">Phần thưởng</TableHead>
                    <TableHead className="w-[200px]">Tiến độ</TableHead>
                    <TableHead className="w-[120px]">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allMissions.map((mission) => (
                    <TableRow
                      key={`${mission.type}-${mission.id}`}
                      className="border-border/50"
                    >
                      <TableCell>
                        <Badge
                          className={`${getTypeBadgeColor(
                            mission.type
                          )} border-0`}
                          variant="outline"
                        >
                          {mission.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              mission.completed
                                ? "bg-green-500/20"
                                : "bg-primary/20"
                            }`}
                          >
                            {mission.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                              <Target className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <span className="font-semibold">{mission.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-primary" />
                          <span className="text-sm text-primary font-semibold">
                            {mission.reward}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {mission.completed ? (
                          <span className="text-sm text-green-400 font-semibold">
                            Hoàn thành
                          </span>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Tiến độ</span>
                              <span>{mission.progress}%</span>
                            </div>
                            <Progress
                              value={mission.progress}
                              className="h-2"
                            />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {mission.completed ? (
                          <Badge
                            className="bg-green-500/20 text-green-300 border-0"
                            variant="outline"
                          >
                            Hoàn thành
                          </Badge>
                        ) : (
                          <Badge
                            className="bg-yellow-500/20 text-yellow-300 border-0"
                            variant="outline"
                          >
                            Đang thực hiện
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

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
