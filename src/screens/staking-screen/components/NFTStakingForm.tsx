"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Zap } from "lucide-react";
import { CreateStakingNFTRequest, AvailableNFT } from "@/types/staking";

interface NFTStakingFormProps {
  availableNFTs: AvailableNFT[];
  onStake: (request: CreateStakingNFTRequest) => Promise<void>;
  loading?: boolean;
  apy?: number;
}

export const NFTStakingForm = ({
  availableNFTs,
  onStake,
  loading = false,
  apy = 15,
}: NFTStakingFormProps) => {
  const [selectedNFTId, setSelectedNFTId] = useState("");

  const selectedNFT = availableNFTs.find((nft) => nft.id === selectedNFTId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedNFT) return;

    try {
      await onStake({
        nftId: selectedNFT.id,
        nftName: selectedNFT.name,
        nftValue: selectedNFT.value,
        nftImage: selectedNFT.image,
        apy,
        lockPeriod: 3650, // 10 years
      });
      setSelectedNFTId("");
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Card className="staking-card overflow-hidden border-primary/30 shadow-lg">
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold mb-1">Stake NFT</h3>
          <p className="text-muted-foreground">
            APY {apy}% - Phần thưởng cao hơn
          </p>
        </div>
      </div>

      <CardContent className="staking-card-content pt-6 space-y-4">
        <form onSubmit={handleSubmit} className="staking-form space-y-4">
          <div>
            <Label
              htmlFor="nft-select"
              className="text-sm font-medium mb-2 block"
            >
              Chọn NFT để stake
            </Label>
            <Select value={selectedNFTId} onValueChange={setSelectedNFTId}>
              <SelectTrigger className="w-full h-12 text-lg">
                <SelectValue placeholder="-- Chọn NFT --" />
              </SelectTrigger>
              <SelectContent>
                {availableNFTs.map((nft) => (
                  <SelectItem key={nft.id} value={nft.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{nft.name}</span>
                      <span className="text-muted-foreground ml-2">
                        ({nft.value.toLocaleString()} CAN)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedNFT && (
            <div className="p-4 bg-green-500/10 rounded-lg space-y-2 border border-green-500/20 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">
                  Dự kiến phần thưởng
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Giá trị NFT:</span>
                <span className="font-bold">
                  {selectedNFT.value.toLocaleString()} CAN
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">7 ngày</p>
                  <p className="text-sm font-bold text-green-500">
                    {((selectedNFT.value * apy * 7) / (365 * 100)).toFixed(2)}{" "}
                    CAN
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">30 ngày</p>
                  <p className="text-sm font-bold text-green-500">
                    {((selectedNFT.value * apy * 30) / (365 * 100)).toFixed(2)}{" "}
                    CAN
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">365 ngày</p>
                  <p className="text-sm font-bold text-green-500">
                    {((selectedNFT.value * apy) / 100).toFixed(2)} CAN
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="staking-form-actions">
            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={!selectedNFT || loading}
            >
              <Zap className="h-5 w-5 mr-2" />
              {loading ? "Đang xử lý..." : "Stake NFT Ngay"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
