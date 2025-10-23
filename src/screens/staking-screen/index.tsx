"use client";
import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { useStakingData } from "./hooks/useStakingData";
import { useStakingActions } from "./hooks/useStakingActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, Package, Sparkles } from "lucide-react";
import "./staking-screen.css";

// Components
import { StakingStats } from "./components/StakingStats";
import { CoinStakingForm } from "./components/CoinStakingForm";
import { NFTStakingForm } from "./components/NFTStakingForm";
import { ActiveStakesList } from "./components/ActiveStakesList";
import { StakingInfo } from "./components/StakingInfo";
import { LoadingSkeleton } from "./components/LoadingSkeleton";

/**
 * StakingScreen - Màn hình quản lý staking CAN token và NFT
 *
 * Tính năng:
 * - Stake CAN token với APY 10%
 * - Stake NFT với APY 15%
 * - Xem thống kê staking
 * - Nhận thưởng bất cứ lúc nào
 * - Huỷ staking và nhận lại tài sản
 */
export const StakingScreen = () => {
  const { user, isAuthenticated } = useUserStore();

  // Custom hooks
  const {
    coinStakes,
    nftStakes,
    stakingStats,
    availableNFTs,
    stakingConfig,
    loading: dataLoading,
    error: dataError,
    refreshData,
    addCoinStake,
    addNFTStake,
    updateCoinStake,
    updateNFTStake,
    calculateRewards,
    calculateDaysPassed,
  } = useStakingData();

  const {
    loading: actionLoading,
    error: actionError,
    stakeCoin,
    stakeNFT,
    claimRewards,
    cancelStake,
  } = useStakingActions();

  // Mock user balance - TODO: Get from user store or API
  const userBalance = 10000; // Mock balance

  // Handle coin staking
  const handleCoinStake = async (request: any) => {
    try {
      const newStake = await stakeCoin(request);
      addCoinStake(newStake);
      // Không cần refreshData vì đã add vào state
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Handle NFT staking
  const handleNFTStake = async (request: any) => {
    try {
      const newStake = await stakeNFT(request);
      addNFTStake(newStake);
      // Không cần refreshData vì đã add vào state
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Handle claim rewards
  const handleClaim = async (stakeId: string, type: "coin" | "nft") => {
    try {
      await claimRewards({ stakeId, type });
      // Update local state thay vì refresh toàn bộ
      if (type === "coin") {
        updateCoinStake(stakeId, {
          stakedAt: new Date().toISOString(),
          rewards: 0,
        });
      } else {
        updateNFTStake(stakeId, {
          stakedAt: new Date().toISOString(),
          rewards: 0,
        });
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Handle cancel stake
  const handleCancel = async (stakeId: string, type: "coin" | "nft") => {
    try {
      await cancelStake({ stakeId, type });
      // Update local state thay vì refresh toàn bộ
      if (type === "coin") {
        updateCoinStake(stakeId, { status: "cancelled" });
      } else {
        updateNFTStake(stakeId, { status: "cancelled" });
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // TODO: Redirect to auth page
      console.log("User not authenticated, redirecting to auth...");
    }
  }, [isAuthenticated]);

  // Loading state - chỉ hiển thị khi đang fetch data lần đầu và chưa có data
  if (dataLoading && !stakingStats && !dataError) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (dataError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Lỗi tải dữ liệu
            </h2>
            <p className="text-muted-foreground">{dataError}</p>
          </div>
          <button
            onClick={refreshData}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Main content - hiển thị ngay cả khi đang loading actions
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">
                Staking Rewards Program
              </span>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Stake & Earn
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stake CAN token hoặc NFT để nhận phần thưởng liên tục. Nhận thưởng
            bất cứ lúc nào!
          </p>
        </div>

        {/* Stats Overview - chỉ hiển thị khi có data */}
        {stakingStats && <StakingStats stats={stakingStats} />}

        {/* Action Loading Indicator */}
        {actionLoading && (
          <div className="fixed top-4 right-4 z-50">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg backdrop-blur-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm font-medium text-primary">
                Đang xử lý...
              </span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="coin" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
            <TabsTrigger value="coin" className="text-lg">
              <Coins className="h-5 w-5 mr-2" />
              Staking CAN
            </TabsTrigger>
            <TabsTrigger value="nft" className="text-lg">
              <Package className="h-5 w-5 mr-2" />
              Staking NFT
            </TabsTrigger>
          </TabsList>

          {/* CAN Staking */}
          <TabsContent value="coin" className="space-y-6 animate-fade-in">
            <div className="staking-grid">
              <CoinStakingForm
                userBalance={userBalance}
                onStake={handleCoinStake}
                loading={actionLoading}
                apy={stakingConfig?.coinAPY}
              />

              <ActiveStakesList
                coinStakes={coinStakes}
                nftStakes={[]}
                onClaim={handleClaim}
                onCancel={handleCancel}
                calculateRewards={calculateRewards}
                calculateDaysPassed={calculateDaysPassed}
              />
            </div>
          </TabsContent>

          {/* NFT Staking */}
          <TabsContent value="nft" className="space-y-6 animate-fade-in">
            <div className="staking-grid">
              <NFTStakingForm
                availableNFTs={availableNFTs}
                onStake={handleNFTStake}
                loading={actionLoading}
                apy={stakingConfig?.nftAPY}
              />

              <ActiveStakesList
                coinStakes={[]}
                nftStakes={nftStakes}
                onClaim={handleClaim}
                onCancel={handleCancel}
                calculateRewards={calculateRewards}
                calculateDaysPassed={calculateDaysPassed}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Info Section */}
        <StakingInfo />
      </main>
    </div>
  );
};
