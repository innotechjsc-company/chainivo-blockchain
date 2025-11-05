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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Kiểm tra token và user trong LocalStorageService
    const token = LocalStorageService.getToken();
    const storedUser = LocalStorageService.getUser();

    if (token && storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    } else {
      // Clear dữ liệu nếu token không hợp lệ
      setUser(null);
      setIsAuthenticated(false);
      if (!token && storedUser) {
        // Nếu có user nhưng không có token, clear hết
        LocalStorageService.clearAuthData();
      }
    }
  }, []);

  const handleSignOut = () => {
    LocalStorageService.clearAuthData();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero />
        {user && <UserDashboard />}
        <BlockchainStats />
        <InvestmentPhases />
        {/* <MembershipTiers /> */}
        {/* <NFTMarketplace /> */}
        <Missions />
        {/* <NewsEvents /> */}
      </main>
    </div>
  );
}
