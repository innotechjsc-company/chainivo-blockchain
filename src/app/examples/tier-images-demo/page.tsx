"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Zap, CheckCircle2, Users, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const tierPackages = [
  {
    id: "bronze",
    name: "Bronze",
    icon: "Star",
    color: "from-amber-700 to-amber-900",
    price: "50 CAN",
    usdPrice: "$10",
    buyers: 1247,
    nftDropRate: [
      { rarity: "Common", rate: "70%" },
      { rarity: "Rare", rate: "25%" },
      { rarity: "Epic", rate: "5%" },
    ],
    benefits: [
      "Phí giao dịch giảm 5%",
      "Truy cập NFT cơ bản",
      "1 nhiệm vụ/ngày",
      "Hỗ trợ cơ bản",
    ],
    popular: false,
  },
  {
    id: "silver",
    name: "Silver",
    icon: "Zap",
    color: "from-gray-400 to-gray-600",
    price: "250 CAN",
    usdPrice: "$50",
    buyers: 856,
    nftDropRate: [
      { rarity: "Rare", rate: "50%" },
      { rarity: "Epic", rate: "40%" },
      { rarity: "Legendary", rate: "10%" },
    ],
    benefits: [
      "Phí giao dịch giảm 10%",
      "Truy cập NFT cao cấp",
      "3 nhiệm vụ/ngày",
      "Bonus staking +5%",
      "Hỗ trợ ưu tiên",
    ],
    popular: false,
  },
  {
    id: "gold",
    name: "Gold",
    icon: "Crown",
    color: "from-yellow-400 to-yellow-600",
    price: "750 CAN",
    usdPrice: "$150",
    buyers: 423,
    nftDropRate: [
      { rarity: "Epic", rate: "50%" },
      { rarity: "Legendary", rate: "40%" },
      { rarity: "Mythic", rate: "10%" },
    ],
    benefits: [
      "Phí giao dịch giảm 15%",
      "Truy cập toàn bộ NFT",
      "5 nhiệm vụ/ngày",
      "Bonus staking +10%",
      "Airdrop độc quyền",
      "Hỗ trợ VIP 24/7",
    ],
    popular: true,
  },
  {
    id: "platinum",
    name: "Platinum",
    icon: "Crown",
    color: "from-cyan-400 to-purple-600",
    price: "2500 CAN",
    usdPrice: "$500",
    buyers: 127,
    nftDropRate: [
      { rarity: "Legendary", rate: "60%" },
      { rarity: "Mythic", rate: "30%" },
      { rarity: "Divine", rate: "10%" },
    ],
    benefits: [
      "Phí giao dịch MIỄN PHÍ",
      "NFT độc quyền",
      "Nhiệm vụ không giới hạn",
      "Bonus staking +20%",
      "Airdrop VIP",
      "Quản lý tài khoản riêng",
      "Sự kiện đặc biệt",
    ],
    popular: false,
  },
];

export default function TierImagesDemoPage() {
  const router = useRouter();

  const getTierImage = (tierName: string) => {
    const name = tierName.toLowerCase();
    if (name.includes("bronze")) return "/tier-bronze.jpg";
    if (name.includes("silver")) return "/tier-silver.jpg";
    if (name.includes("gold")) return "/tier-gold.jpg";
    if (name.includes("platinum")) return "/tier-platinum.jpg";
    return "/tier-bronze.jpg"; // fallback
  };

  const renderTierCard = (
    tier: (typeof tierPackages)[0],
    isFeatured = false
  ) => {
    const tierImage = getTierImage(tier.name);

    return (
      <Card
        key={tier.name}
        className={`glass relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer ${
          isFeatured ? "border-2 border-primary" : "border-border/50"
        }`}
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
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Crown className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
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
          >
            Mua ngay
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-12">
        <Button
          variant="ghost"
          onClick={() => router.push("/examples")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Tier Images Demo</span>
            </h1>
            <p className="text-muted-foreground">
              Sử dụng tier images thay vì icons cho membership tiers
            </p>
          </div>

          {/* Tier Packages with Images */}
          <div className="space-y-6">
            {/* Featured Popular Tier */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Featured Tier</h3>
              {renderTierCard(
                tierPackages.find((t) => t.popular) || tierPackages[2],
                true
              )}
            </div>

            {/* All Tiers */}
            <div>
              <h3 className="text-2xl font-bold mb-4">All Tiers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tierPackages.map((tier, index) => (
                  <div
                    key={tier.id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {renderTierCard(tier, false)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tier Images Showcase */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Tier Images Showcase
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tierPackages.map((tier) => (
                <Card key={tier.id} className="glass">
                  <CardContent className="p-4 text-center">
                    <div
                      className="w-20 h-20 mx-auto rounded-lg mb-3 relative overflow-hidden"
                      style={{
                        backgroundImage: `url('${getTierImage(tier.name)}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Crown className="w-6 h-6 text-white drop-shadow-lg" />
                      </div>
                    </div>
                    <h4 className="font-semibold">{tier.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {tier.price}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Usage Examples */}
          <Card className="glass mt-8">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-4">
                Cách sử dụng Tier Images
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    1. Tier Image Mapping Function
                  </h4>
                  <code className="text-xs bg-muted p-2 rounded block">
                    {`const getTierImage = (tierName: string) => {
  const name = tierName.toLowerCase();
  if (name.includes('bronze')) return '/tier-bronze.jpg';
  if (name.includes('silver')) return '/tier-silver.jpg';
  if (name.includes('gold')) return '/tier-gold.jpg';
  if (name.includes('platinum')) return '/tier-platinum.jpg';
  return '/tier-bronze.jpg'; // fallback
};`}
                  </code>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    2. Background Image Implementation
                  </h4>
                  <code className="text-xs bg-muted p-2 rounded block">
                    {`<div
  className="w-16 h-16 rounded-lg relative overflow-hidden"
  style={{
    backgroundImage: \`url('\${tierImage}')\`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>
  <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60"></div>
  <div className="absolute inset-0 flex items-center justify-center">
    <Crown className="w-8 h-8 text-white drop-shadow-lg" />
  </div>
</div>`}
                  </code>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    3. Available Tier Images
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• /tier-bronze.jpg - Bronze tier image</li>
                    <li>• /tier-silver.jpg - Silver tier image</li>
                    <li>• /tier-gold.jpg - Gold tier image</li>
                    <li>• /tier-platinum.jpg - Platinum tier image</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
