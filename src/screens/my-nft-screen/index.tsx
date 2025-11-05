"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/stores";
import NFTService from "@/api/services/nft-service";
import type { NFTItem } from "@/types/NFT";

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
        const res = await NFTService.getNFTOwnerships({ page: 1, limit: 50 });
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

  const content = useMemo(() => {
    if (isLoading) {
      return <div className="py-10 text-center">Dang tai du lieu...</div>;
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
          <div
            key={nft.id}
            className="rounded-lg border border-gray-200 overflow-hidden bg-white dark:bg-neutral-900"
          >
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="text-base font-semibold line-clamp-1">
                {nft.name}
              </div>
              <div className="mt-1 text-sm text-gray-500 line-clamp-2">
                {nft.description}
              </div>
              <div className="mt-3 text-sm">
                <span className="text-gray-500">Gia hien tai: </span>
                <span className="font-medium">
                  {typeof nft.salePrice === "number"
                    ? nft.salePrice
                    : nft.price}
                </span>
                <span className="ml-1 uppercase">{nft.currency}</span>
              </div>
              {nft.isSale ? (
                <div className="mt-2 inline-block text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20">
                  Dang rao ban
                </div>
              ) : (
                <div className="mt-2 inline-block text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 dark:bg-white/10">
                  Khong rao ban
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }, [isLoading, error, nfts]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">NFT cua toi - Dau tu</h1>
      {content}
    </div>
  );
}
