"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero/Hero";
import { UserDashboard } from "@/screens/home-screen/user-dashboard/UserDashboard";
import { BlockchainStats } from "@/screens/home-screen/blockchain-stats/BlockchainStats";
import { InvestmentPhases } from "@/screens/home-screen/investment-phases/InvestmentPhases";
import { MembershipTiers } from "@/screens/home-screen/membership-tiers/MembershipTiers";
import { NFTMarketplace } from "@/screens/home-screen/nft-marketplace/NFTMarketplace";
import { Missions } from "@/screens/home-screen/missions/Missions";
import { NewsEvents } from "@/screens/home-screen/news-events/NewsEvents";
import { Footer } from "@/components/footer/Footer";
import { LocalStorageService } from "@/services";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check for user in LocalStorageService (legacy)
    const storedUser = LocalStorageService.getUser();
    if (storedUser) {
      setUser(storedUser);
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
        {/* <MembershipTiers /> */}
        <NFTMarketplace />
        <Missions />
        {/* <NewsEvents /> */}
      </main>
    </div>
  );
}
