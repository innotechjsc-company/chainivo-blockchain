"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Coins, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/utils/formatters";
import type { OpenBoxResponse } from "@/api/services/mystery-box-service";

interface RewardDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  reward: OpenBoxResponse | null;
}

export const RewardDisplay = ({
  isOpen,
  onClose,
  reward,
}: RewardDisplayProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !reward || !mounted) return null;

  const rewardData = reward.reward;
  const isTokenReward = rewardData?.type === "token";
  const isNFTReward = rewardData?.type === "nft";

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 animate-pulse" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
        >
          <X className="w-5 h-5 text-gray-300" />
        </button>

        {/* Content */}
        <div className="relative p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 mb-4 animate-bounce">
              {isTokenReward && <Coins className="w-10 h-10 text-white" />}
              {isNFTReward && <ImageIcon className="w-10 h-10 text-white" />}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Chúc mừng! 🎉
            </h2>
            <p className="text-gray-400">{reward.message}</p>
          </div>

          {/* Token Reward */}
          {isTokenReward && (
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Bạn nhận được</p>
                <div className="flex items-center justify-center gap-3">
                  <Coins className="w-8 h-8 text-yellow-400" />
                  <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500">
                    {formatNumber((rewardData as import("@/api/services/mystery-box-service").TokenReward).amount)}
                  </span>
                </div>
                <p className="text-xl font-semibold text-yellow-400 mt-2">
                  {(rewardData as import("@/api/services/mystery-box-service").TokenReward).description || 'Phần thưởng Token'}
                </p>
              </div>
            </div>
          )}

          {/* NFT Reward */}
          {isNFTReward && (
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* NFT Image */}
                <div className="flex-shrink-0">
                  <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden bg-gray-800 border-2 border-purple-500/50">
                    <img
                      src={(rewardData as import("@/api/services/mystery-box-service").NFTRewardData).nft.image.url}
                      alt={(rewardData as import("@/api/services/mystery-box-service").NFTRewardData).nft.image.alt || (rewardData as import("@/api/services/mystery-box-service").NFTRewardData).nft.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded">
                      Level {(rewardData as import("@/api/services/mystery-box-service").NFTRewardData).nft.level}
                    </div>
                  </div>
                </div>

                {/* NFT Details */}
                <div className="flex-1">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-purple-600/20 text-purple-400 text-xs font-semibold rounded-full mb-2">
                      {(rewardData as import("@/api/services/mystery-box-service").NFTRewardData).nft.type.toUpperCase()}
                    </span>
                    <h3 className="text-2xl font-bold text-white">
                      {(rewardData as import("@/api/services/mystery-box-service").NFTRewardData).nft.name}
                    </h3>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">
                    {(rewardData as import("@/api/services/mystery-box-service").NFTRewardData).description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mystery Box Info */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <p className="text-gray-400 text-sm text-center">
              Từ hộp:{" "}
              <span className="text-white font-semibold">
                {reward.mysteryBox.name}
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6"
            >
              Xem kho đồ
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 py-6"
            >
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
