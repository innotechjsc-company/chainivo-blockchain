"use client";

// TODO: Import InvestmentHero and UserDashboard when they are created
// import { InvestmentHero, UserDashboard } from "@/components/investments";
import {
  BlockchainStatsCard,
  CompanyInfoCard,
  InvestmentPhasesCard,
  TransactionHistoryCard,
  UserDashboardCard,
} from "./components";
import { InvestmentHero } from "./components/InvestmentHero";
import {
  useBlockchainStats,
  useInvestmentPhases,
  useTransactionHistory,
  useUserProfile,
} from "./hooks";

export default function InvestmentsScreen() {
  // 1. Fetch dữ liệu qua hooks
  const {
    stats: blockchainStats,
    loading: statsLoading,
    error: statsError,
  } = useBlockchainStats();
  const {
    phases,
    isLoading: phasesLoading,
    error: phasesError,
  } = useInvestmentPhases();
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
  } = useTransactionHistory();
  const {
    profile: userProfile,
    loading: profileLoading,
    error: profileError,
  } = useUserProfile();

  // 3. Compose UI
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Investment Hero with Charts & Metrics */}
        <InvestmentHero phases={phases} />

        {/* User Dashboard */}
        <UserDashboardCard
          profile={userProfile}
          loading={profileLoading}
          error={profileError}
        />

        {/* Investment Phases */}
        <InvestmentPhasesCard
          phases={phases}
          isLoading={phasesLoading}
          error={phasesError}
        />

        {/* Transaction History */}
        <TransactionHistoryCard
          transactions={transactions}
          loading={transactionsLoading}
          error={transactionsError}
        />

        {/* Blockchain Stats */}
        {blockchainStats && (
          <BlockchainStatsCard stats={blockchainStats} loading={statsLoading} />
        )}

        {/* Company & Token Info */}
        <CompanyInfoCard />
      </main>
    </div>
  );
}
