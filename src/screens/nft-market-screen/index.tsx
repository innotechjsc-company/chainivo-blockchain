"use client";

import { useState, useEffect, useCallback } from "react";
import { NFTFiltersCard, NFTGridCard } from "./components";
import { useNFTData, useNFTFilters, useNFTStats } from "./hooks";
import { LoadingSpinner } from "@/lib/loadingSpinner";
import { NFTMarketHeaderCardMarketNft } from "./components/NFTMarketHeaderCardMarketNft";
import { NFTGridSteryBoxCard } from "./components/NFTGridSteryBoxCard";

export default function NFTMarketScreen() {
  const { nfts } = useNFTData();
  const { stats, volumeData, priceData } = useNFTStats();
  const {
    filters,
    setFilters,
    resetFilters,
    hasActiveFilters,
    otherNFTsData,
    otherNFTsAnalytics,
    searchMarketplace,
    searchNFTs,
    loading,
    fetchOtherNFTs,
    currentPage,
    totalPages,
    fetchMysteryBoxNFTs,
    mysteryBoxData,
    mysteryBoxTotalPages,
    mysteryBoxCurrentPage,
  } = useNFTFilters(nfts);

  const isLoading = loading;

  const [displayedMysteryBoxItems, setDisplayedMysteryBoxItems] = useState<
    any[]
  >([]);

  const getItemKey = (item: any): string => {
    return String(
      item?.id ??
        item?._id ??
        item?.tokenId ??
        item?.token_id ??
        item?.name ??
        JSON.stringify(item)
    );
  };

  const areSetsEqual = (a: any[], b: any[]): boolean => {
    if (a.length !== b.length) return false;
    const aKeys = a.map(getItemKey).sort();
    const bKeys = b.map(getItemKey).sort();
    return aKeys.every((key, index) => key === bKeys[index]);
  };

  const pickRandomMysteryBoxItems = useCallback(
    (previousItems: any[] = []) => {
      if (!Array.isArray(mysteryBoxData) || mysteryBoxData.length === 0) {
        return [];
      }

      if (mysteryBoxData.length <= 3) {
        return mysteryBoxData.slice(0, 3);
      }

      let attempts = 0;
      let subset: any[] = [];

      do {
        const shuffled = [...mysteryBoxData];
        for (let i = shuffled.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = shuffled[i];
          shuffled[i] = shuffled[j];
          shuffled[j] = temp;
        }
        subset = shuffled.slice(0, 3);
        attempts += 1;
      } while (areSetsEqual(subset, previousItems) && attempts < 10);

      return subset;
    },
    [mysteryBoxData]
  );

  useEffect(() => {
    const initialItems = pickRandomMysteryBoxItems();
    setDisplayedMysteryBoxItems(initialItems);
  }, [pickRandomMysteryBoxItems]);

  useEffect(() => {
    if (!Array.isArray(mysteryBoxData) || mysteryBoxData.length <= 3) {
      return;
    }

    const intervalId = setInterval(() => {
      setDisplayedMysteryBoxItems((prev) => pickRandomMysteryBoxItems(prev));
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [mysteryBoxData, pickRandomMysteryBoxItems]);

  return (
    <div className="min-h-screen bg-background">
      {/* Loading Spinner */}
      {isLoading && <LoadingSpinner />}

      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Market Header */}
        <NFTMarketHeaderCardMarketNft
          stats={stats}
          volumeData={volumeData}
          priceData={priceData}
          analytics={otherNFTsAnalytics}
        />

        {/* Filters */}
        <NFTFiltersCard
          filters={filters}
          onFiltersChange={setFilters}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={resetFilters}
          onSearch={searchMarketplace}
        />
        {searchNFTs.length > 0 ? (
          <NFTGridCard
            nfts={searchNFTs}
            title="Kết quả tìm kiếm"
            initialCount={9}
          />
        ) : (
          <>
            {otherNFTsData.length > 0 && (
              <div className="mb-8">
                <NFTGridSteryBoxCard
                  nfts={displayedMysteryBoxItems}
                  title="NFT Hộp bí ẩn"
                  initialCount={3}
                  totalPages={mysteryBoxTotalPages}
                  currentPage={mysteryBoxCurrentPage}
                  onPageChange={(page) => fetchMysteryBoxNFTs(page, 9)}
                />
                <NFTGridCard
                  nfts={otherNFTsData}
                  title="NFT Marketplace"
                  initialCount={9}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={(page) => fetchOtherNFTs(page, 9)}
                />
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {otherNFTsData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              Không tìm thấy NFT phù hợp với bộ lọc
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
