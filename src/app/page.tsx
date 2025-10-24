"use client";

import { useState } from "react";
import { Header } from "@/components/header/Header";
import { Hero } from "@/components/hero/Hero";
import { UserDashboard } from "@/components/user-dashboard/UserDashboard";
import { BlockchainStats } from "@/components/blockchain-stats/BlockchainStats";
import { InvestmentPhases } from "@/components/investment-phases/InvestmentPhases";
import { MembershipTiers } from "@/components/membership-tiers/MembershipTiers";
import { NFTMarketplace } from "@/components/nft-marketplace/NFTMarketplace";
import { Missions } from "@/components/missions/Missions";
import { NewsEvents } from "@/components/news-events/NewsEvents";
import { Footer } from "@/components/footer/Footer";

export default function Home() {
  const [session, setSession] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero />
        {session && <UserDashboard />}
        <BlockchainStats />
        <InvestmentPhases />
        <MembershipTiers />
        <NFTMarketplace />
        <Missions />
        <NewsEvents />
      </main>
    </div>
  );
}
