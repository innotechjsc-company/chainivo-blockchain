"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Gift, Target, CheckCircle2, Download } from "lucide-react";
import { Mission } from "../hooks";

interface MissionsTabsCardProps {
  dailyMissions: Mission[];
  weeklyMissions: Mission[];
  monthlyMissions: Mission[];
  onClaimReward?: (missionId: number) => void;
  downloadUrl?: string; // URL to navigate when download button is clicked
}

export const MissionsTabsCard = ({
  dailyMissions,
  weeklyMissions,
  monthlyMissions,
  onClaimReward,
  downloadUrl = "/download", // Default URL, can be overridden via props
}: MissionsTabsCardProps) => {
  const router = useRouter();

  const allMissions = useMemo(() => {
    return [
      ...dailyMissions.map((m) => ({ ...m, type: "Hàng ngày" as const })),
      ...weeklyMissions.map((m) => ({ ...m, type: "Hàng tuần" as const })),
      ...monthlyMissions.map((m) => ({ ...m, type: "Hàng tháng" as const })),
    ];
  }, [dailyMissions, weeklyMissions, monthlyMissions]);

  const handleClaimReward = (missionId: number) => {
    if (onClaimReward) {
      onClaimReward(missionId);
    }
  };

  const handleDownloadApp = () => {
    router.push(downloadUrl);
  };

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
    <Card className="glass">
      <CardContent className="p-6">
        {/* Download App Button */}
        <div className="mb-6 flex justify-end">
          <Button
            onClick={handleDownloadApp}
            variant="default"
            className="gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 " />
            Tải app để tham gia
          </Button>
        </div>

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
                      className={`${getTypeBadgeColor(mission.type)} border-0`}
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
                        <Progress value={mission.progress} className="h-2" />
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
  );
};
