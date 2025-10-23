"use client";

import {
  TierPackagesCard,
  UserTierInfoCard,
  P2PMarketplaceCard,
  RealtimeHistoryCard,
  TransactionTrendsCard,
} from "./components";
import {
  useMembershipTiers,
  useP2PListings,
  useUserMembership,
  useRealtimeHistory,
  useTransactionTrends,
} from "./hooks";

export default function MembershipShopScreen() {
  // 1. Fetch dữ liệu qua hooks
  const { tiers } = useMembershipTiers();
  const { listings } = useP2PListings();
  const {
    profile: userProfile,
    currentTier,
    progressToNext,
    loading: profileLoading,
    error: profileError,
  } = useUserMembership();
  const {
    transactions,
    loading: historyLoading,
    error: historyError,
  } = useRealtimeHistory();
  const { trends, currentPeriod, setCurrentPeriod } = useTransactionTrends();

  // 2. Event handlers
  const handleTierPurchase = (tierId: string) => {
    // TODO: Implement tier purchase logic
    console.log("Purchase tier:", tierId);
  };

  const handleNFTPurchase = (listingId: number) => {
    // TODO: Implement NFT purchase logic
    console.log("Purchase NFT:", listingId);
  };

  // 3. Compose UI
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Nâng cấp hạng thành viên</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mua gói hạng để nhận NFT độc quyền và hưởng đặc quyền cao cấp
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left side - 8/12 */}
          <div className="lg:col-span-8 space-y-6">
            <TierPackagesCard tiers={tiers} />
            <P2PMarketplaceCard listings={listings} />
          </div>

          {/* Right side - 4/12 */}
          <div className="lg:col-span-4 space-y-6">
            <UserTierInfoCard
              profile={userProfile}
              currentTier={currentTier}
              progressToNext={progressToNext}
              loading={profileLoading}
              error={profileError}
            />
            <TransactionTrendsCard
              trends={trends}
              currentPeriod={currentPeriod}
              setCurrentPeriod={setCurrentPeriod}
            />
            <RealtimeHistoryCard
              transactions={transactions}
              loading={historyLoading}
              error={historyError}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
