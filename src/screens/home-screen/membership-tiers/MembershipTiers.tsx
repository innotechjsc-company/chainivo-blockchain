"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, RefreshCw, AlertCircle, Lock } from "lucide-react";
import { ToastService } from "@/services";
import { useAuthValidation } from "@/hooks";
import { ConnectWalletDialog } from "@/components/wallet";
import { useRankData } from "./hooks/useRankData";
import { useBuyRank } from "./hooks/useBuyRank";
import {
  isRankEligible,
  getRankIneligibilityReason,
} from "./utils/rankEligibility";
import type { RootState } from "@/stores/store";

export const MembershipTiers = () => {
  // Fetch rank data
  const { tiers, loading, error, refetch } = useRankData();

  // Buy rank handler (fix: khong destructuring loading vi UseBuyRankReturn khong co loading)
  // Buy rank handler
  const { handleBuyRank, loadingRankId } = useBuyRank(() => {
    // Callback khi mua thanh cong: refetch data
    refetch();
  });

  // Use centralized auth validation hook
  const { user: currentUser, checkAuthAndWallet } = useAuthValidation();

  // Connect wallet modal states
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedRank, setSelectedRank] = useState<{
    id: string;
    price: number;
  } | null>(null);

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
              const ineligibilityReason = getRankIneligibilityReason(
                tier.level,
                currentUserRankLevel
              );

              // Check xem có phải rank hiện tại không
              const isCurrentRank =
                currentUserRankLevel && tier.level === currentUserRankLevel;
              const isLowerRank =
                currentUserRankLevel &&
                parseInt(tier.level) < parseInt(currentUserRankLevel);

              return (
                <Card
                  key={tier.id}
                  className={`glass rounded-2xl p-6 relative overflow-hidden transition-all hover:scale-105 h-full flex flex-col ${
                    tier.popular ? "border-2 border-primary animate-glow" : ""
                  } ${
                    isCurrentRank ? "border-2 border-primary animate-glow" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-0 flex flex-col h-full">
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
                      <div className="text-sm text-muted-foreground">
                        Points
                      </div>
                    </div>

                    {/* Benefits List */}
                    {/* Benefits List */}
                    <div className="mb-6 min-h-[180px] max-h-[180px] overflow-y-auto bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="space-y-3">
                        {tier.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-foreground/90 text-sm">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      className={`w-full mt-auto font-bold shadow-lg transition-all duration-300 
                          bg-gradient-to-r from-primary to-secondary text-foreground hover:from-primary/90 hover:to-secondary/90 hover:scale-105 disabled:opacity-70`}
                      variant={isCurrentRank ? "default" : "default"}
                      onClick={() => {
                        if (!isCurrentRank && eligible) {
                          // Check auth and wallet status
                          const status = checkAuthAndWallet();

                          if (status === "login_required") {
                            ToastService.error(
                              "Vui lòng đăng nhập để mua hạng"
                            );
                            return;
                          }

                          if (status === "wallet_required") {
                            // Save selected rank and show connect modal
                            setSelectedRank({ id: tier.id, price: tier.price });
                            setShowConnectModal(true);
                            return;
                          }

                          // Status is "ok" - proceed with purchase
                          handleBuyRank(tier.id, tier.price);
                        }
                      }}
                      disabled={
                        isCurrentRank || !eligible || loading || !!loadingRankId
                      }
                    >
                      {loadingRankId === tier.id
                        ? "Đang xử lý..."
                        : isCurrentRank
                        ? "Đang sở hữu"
                        : !eligible
                        ? ineligibilityReason
                        : "Mua ngay"}
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

      {/* Connect Wallet Modal */}
      <ConnectWalletDialog
        open={showConnectModal}
        onOpenChange={setShowConnectModal}
        title="Kết nối ví để mua hạng"
        description="Vui lòng kết nối ví MetaMask để tiếp tục mua hạng thành viên."
        onSuccess={() => {
          // After successful wallet connection, proceed with purchase
          if (selectedRank) {
            handleBuyRank(selectedRank.id, selectedRank.price);
          }
        }}
      />

      {/* Full Screen Loading Overlay */}
      {loadingRankId && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
          <div className="text-center p-8 glass rounded-2xl shadow-2xl border border-primary/20 max-w-sm mx-4">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <RefreshCw className="absolute inset-0 w-8 h-8 m-auto text-primary animate-pulse" />
            </div>
            <h3 className="text-xl font-bold mb-2">Đang xử lý giao dịch</h3>
            <p className="text-muted-foreground">
              Vui lòng xác nhận trên ví của bạn và đợi trong giây lát...
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
