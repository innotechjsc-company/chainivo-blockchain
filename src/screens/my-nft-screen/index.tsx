"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/stores";
import NFTService from "@/api/services/nft-service";
import type { NFTItem } from "@/types/NFT";
import NFTInvestCard from "@/components/nft/NFTInvestCard";

const FETCH_TIMEOUT_MS = 8000;

export default function MyNFTScreen({ type }: { type?: string }): JSX.Element {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/auth?tab=login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;

    const fetchMyNFTs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Helper function để thêm timeout cho API calls
        const withTimeout = async <T,>(
          promise: Promise<T>,
          timeoutMs: number = 8000
        ): Promise<T> => {
          let timeoutId: ReturnType<typeof setTimeout> | undefined;

          const timeoutPromise = new Promise<never>((_, reject) => {
            timeoutId = setTimeout(
              () => reject(new Error("Request timeout")),
              timeoutMs
            );
          });

          try {
            return await Promise.race([promise, timeoutPromise]);
          } finally {
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
          }
        };

        // Gọi API với timeout 8s
        const res = await withTimeout(
          NFTService.getMyNFTOwnerships({ page: 1, limit: 50 }),
          FETCH_TIMEOUT_MS
        );

        if (!isMounted) return;

        const items = res?.data?.ownerships ?? [];

        // Tối ưu filter: chỉ lấy NFT có type = 'investment'
        const investmentNFTs = items.filter(
          (item: any) => item?.nft?.type === "investment"
        );

        if (isMounted) {
          setNfts(investmentNFTs);
        }
      } catch (err: unknown) {
        if (!isMounted) return;

        const errorMessage =
          err instanceof Error && err.message === "Request timeout"
            ? "Yeu cau mat qua nhieu thoi gian. Vui long thu lai."
            : "Khong the tai danh sach NFT co phan";

        setError(errorMessage);
        console.error("Error fetching NFTs:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMyNFTs();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const handleNFTAction = (
    nft: NFTItem,
    action: "sell" | "buy" | "open" | "cancel"
  ) => {
    // TODO: Implement action handlers (sell, buy, open mystery box, cancel listing)
    // - open: Open mystery box -> fetch rewards
    // - sell: List NFT for sale
    // - buy: Purchase NFT from marketplace
    // - cancel: Cancel NFT listing
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
      return <div className="py-10 text-center">Không có NFT đầu tư nào</div>;
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft) => (
          <NFTInvestCard
            key={nft.id}
            nft={nft}
            showActions={true}
            onActionClick={(nft, action) =>
              handleNFTAction(nft, action as "sell" | "buy" | "open" | "cancel")
            }
            type={type}
          />
        ))}
      </div>
    );
  }, [isLoading, error, nfts]);

  return <div className="container mx-auto px-4 pt-4 pb-8">{content}</div>;
}
