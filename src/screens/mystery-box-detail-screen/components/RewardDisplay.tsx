"use client";

import { Coins, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  if (!isOpen || !reward) return null;

  const isTokenReward = reward.reward.rewardType === "token";
  const isNFTReward = reward.reward.rewardType === "nft";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
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
          {isTokenReward && reward.reward.rewardType === "token" && (
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Bạn nhận được</p>
                <div className="flex items-center justify-center gap-3">
                  <Coins className="w-8 h-8 text-yellow-400" />
                  <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500">
                    {reward.reward.tokenQuantity.toLocaleString()}
                  </span>
                </div>
                <p className="text-xl font-semibold text-yellow-400 mt-2">
                  Token
                </p>
              </div>
            </div>
          )}

          {/* NFT Reward */}
          {isNFTReward && reward.reward.rewardType === "nft" && (
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* NFT Image */}
                <div className="flex-shrink-0">
                  <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden bg-gray-800 border-2 border-purple-500/50">
                    <img
                      src={reward.reward.nft.image.url}
                      alt={reward.reward.nft.image.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded">
                      Level {reward.reward.nft.level}
                    </div>
                  </div>
                </div>

                {/* NFT Details */}
                <div className="flex-1">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-purple-600/20 text-purple-400 text-xs font-semibold rounded-full mb-2">
                      {reward.reward.nft.type.toUpperCase()}
                    </span>
                    <h3 className="text-2xl font-bold text-white">
                      {reward.reward.nft.name}
                    </h3>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">
                    {reward.reward.nft.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Giá trị:</span>
                      <span className="text-white font-semibold ml-2">
                        {reward.reward.nft.price.toLocaleString()} Token
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Trạng thái:</span>
                      <span
                        className={`ml-2 font-semibold ${
                          reward.reward.nft.status === "available"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {reward.reward.nft.status === "available"
                          ? "Sẵn sàng"
                          : reward.reward.nft.status}
                      </span>
                    </div>
                  </div>
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
};
