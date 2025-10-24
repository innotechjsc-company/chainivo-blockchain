"use client";
import { useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useNotificationStore } from "@/stores/notificationStore";
import {
  CreateStakingCoinRequest,
  CreateStakingNFTRequest,
  ClaimRewardsRequest,
  CancelStakeRequest,
  StakingCoin,
  StakingNFT,
} from "@/types/staking";

/**
 * Custom hook để quản lý các hành động staking
 */
export const useStakingActions = () => {
  const { user, isAuthenticated } = useUserStore();
  const { addNotification } = useNotificationStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stake CAN tokens
  const stakeCoin = async (request: CreateStakingCoinRequest) => {
    if (!isAuthenticated || !user) {
      throw new Error("User not authenticated");
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Thay thế bằng API call thực tế
      // const response = await api.staking.createCoinStake(request)

      // Mock response
      const mockStake: StakingCoin = {
        id: `stake-${Date.now()}`,
        userId: user.id,
        amountStaked: request.amountStaked,
        rewards: 0,
        apy: request.apy || 10,
        stakedAt: new Date().toISOString(),
        lockedUntil: new Date(
          Date.now() + (request.lockPeriod || 3650) * 24 * 60 * 60 * 1000
        ).toISOString(),
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addNotification({
        type: "success",
        title: "Staking thành công! 🎉",
        message: `Đã stake ${request.amountStaked.toLocaleString()} CAN. Phần thưởng sẽ tích lũy theo thời gian!`,
      });

      return mockStake;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to stake coins";
      setError(errorMessage);

      addNotification({
        type: "error",
        title: "Lỗi staking",
        message: errorMessage,
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Stake NFT
  const stakeNFT = async (request: CreateStakingNFTRequest) => {
    if (!isAuthenticated || !user) {
      throw new Error("User not authenticated");
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Thay thế bằng API call thực tế
      // const response = await api.staking.createNFTStake(request)

      // Mock response
      const mockStake: StakingNFT = {
        id: `nft-stake-${Date.now()}`,
        userId: user.id,
        nftId: request.nftId,
        nftName: request.nftName,
        nftValue: request.nftValue,
        nftImage: request.nftImage,
        rewards: 0,
        apy: request.apy || 15,
        stakedAt: new Date().toISOString(),
        lockedUntil: new Date(
          Date.now() + (request.lockPeriod || 3650) * 24 * 60 * 60 * 1000
        ).toISOString(),
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addNotification({
        type: "success",
        title: "Staking NFT thành công! 🎉",
        message: `Đã stake NFT ${request.nftName}. Phần thưởng sẽ tích lũy theo thời gian!`,
      });

      return mockStake;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to stake NFT";
      setError(errorMessage);

      addNotification({
        type: "error",
        title: "Lỗi staking NFT",
        message: errorMessage,
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Claim rewards
  const claimRewards = async (request: ClaimRewardsRequest) => {
    if (!isAuthenticated || !user) {
      throw new Error("User not authenticated");
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Thay thế bằng API call thực tế
      // const response = await api.staking.claimRewards(request)

      // Mock response
      const mockResponse = {
        rewardsClaimed: 100, // Mock amount
        newBalance: 5000, // Mock balance
      };

      addNotification({
        type: "success",
        title: "Nhận thưởng thành công! 🎉",
        message: `Đã nhận ${mockResponse.rewardsClaimed.toFixed(
          2
        )} CAN. Thời gian staking đã được reset và tiếp tục tích lũy.`,
      });

      return mockResponse;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to claim rewards";
      setError(errorMessage);

      addNotification({
        type: "error",
        title: "Lỗi nhận thưởng",
        message: errorMessage,
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel stake
  const cancelStake = async (request: CancelStakeRequest) => {
    if (!isAuthenticated || !user) {
      throw new Error("User not authenticated");
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Thay thế bằng API call thực tế
      // const response = await api.staking.cancelStake(request)

      // Mock response
      const mockResponse = {
        amountReturned: 1000, // Mock amount
        rewardsClaimed: 50, // Mock rewards
        newBalance: 6000, // Mock balance
      };

      const actionText = request.type === "coin" ? "staking" : "staking NFT";

      addNotification({
        type: "success",
        title: `Huỷ ${actionText} thành công! ✅`,
        message: `Đã hoàn trả ${mockResponse.amountReturned.toLocaleString()} CAN và ${mockResponse.rewardsClaimed.toFixed(
          2
        )} CAN phần thưởng.`,
      });

      return mockResponse;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to cancel stake";
      setError(errorMessage);

      addNotification({
        type: "error",
        title: "Lỗi huỷ staking",
        message: errorMessage,
      });

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return {
    // State
    loading,
    error,

    // Actions
    stakeCoin,
    stakeNFT,
    claimRewards,
    cancelStake,
    clearError,
  };
};
