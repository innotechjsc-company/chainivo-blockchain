"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Leader } from "@/types/about";

interface TeamCardProps {
  leader: Leader;
  index: number;
}

/**
 * TeamCard component - Copy y hệt từ AboutUs.tsx gốc
 */
export const TeamCard = ({ leader, index }: TeamCardProps) => {
  return (
    <Card
      className="glass hover:scale-105 transition-all animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-6 text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
          <img
            src={leader.avatar}
            alt={leader.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-bold mb-1">{leader.name}</h3>
        <p className="text-sm text-primary mb-2">{leader.position}</p>
        <p className="text-xs text-muted-foreground">{leader.description}</p>
      </CardContent>
    </Card>
  );
};
