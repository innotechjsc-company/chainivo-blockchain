"use client";

import { useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, RefreshCw, AlertCircle, Lock } from "lucide-react";
import { useRankData } from "./hooks/useRankData";
import { useBuyRank } from "./hooks/useBuyRank";
import { isRankEligible, getRankIneligibilityReason } from './utils/rankEligibility';
import type { RootState } from '@/stores/store';

export const MembershipTiers = () => {
  // Fetch rank data
  const { tiers, loading, error, refetch } = useRankData();

  // Buy rank handler
  const { handleBuyRank, loading: buyLoading } = useBuyRank(() => {
    // Callback khi mua thành công: refetch data
    refetch();
  });

  // Lấy current user từ Redux
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Lấy level của rank hiện tại
  const currentUserRankLevel = currentUser?.rank?.level;
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

        {/* Error State */}
        {error && (
          <div className="glass rounded-2xl p-8 text-center max-w-2xl mx-auto mb-8">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="bg-gradient-to-r from-primary to-secondary text-foreground" />
              Thử lại
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="glass rounded-2xl p-6">
                <CardContent className="p-0 animate-pulse">
                  <div className="w-16 h-16 bg-muted rounded-2xl mb-4"></div>
                  <div className="h-8 bg-muted rounded mb-2"></div>
                  <div className="h-12 bg-muted rounded mb-6"></div>
                  <div className="space-y-3 mb-6">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </div>
                  <div className="h-10 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Data State */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => {
            const Icon = tier.icon;

            // Check eligibility
            const eligible = isRankEligible(tier.level, currentUserRankLevel);
            const ineligibilityReason = getRankIneligibilityReason(tier.level, currentUserRankLevel);

            // Check xem có phải rank hiện tại không
            const isCurrentRank = currentUserRankLevel && tier.level === currentUserRankLevel;
            const isLowerRank = currentUserRankLevel && parseInt(tier.level) < parseInt(currentUserRankLevel);

            return (
              <Card
                key={tier.id}
                className={`glass rounded-2xl p-6 relative overflow-hidden transition-all hover:scale-105 ${
                  tier.popular ? "border-2 border-primary animate-glow" : ""
                } ${isCurrentRank ? "border-2 border-primary animate-glow" : ""}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  {/* Overlay chỉ cho ranks THẤP HƠN (không áp dụng cho rank hiện tại) */}
                  {isLowerRank && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm z-10 rounded-2xl flex items-center justify-center border border-primary/30">
                      <div className="text-center p-4">
                        <Lock className="w-12 h-12 mx-auto mb-2 text-foreground/90" />
                        <p className="text-sm font-semibold text-foreground">
                          {ineligibilityReason}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Current Rank Badge hoặc Popular Badge */}
                  {isCurrentRank ? (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-secondary text-foreground px-4 py-1 rounded-bl-xl text-xs font-bold z-20">
                      <span>👑</span>
                      <span>HẠNG HIỆN TẠI</span>
                    </div>
                  ) : tier.popular ? (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-secondary text-foreground px-4 py-1 rounded-bl-xl text-xs font-bold z-20">
                      PHỔ BIẾN
                    </div>
                  ) : null}

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
                        <span className="text-foreground/90">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button
                    className={`w-full ${
                      !isCurrentRank && eligible && !buyLoading
                        ? "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-foreground font-semibold transition-all duration-300 hover:scale-105"
                        : ""
                    }`}
                    variant={tier.popular ? "default" : "outline"}
                    onClick={() => !isCurrentRank && eligible && handleBuyRank(tier.id, tier.price)}
                    disabled={isCurrentRank || !eligible || buyLoading}
                  >
                    {buyLoading
                      ? "Đang xử lý..."
                      : isCurrentRank
                        ? "Đang sở hữu"
                        : !eligible
                          ? ineligibilityReason
                          : "Mua ngay"
                    }
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        )}

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
