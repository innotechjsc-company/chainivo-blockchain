"use client";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/stores";
import {
  StakingCoin,
  StakingNFT,
  StakingStats,
  AvailableNFT,
  StakingConfig,
  StakingPool,
} from "@/types/staking";
import StakingService from "@/api/services/staking-service";
import { ApiService } from "@/api/api";
import { toast } from "sonner";

/**
 * Custom hook để quản lý dữ liệu staking
 */
export const useStakingData = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Staking data
  const [coinStakes, setCoinStakes] = useState<StakingCoin[]>([]);
  const [nftStakes, setNFTStakes] = useState<StakingNFT[]>([]);
  const [stakingStats, setStakingStats] = useState<StakingStats | null>(null);
  const [availableNFTs, setAvailableNFTs] = useState<AvailableNFT[]>([]);
  const [stakingConfig, setStakingConfig] = useState<StakingConfig | null>(
    null
  );
  const [stakingMyPools, setStakingMyPools] = useState<StakingPool[]>([]);
  const userInfo = useAppSelector((state) => state.auth.user);
  // Fetch staking data
  const fetchStakingData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // TODO: Thay thế bằng API calls thực tế khi có authentication
      // if (isAuthenticated && user) {
      //   const [coinData, nftData, statsData, nftsData, configData] = await Promise.all([
      //     api.staking.getCoinStakes(user.id),
      //     api.staking.getNFTStakes(user.id),
      //     api.staking.getStats(user.id),
      //     api.staking.getAvailableNFTs(user.id),
      //     api.staking.getConfig()
      //   ])
      // }

      // Mock data cho development - không phụ thuộc vào authentication
      const mockCoinStakes: StakingCoin[] = [];
      const mockNFTStakes: StakingNFT[] = [];
      const mockStats: StakingStats = {
        totalCoinStaked: 0,
        totalCoinRewards: 0,
        totalNFTValue: 0,
        totalNFTRewards: 0,
        totalActiveStakes: 0,
        averageAPY: 12.5,
      };
      const mockAvailableNFTs: AvailableNFT[] = [
        {
          id: "nft-1",
          name: "Premium Business NFT",
          value: 50000,
          rarity: "rare",
        },
        {
          id: "nft-2",
          name: "Elite Investment NFT",
          value: 100000,
          rarity: "epic",
        },
        {
          id: "nft-3",
          name: "Diamond Tier NFT",
          value: 250000,
          rarity: "legendary",
        },
      ];
      const mockConfig: StakingConfig = {
        coinAPY: 10,
        nftAPY: 15,
        minStakeAmount: 100,
        maxStakeAmount: 1000000,
        lockPeriod: 3650, // 10 years
        claimCooldown: 0,
      };

      setCoinStakes(mockCoinStakes);
      setNFTStakes(mockNFTStakes);
      setStakingStats(mockStats);
      setAvailableNFTs(mockAvailableNFTs);
      setStakingConfig(mockConfig);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch staking data"
      );
    } finally {
      setLoading(false);
    }
  };
  const getStakingPools = async () => {
    const response = await StakingService.getUserStakes(
      (userInfo?.id as string) ?? ""
    );
    
    if (response?.success) {
      setStakingMyPools(response?.data?.stakes as StakingPool[]);
    } else {
      setStakingMyPools([]);
    }

  };

  const getClaimRewardsData = async (stakeId: string) => {
    setIsLoading(true);
    const response = await StakingService.getRewards(stakeId);
    if (response?.success) {
      await getStakingPools();
      setIsLoading(false);
      toast.success("Nhận thưởng thành công!");
      return response?.data;
    } else {
      setIsLoading(false);
      toast.error("Lỗi nhận thưởng!");
      return [];
    }
  };
  const unStakeData = async (stakeId: string) => {
    setIsLoading(true);
    const response = await StakingService.unstake(stakeId);
    if (response?.success) {
      await getStakingPools();
      setIsLoading(false);
      toast.success("Huỷ stake thành công!");
      return response?.data;
    } else {
      setIsLoading(false);
      toast.error("Lỗi huỷ stake!");
      return [];
    }
  };

  useEffect(() => {
    getStakingPools();
  }, []);

  // Refresh data - không hiển thị loading khi refresh
  const refreshData = async () => {
    setError(null);

    try {
      // Simulate API delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 300));

      // TODO: Thay thế bằng API calls thực tế khi có authentication
      // if (isAuthenticated && user) {
      //   const [coinData, nftData, statsData, nftsData, configData] = await Promise.all([
      //     api.staking.getCoinStakes(user.id),
      //     api.staking.getNFTStakes(user.id),
      //     api.staking.getStats(user.id),
      //     api.staking.getAvailableNFTs(user.id),
      //     api.staking.getConfig()
      //   ])
      // }

      // Mock data cho development - không phụ thuộc vào authentication
      const mockCoinStakes: StakingCoin[] = [];
      const mockNFTStakes: StakingNFT[] = [];
      const mockStats: StakingStats = {
        totalCoinStaked: 0,
        totalCoinRewards: 0,
        totalNFTValue: 0,
        totalNFTRewards: 0,
        totalActiveStakes: 0,
        averageAPY: 12.5,
      };
      const mockAvailableNFTs: AvailableNFT[] = [
        {
          id: "nft-1",
          name: "Premium Business NFT",
          value: 50000,
          rarity: "rare",
        },
        {
          id: "nft-2",
          name: "Elite Investment NFT",
          value: 100000,
          rarity: "epic",
        },
        {
          id: "nft-3",
          name: "Diamond Tier NFT",
          value: 250000,
          rarity: "legendary",
        },
      ];
      const mockConfig: StakingConfig = {
        coinAPY: 10,
        nftAPY: 15,
        minStakeAmount: 100,
        maxStakeAmount: 1000000,
        lockPeriod: 3650, // 10 years
        claimCooldown: 0,
      };

      setCoinStakes(mockCoinStakes);
      setNFTStakes(mockNFTStakes);
      setStakingStats(mockStats);
      setAvailableNFTs(mockAvailableNFTs);
      setStakingConfig(mockConfig);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refresh staking data"
      );
    }
  };

  // Add new coin stake
  const addCoinStake = (stake: StakingCoin) => {
    setCoinStakes((prev) => [stake, ...prev]);
    updateStats();
  };

  // Add new NFT stake
  const addNFTStake = (stake: StakingNFT) => {
    setNFTStakes((prev) => [stake, ...prev]);
    updateStats();
  };

  // Update coin stake
  const updateCoinStake = (stakeId: string, updates: Partial<StakingCoin>) => {
    setCoinStakes((prev) =>
      prev.map((stake) =>
        stake.id === stakeId ? { ...stake, ...updates } : stake
      )
    );
    updateStats();
  };

  // Update NFT stake
  const updateNFTStake = (stakeId: string, updates: Partial<StakingNFT>) => {
    setNFTStakes((prev) =>
      prev.map((stake) =>
        stake.id === stakeId ? { ...stake, ...updates } : stake
      )
    );
    updateStats();
  };

  // Update stats
  const updateStats = () => {
    const activeCoinStakes = coinStakes.filter((s) => s.status === "active");
    const activeNFTStakes = nftStakes.filter((s) => s.status === "active");

    const totalCoinStaked = activeCoinStakes.reduce(
      (sum, s) => sum + s.amountStaked,
      0
    );
    const totalCoinRewards = activeCoinStakes.reduce((sum, s) => {
      const daysPassed = calculateDaysPassed(s.stakedAt);
      return sum + calculateRewards(s.amountStaked, s.apy, daysPassed);
    }, 0);

    const totalNFTValue = activeNFTStakes.reduce(
      (sum, s) => sum + s.nftValue,
      0
    );
    const totalNFTRewards = activeNFTStakes.reduce((sum, s) => {
      const daysPassed = calculateDaysPassed(s.stakedAt);
      return sum + calculateRewards(s.nftValue, s.apy, daysPassed);
    }, 0);

    const totalActiveStakes = activeCoinStakes.length + activeNFTStakes.length;
    const averageAPY =
      totalActiveStakes > 0
        ? (activeCoinStakes.reduce((sum, s) => sum + s.apy, 0) +
            activeNFTStakes.reduce((sum, s) => sum + s.apy, 0)) /
          totalActiveStakes
        : 0;

    setStakingStats({
      totalCoinStaked,
      totalCoinRewards,
      totalNFTValue,
      totalNFTRewards,
      totalActiveStakes,
      averageAPY,
    });
  };

  // Helper functions
  const calculateRewards = (
    amount: number,
    apy: number,
    daysPassed: number
  ): number => {
    return (amount * apy * daysPassed) / (365 * 100);
  };

  const calculateDaysPassed = (stakedAt: string): number => {
    const now = new Date();
    const stakeDate = new Date(stakedAt);
    return Math.floor(
      (now.getTime() - stakeDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  // Status management functions
  const addPendingStake = (stakeData: any) => {
    const pendingStake = {
      id: `temp-${Date.now()}`,
      status: "pending",
      canUnstake: true,
      earned: 0,
      pendingRewards: 0,
      daysRemaining: 0,
      daysSinceStaked: 0,
      stakedAt: new Date().toISOString(),
      ...stakeData,
    };
    setStakingMyPools((prev) => [pendingStake, ...prev]);
    return pendingStake.id;
  };

  const updateStakeStatus = (id: string, updates: any) => {
    setStakingMyPools((prev) =>
      prev.map((stake: any) =>
        stake.id === id ? { ...stake, ...updates } : stake
      )
    );
  };

  const removeStake = (id: string) => {
    setStakingMyPools((prev) => prev.filter((stake: any) => stake.id !== id));
  };

  // Effects
  useEffect(() => {
    // Fetch data ngay khi component mount - không phụ thuộc vào authentication cho mock data
    fetchStakingData();
  }, []); // Empty dependency array để chỉ chạy một lần khi mount

  return {
    // Data
    coinStakes,
    nftStakes,
    stakingStats,
    availableNFTs,
    stakingConfig,

    // State
    loading,
    error,

    // Actions
    refreshData,
    addCoinStake,
    addNFTStake,
    updateCoinStake,
    updateNFTStake,

    // Helpers
    calculateRewards,
    calculateDaysPassed,
    stakingMyPools,
    fetchStakingData,
    getClaimRewardsData,
    getStakingPools,
    setIsLoading,
    isLoading,
    unStakeData,

    // Status management
    addPendingStake,
    updateStakeStatus,
    removeStake,
  };
};
