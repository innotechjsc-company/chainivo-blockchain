"use client";

import { useState, useEffect } from "react";
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
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignOut = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero />
        {user && <UserDashboard />}
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
