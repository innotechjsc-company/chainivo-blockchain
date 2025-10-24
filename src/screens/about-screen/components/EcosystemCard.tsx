"use client";
import { Card, CardContent } from "@/components/ui/card";
import { EcosystemItem } from "@/types/about";
import { Zap, Shield, TrendingUp, Globe } from "lucide-react";

interface EcosystemCardProps {
  item: EcosystemItem;
  index: number;
}

/**
 * EcosystemCard component - Copy y hệt từ AboutUs.tsx gốc
 */
export const EcosystemCard = ({ item, index }: EcosystemCardProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Zap":
        return <Zap className="w-8 h-8" />;
      case "Shield":
        return <Shield className="w-8 h-8" />;
      case "TrendingUp":
        return <TrendingUp className="w-8 h-8" />;
      case "Globe":
        return <Globe className="w-8 h-8" />;
      default:
        return <Zap className="w-8 h-8" />;
    }
  };

  return (
    <Card
      className="glass border-primary/30 hover:scale-105 transition-all animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 text-white">
          {getIcon(item.icon)}
        </div>
        <h3 className="font-bold mb-2">{item.title}</h3>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </CardContent>
    </Card>
  );
};
