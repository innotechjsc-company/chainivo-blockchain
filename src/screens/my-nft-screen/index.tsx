"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/stores";
import NFTService from "@/api/services/nft-service";
import type { NFTItem } from "@/types/NFT";
import { NFTCard } from "@/components/nft";

// Trang quan ly NFT cua toi (chi hien thi NFT dau tu)
export default function MyNFTScreen(): JSX.Element {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect neu chua dang nhap
  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/auth?tab=login");
    }
  }, [isAuthenticated, router]);

  // Fetch my NFTs khi da dang nhap
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchMyNFTs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await NFTService.getMyNFTOwnerships({ page: 1, limit: 50 });
        const items = res?.data?.nfts ?? [];
        // Loc client-side: chi lay NFT co type = 'investment'
        const investmentNFTs = items.filter(
          (item) => item.type === "investment"
        );
        setNfts(investmentNFTs);
      } catch (err: unknown) {
        setError("Khong the tai danh sach NFT");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyNFTs();
  }, [isAuthenticated]);

  const handleNFTAction = (nft: NFTItem, action: "sell" | "buy" | "open") => {
    console.log(`Action ${action} on NFT:`, nft.id);
    // TODO: Implement action handlers (sell, buy, open mystery box)
  };

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-100 overflow-hidden bg-neutral-50 dark:bg-white/5 dark:border-white/10"
            >
              <div className="w-full h-56 bg-gray-100 dark:bg-white/10 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return <div className="py-10 text-center text-red-500">{error}</div>;
    }

    if (!nfts.length) {
      return <div className="py-10 text-center">Khong co NFT dau tu nao</div>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft) => (
          <NFTCard
            key={nft.id}
            nft={nft}
            showActions={true}
            onActionClick={handleNFTAction}
          />
        ))}
      </div>
    );
  }, [isLoading, error, nfts]);

  return (
    <div className="container mx-auto px-4 pt-4 pb-8">
      <h1 className="text-2xl font-bold mb-6 pt-20">NFT Cổ phần</h1>
      {content}
    </div>
  );
}
