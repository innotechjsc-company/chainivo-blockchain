"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Gift, Target, CheckCircle2 } from "lucide-react";
import { Mission } from "../hooks";

interface MissionCardProps {
  mission: Mission;
  onClaimReward?: (missionId: number) => void;
}

export const MissionCard = ({ mission, onClaimReward }: MissionCardProps) => {
  const handleClaimReward = () => {
    if (onClaimReward) {
      onClaimReward(mission.id);
    }
  };

  return (
    <Card className="glass hover:scale-105 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
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
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Tiến độ</span>
                    <span>{mission.progress}%</span>
                  </div>
                  <Progress value={mission.progress} className="h-2" />
                </div>
              )}
            </div>
          </div>

          <Button
            variant={mission.completed ? "outline" : "default"}
            disabled={mission.completed}
            className="ml-4"
            onClick={handleClaimReward}
          >
            {mission.completed ? "Hoàn thành" : "Nhận thưởng"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
