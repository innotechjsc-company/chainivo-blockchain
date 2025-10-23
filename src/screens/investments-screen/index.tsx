"use client";

import { InvestmentHero } from "@/components/investments/investmentHero/investmentHero";
import { UserDashboard } from "@/components/investments/UserDashboard/UserDashboard";
import { InvestmentPhases } from "./InvestmentPhases";
import { TransactionHistory } from "./TransactionHistory";
import { BlockchainStats } from "./BlockchainStats/BlockchainStats";
import { CompanyInfo } from "./CompanyInfo";

export default function InvestmentsScreen() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Investment Hero with Charts & Metrics */}
        <InvestmentHero />

        {/* User Dashboard */}
        <UserDashboard />

        {/* Investment Phases */}
        <InvestmentPhases />

        {/* Transaction History */}
        <section className="py-12 bg-gradient-to-br from-background to-background/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <TransactionHistory />
            </div>
          </div>
        </section>

        {/* Blockchain Stats */}
        <BlockchainStats />

        {/* Company & Token Info */}
        <CompanyInfo />
      </main>
    </div>
  );
}
