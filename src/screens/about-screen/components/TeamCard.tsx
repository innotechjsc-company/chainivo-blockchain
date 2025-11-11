"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Leader } from "@/types/about";
import { config } from "@/api/config";

interface TeamCardProps {
  leader: Leader;
  index: number;
}

/**
 * TeamCard component - Hien thi thong tin leader
 */
export const TeamCard = ({ leader, index }: TeamCardProps) => {
  // Tao full URL cho image
  // Neu URL da la full URL (bat dau voi http/https) thi dung truc tiep
  // Neu la relative URL (bat dau voi /) thi moi append base URL
  const imageUrl = leader.image?.url
    ? (leader.image.url.startsWith('http')
        ? leader.image.url
        : `${config.API_BASE_URL}${leader.image.url}`)
    : '/placeholder-avatar.png';

  return (
    <Card
      className="glass hover:scale-105 transition-all animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-6 text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
          <img
            src={imageUrl}
            alt={leader.image?.alt || leader.fullName}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-bold mb-1">{leader.fullName}</h3>
        <p className="text-sm text-primary mb-2">{leader.position}</p>
        <p className="text-xs text-muted-foreground">{leader.biography}</p>
      </CardContent>
    </Card>
  );
};
