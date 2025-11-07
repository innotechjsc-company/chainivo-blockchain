"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/stores";
import NFTService from "@/api/services/nft-service";
import type { NFTItem } from "@/types/NFT";
import { LoadingSpinner } from "@/lib/loadingSpinner";
import { formatNumber } from "@/utils/formatters";
import { formatAmount, getLevelBadge } from "@/lib/utils";

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
        setError("Khong the tai danh sach NFT co phan");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyNFTs();
  }, [isAuthenticated]);

  const content = useMemo(() => {
    if (isLoading) {
      return <LoadingSpinner />;
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
          <div
            key={nft.id}
            className="rounded-lg border border-gray-100 overflow-hidden bg-neutral-50 dark:bg-white/5 dark:border-white/10"
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
                <span className="text-gray-500">Giá hiện tại: </span>
                <span className="font-medium">
                  {typeof nft.salePrice === "number"
                    ? formatAmount(nft.salePrice)
                      ? formatAmount(nft.price)
                      : formatAmount(nft.price)
                    : formatAmount(nft.price)}
                </span>
                <span className="ml-1 uppercase">{nft.currency}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-500">Ngày mua</div>
                  <div className="font-medium">
                    {new Date(
                      nft.purchaseDate || nft.createdAt
                    ).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Cấp độ</div>
                  <div className="font-medium">{getLevelBadge(nft.level)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Số lượng đầu tư cổ phần</div>
                  <div className="font-medium">
                    {formatNumber(nft.shares)} ={" "}
                    {formatNumber(nft.pricePerShare || 0 * nft.shares || 0)}{" "}
                    {nft.currency}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }, [isLoading, error, nfts]);

  return <div className="container mx-auto px-4 pt-4 pb-8">{content}</div>;
}
