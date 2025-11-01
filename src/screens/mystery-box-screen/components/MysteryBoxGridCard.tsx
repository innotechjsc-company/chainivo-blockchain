"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MysteryBoxCard } from "./MysteryBoxCard";
import { MysteryBoxData } from "../hooks";

interface MysteryBoxGridCardProps {
  boxes: MysteryBoxData[];
  title?: string;
  onPurchase?: (boxId: string) => void;
}

export const MysteryBoxGridCard = ({
  boxes,
  title = "Hộp Bí Ẩn",
  onPurchase,
}: MysteryBoxGridCardProps) => {
  if (boxes.length === 0) {
    return null;
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boxes.map((box) => (
            <MysteryBoxCard key={box.id} box={box} onPurchase={onPurchase} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
