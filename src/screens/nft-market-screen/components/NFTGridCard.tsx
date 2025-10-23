"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { NFTCard } from "./NFTCard";
import { NFT } from "../hooks";

interface NFTGridCardProps {
  nfts: NFT[];
  title: string;
  initialCount?: number;
}

export const NFTGridCard = ({
  nfts,
  title,
  initialCount = 6,
}: NFTGridCardProps) => {
  const [displayCount, setDisplayCount] = useState(initialCount);

  const displayedNFTs = nfts.slice(0, displayCount);
  const hasMore = displayCount < nfts.length;

  if (nfts.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 gradient-text">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {displayedNFTs.map((nft, index) => (
          <div
            key={nft.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <NFTCard nft={nft} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setDisplayCount((prev) => prev + 6)}
            className="gap-2"
          >
            Xem thêm
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
