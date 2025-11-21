"use client";

import React, {
  JSX,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/stores";
import NFTService from "@/api/services/nft-service";
import type { NFTItem } from "@/types/NFT";
import NFTInvestCard from "@/components/nft/NFTInvestCard";

const FETCH_TIMEOUT_MS = 8000;
const INITIAL_FETCH_LIMIT = 6;

export default function MyNFTScreen({ type }: { type?: string }): JSX.Element {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef<boolean>(false);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/auth?tab=login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const withTimeout = useCallback(
    async <T,>(promise: Promise<T>): Promise<T> => {
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          if (!isMountedRef.current) {
            return;
          }
          reject(new Error("Request timeout"));
        }, FETCH_TIMEOUT_MS);
      });

      try {
        return await Promise.race([promise, timeoutPromise]);
      } finally {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    },
    []
  );

  const fetchMyNFTs = useCallback(
    async (pageToFetch: number) => {
      if (!isAuthenticated) return;

      const isFirstPage = pageToFetch === 1;

      if (isFirstPage) {
        setIsLoading(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const res = await withTimeout(
          NFTService.getMyNFTOwnerships({
            page: pageToFetch,
            limit: INITIAL_FETCH_LIMIT,
          })
        );

        if (!isMountedRef.current) return;

        if (
          !Array.isArray(res) &&
          res &&
          typeof res === "object" &&
          "success" in res
        ) {
          const response = res as { success: boolean; error?: string };
          if (!response.success) {
            throw new Error(
              response.error || "Khong the tai danh sach NFT co phan"
            );
          }
        }

        const ownerships = Array.isArray(res)
          ? res
          : Array.isArray((res as any)?.data?.ownerships)
          ? (res as any).data.ownerships
          : [];
        const pagination = Array.isArray(res)
          ? undefined
          : (res as any)?.data?.pagination;

        const investmentNFTs = ownerships.filter(
          (item: any) => item?.nft?.type === "investment"
        );

        setNfts((prev) =>
          isFirstPage ? investmentNFTs : [...prev, ...investmentNFTs]
        );
        setCurrentPage(pageToFetch);

        const nextHasMore =
          typeof pagination?.hasNextPage === "boolean"
            ? pagination.hasNextPage
            : investmentNFTs.length === INITIAL_FETCH_LIMIT;
        setHasMore(nextHasMore);
      } catch (err: unknown) {
        if (!isMountedRef.current) return;

        const errorMessage =
          err instanceof Error && err.message === "Request timeout"
            ? "Yeu cau mat qua nhieu thoi gian. Vui long thu lai."
            : err instanceof Error
            ? err.message
            : "Khong the tai danh sach NFT co phan";

        if (pageToFetch === 1) {
          setError(errorMessage);
        }
        console.error("Error fetching NFTs:", err);
      } finally {
        if (!isMountedRef.current) return;
        if (pageToFetch === 1) {
          setIsLoading(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    },
    [isAuthenticated, withTimeout]
  );

  useEffect(() => {
    if (!isAuthenticated) return;
    setNfts([]);
    setHasMore(true);
    setCurrentPage(1);
    fetchMyNFTs(1);
  }, [isAuthenticated, fetchMyNFTs]);

  useEffect(() => {
    if (!hasMore || isLoading || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchMyNFTs(currentPage + 1);
        }
      },
      { rootMargin: "200px" }
    );

    const target = loadMoreRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, isLoadingMore, fetchMyNFTs, currentPage]);

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
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <NFTInvestCard
              key={nft.id}
              nft={nft}
              showActions={true}
              onActionClick={(nft, action) =>
                handleNFTAction(
                  nft,
                  action as "sell" | "buy" | "open" | "cancel"
                )
              }
              type={type}
            />
          ))}
        </div>
      </>
    );
  }, [isLoading, error, nfts, isLoadingMore, type]);

  return (
    <div className="container mx-auto px-4 pt-4 pb-8">
      {content}
      {hasMore && nfts.length > 0 && (
        <div ref={loadMoreRef} className="h-1 w-full" />
      )}
    </div>
  );
}
