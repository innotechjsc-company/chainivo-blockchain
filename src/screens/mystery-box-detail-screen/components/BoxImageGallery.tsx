"use client";

import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { MysteryBoxData } from "@/screens/mystery-box-screen/hooks/useMysteryBoxData";

interface BoxImageGalleryProps {
  box: MysteryBoxData;
}

export const BoxImageGallery = ({ box }: BoxImageGalleryProps) => {
  return (
    <Card className="glass overflow-hidden">
      <div
        className="relative aspect-square"
        style={{
          backgroundImage: `url('${box.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>

        {/* Glow Effect */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${box.tierAttributes.glowColor}, transparent)`,
          }}
        ></div>

        {/* Sparkles */}
        <div className="absolute top-8 right-8">
          <Sparkles
            className="w-12 h-12 text-yellow-400 animate-pulse"
            style={{ filter: "drop-shadow(0 0 10px rgba(250, 204, 21, 0.6))" }}
          />
        </div>

        {/* Tier Badge */}
        <div
          className="absolute bottom-8 left-8 bg-background/80 backdrop-blur-sm rounded-lg px-6 py-3"
          style={{
            borderLeft: `4px solid ${box.tierAttributes.color}`,
          }}
        >
          <div className="text-xs text-muted-foreground">Hạng</div>
          <div
            className="text-2xl font-bold"
            style={{ color: box.tierAttributes.color }}
          >
            {box.tierName}
          </div>
        </div>

        {/* Sold Out Overlay */}
        {!box.isUnlimited && box.remainingSupply === 0 && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-4xl font-bold text-red-400">ĐÃ HẾT HÀNG</div>
          </div>
        )}
      </div>
    </Card>
  );
};
