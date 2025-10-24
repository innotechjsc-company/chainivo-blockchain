"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Partner } from "@/types/about";
import { Building2 } from "lucide-react";

interface PartnerCardProps {
  partner: Partner;
  index: number;
}

/**
 * PartnerCard component - Copy y hệt từ AboutUs.tsx gốc
 */
export const PartnerCard = ({ partner, index }: PartnerCardProps) => {
  return (
    <Card
      className="glass hover:scale-105 transition-all animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-3">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-bold text-sm mb-1">{partner.name}</h3>
        <p className="text-xs text-muted-foreground">{partner.type}</p>
      </CardContent>
    </Card>
  );
};
