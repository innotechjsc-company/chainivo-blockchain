"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Star, Zap, CheckCircle2 } from "lucide-react";

const tiers = [
  {
    name: "Bronze",
    icon: Star,
    color: "from-amber-700 to-amber-900",
    points: "1,000",
    benefits: [
      "Phí giao dịch giảm 5%",
      "Truy cập NFT cơ bản",
      "1 nhiệm vụ/ngày",
      "Hỗ trợ cơ bản",
    ],
    popular: false,
  },
  {
    name: "Silver",
    icon: Zap,
    color: "from-gray-400 to-gray-600",
    points: "5,000",
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
    name: "Gold",
    icon: Crown,
    color: "from-yellow-400 to-yellow-600",
    points: "15,000",
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
    name: "Platinum",
    icon: Crown,
    color: "from-cyan-400 to-purple-600",
    points: "50,000",
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

export const MembershipTiers = () => {
  return (
    <section id="membership" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Hạng thành viên</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nâng cấp hạng của bạn để nhận nhiều quyền lợi và ưu đãi hơn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <Card
                key={tier.name}
                className={`glass rounded-2xl p-6 relative overflow-hidden transition-all hover:scale-105 ${
                  tier.popular ? "border-2 border-primary animate-glow" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  {/* Popular Badge */}
                  {tier.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-secondary text-foreground px-4 py-1 rounded-bl-xl text-xs font-bold">
                      PHỔ BIẾN
                    </div>
                  )}

                  {/* Tier Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4 animate-float`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Tier Name */}
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>

                  {/* Points Required */}
                  <div className="mb-6">
                    <div className="text-3xl font-bold gradient-text">
                      {tier.points}
                    </div>
                    <div className="text-sm text-muted-foreground">Points</div>
                  </div>

                  {/* Benefits List */}
                  <div className="space-y-3 mb-6">
                    {tier.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground/90">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full"
                    variant={tier.popular ? "default" : "outline"}
                  >
                    Mua ngay
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Point Info */}
        <div className="mt-12 glass rounded-2xl p-8 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">💎 Cách tích điểm Point</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">+100</div>
              <div className="text-sm text-muted-foreground">
                Hoàn thành nhiệm vụ
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">+50</div>
              <div className="text-sm text-muted-foreground">Giao dịch NFT</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">+200</div>
              <div className="text-sm text-muted-foreground">
                Giới thiệu bạn bè
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
