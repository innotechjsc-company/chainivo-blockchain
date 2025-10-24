"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

interface SpecialEventCardProps {
  title: string;
  description: string;
  timeLeft: TimeLeft;
}

export const SpecialEventCard = ({
  title,
  description,
  timeLeft,
}: SpecialEventCardProps) => {
  return (
    <Card className="glass border-2 border-primary animate-glow">
      <CardContent className="p-8 text-center">
        <Trophy className="w-16 h-16 text-primary mx-auto mb-4 animate-float" />
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>

        <div className="flex items-center justify-center space-x-4">
          <div className="text-sm text-muted-foreground">Kết thúc sau:</div>
          <div className="flex space-x-2">
            <div className="bg-primary/20 px-3 py-2 rounded-lg">
              <div className="text-xl font-bold">{timeLeft.days}</div>
              <div className="text-xs text-muted-foreground">Ngày</div>
            </div>
            <div className="bg-primary/20 px-3 py-2 rounded-lg">
              <div className="text-xl font-bold">{timeLeft.hours}</div>
              <div className="text-xs text-muted-foreground">Giờ</div>
            </div>
            <div className="bg-primary/20 px-3 py-2 rounded-lg">
              <div className="text-xl font-bold">{timeLeft.minutes}</div>
              <div className="text-xs text-muted-foreground">Phút</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
