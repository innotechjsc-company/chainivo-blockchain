"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Zap, CheckCircle2, Users } from "lucide-react";

interface TierPackage {
  id: string;
  name: string;
  icon: string;
  color: string;
  price: string;
  usdPrice: string;
  buyers: number;
  nftDropRate: Array<{
    rarity: string;
    rate: string;
  }>;
  benefits: string[];
  popular: boolean;
}

interface TierPackagesCardProps {
  tiers: TierPackage[];
}

export const TierPackagesCard = ({ tiers }: TierPackagesCardProps) => {
  const router = useRouter();

  const getTierImage = (tierName: string) => {
    const name = tierName.toLowerCase();
    if (name.includes("bronze")) return "/tier-bronze.jpg";
    if (name.includes("silver")) return "/tier-silver.jpg";
    if (name.includes("gold")) return "/tier-gold.jpg";
    if (name.includes("platinum")) return "/tier-platinum.jpg";
    return "/tier-bronze.jpg"; // fallback
  };

  const handlePurchase = (e: React.MouseEvent, tierId: string) => {
    e.stopPropagation();
    // TODO: Implement purchase logic
    console.log("Purchase tier:", tierId);
  };

  const renderTierCard = (tier: TierPackage, isFeatured = false) => {
    const tierImage = getTierImage(tier.name);

    return (
      <Card
        key={tier.name}
        className={`glass relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer ${
          isFeatured ? "border-2 border-primary" : "border-border/50"
        }`}
        onClick={() => router.push(`/tier/${tier.id}`)}
      >
        {isFeatured && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-secondary text-foreground px-3 py-1 rounded-bl-lg text-[10px] font-bold flex items-center gap-1 z-10">
            <Crown className="w-3 h-3" />
            PHỔ BIẾN NHẤT
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex gap-3">
            <div
              className={`w-16 h-16 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center flex-shrink-0 relative overflow-hidden`}
              style={{
                backgroundImage: `url('${tierImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Overlay for better icon visibility */}
              {/* <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Crown className="w-8 h-8 text-white drop-shadow-lg" />
              </div> */}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle
                className={`${
                  isFeatured ? "text-xl" : "text-lg"
                } font-bold mb-1 truncate`}
              >
                {tier.name}
              </CardTitle>
              <div
                className={`${
                  isFeatured ? "text-2xl" : "text-xl"
                } font-bold gradient-text truncate`}
              >
                {tier.price}
              </div>
              <div
                className={`${
                  isFeatured ? "text-sm" : "text-xs"
                } text-muted-foreground truncate`}
              >
                {tier.usdPrice}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* NFT Drop Rates */}
          <div className="bg-muted/20 rounded-lg p-3">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              Tỉ lệ rơi NFT:
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {tier.nftDropRate.map((drop) => (
                <div key={drop.rarity} className="text-center">
                  <div className="text-foreground/70 truncate">
                    {drop.rarity}
                  </div>
                  <div className="font-semibold text-primary truncate">
                    {drop.rate}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            {tier.benefits.slice(0, isFeatured ? 4 : 3).map((benefit, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground/90 leading-tight">
                  {benefit}
                </span>
              </div>
            ))}
            {tier.benefits.length > (isFeatured ? 4 : 3) && (
              <div className="text-xs text-muted-foreground text-center mt-2">
                +{tier.benefits.length - (isFeatured ? 4 : 3)} quyền lợi khác
              </div>
            )}
          </div>

          {/* Buyers count */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{tier.buyers.toLocaleString()} người mua</span>
          </div>

          {/* Button */}
          <Button
            className="w-full"
            variant={isFeatured ? "default" : "outline"}
            onClick={(e) => handlePurchase(e, tier.id)}
          >
            Mua ngay
          </Button>
        </CardContent>
      </Card>
    );
  };

  // Find most popular tier
  const mostPopularTier = [...tiers].sort((a, b) => b.buyers - a.buyers)[0];
  const otherTiers = tiers.filter((t) => t.id !== mostPopularTier.id);

  return (
    <div className="space-y-6">
      {/* Featured Popular Tier */}
      <div>{renderTierCard(mostPopularTier, true)}</div>

      {/* Other Tiers */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
          Các hạng khác
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherTiers.map((tier, index) => (
            <div key={tier.id} style={{ animationDelay: `${index * 0.1}s` }}>
              {renderTierCard(tier, false)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
