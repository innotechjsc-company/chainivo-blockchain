"use client";
import { Card } from "@/components/ui/card";
import { StatsCard as StatsCardType } from "@/types/about";
import { Users, TrendingUp, Globe } from "lucide-react";

interface StatsCardProps {
  stats: StatsCardType;
}

/**
 * StatsCard component - Copy y hệt từ AboutUs.tsx gốc
 */
export const StatsCard = ({ stats }: StatsCardProps) => {
  const getColorClass = (color: string) => {
    switch (color) {
      case "primary":
        return "text-primary";
      case "secondary":
        return "text-secondary";
      case "accent":
        return "text-accent";
      default:
        return "text-primary";
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Users":
        return <Users className="w-5 h-5" />;
      case "TrendingUp":
        return <TrendingUp className="w-5 h-5" />;
      case "Globe":
        return <Globe className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  return (
    <Card className="glass p-4">
      <div className="flex items-center gap-2">
        <div className={getColorClass(stats.color)}>{getIcon(stats.icon)}</div>
        <div className="text-left">
          <div className="text-2xl font-bold">{stats.value}</div>
          <div className="text-xs text-muted-foreground">{stats.label}</div>
        </div>
      </div>
    </Card>
  );
};
