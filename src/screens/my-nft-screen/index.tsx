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
const ITEMS_PER_PAGE = 6;

interface FetchNFTParams {
  pageToFetch: number;
  isLoadMore?: boolean;
  minimumItems?: number;
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
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
}

export default function MyNFTScreen({ type }: { type?: string }): JSX.Element {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/auth?tab=login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchMyNFTs = useCallback(
    async ({
      pageToFetch,
      isLoadMore = false,
      minimumItems = ITEMS_PER_PAGE,
    }: FetchNFTParams) => {
      if (!isAuthenticated) return;

      if (isLoadMore) {
        setIsFetchingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      let aggregatedNFTs: NFTItem[] = [];
      let currentPage = pageToFetch;
      let hasNextPage = false;

      try {
        // Lap cho den khi thu du so luong toi thieu (chi ap dung khi load lan dau)
        const res = await withTimeout(
          NFTService.getMyNFTOwnerships({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
          }),
          FETCH_TIMEOUT_MS
        );

        if (!isMountedRef.current) return;

        const processResponse = (response: any) => {
          const items = response?.data?.ownerships ?? [];
          return items.filter(
            (item: any) => item?.nft?.type === "investment"
          ) as NFTItem[];
        };

        let currentResponse = res;

        while (true) {
          if (!isMountedRef.current) return;

          const investmentNFTs = processResponse(currentResponse);
          aggregatedNFTs = [...aggregatedNFTs, ...investmentNFTs];

          const pagination = currentResponse?.data?.pagination;
          const serverHasNext =
            typeof pagination?.hasNextPage === "boolean"
              ? pagination.hasNextPage
              : investmentNFTs.length === ITEMS_PER_PAGE;

          hasNextPage = serverHasNext;

          const shouldFetchMoreFirstLoad =
            !isLoadMore &&
            aggregatedNFTs.length < minimumItems &&
            serverHasNext;

          if (shouldFetchMoreFirstLoad) {
            currentPage += 1;
            currentResponse = await withTimeout(
              NFTService.getMyNFTOwnerships({
                page: currentPage,
                limit: ITEMS_PER_PAGE,
              }),
              FETCH_TIMEOUT_MS
            );
            continue;
          }

          break;
        }

        setNfts((prev) =>
          isLoadMore ? [...prev, ...aggregatedNFTs] : aggregatedNFTs
        );

        setHasMore(hasNextPage);
        setPage((prevPage) =>
          hasNextPage ? currentPage + 1 : Math.max(prevPage, currentPage)
        );
      } catch (err: unknown) {
        if (!isMountedRef.current) return;

        const errorMessage =
          err instanceof Error && err.message === "Request timeout"
            ? "Yeu cau mat qua nhieu thoi gian. Vui long thu lai."
            : "Khong the tai danh sach NFT co phan";

        setError(errorMessage);
        console.error("Error fetching NFTs:", err);
      } finally {
        if (!isMountedRef.current) return;

        if (isLoadMore) {
          setIsFetchingMore(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [isAuthenticated]
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    setNfts([]);
    setPage(1);
    setHasMore(true);

    fetchMyNFTs({ pageToFetch: 1, minimumItems: ITEMS_PER_PAGE });
  }, [isAuthenticated, fetchMyNFTs]);

  useEffect(() => {
    if (!observerRef.current) return;
    if (!hasMore || isLoading || isFetchingMore || !!error) return;

    const target = observerRef.current;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting) {
        fetchMyNFTs({ pageToFetch: page, isLoadMore: true });
      }
    });

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [fetchMyNFTs, page, hasMore, isLoading, isFetchingMore, error]);

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
        <div
          ref={observerRef}
          className="py-6 text-center text-sm text-gray-500"
          aria-live="polite"
        ></div>
      </>
    );
  }, [isLoading, error, nfts, type, isFetchingMore, hasMore]);

  return <div className="container mx-auto px-4 pt-4 pb-8">{content}</div>;
}
