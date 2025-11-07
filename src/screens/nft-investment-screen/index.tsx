"use client";

import { useEffect, useState } from "react";
import { NFTMarketHeaderCard, NFTFiltersCard, NFTGridCard } from "./components";
import { useNFTData } from "./hooks/useNFTData";
import { useNFTFilters } from "./hooks/useNFTFilters";
import { useNFTStats } from "./hooks/useNFTStats";
import { Spinner } from "@/components/ui/spinner";
import { autoConnect } from "@/lib/utils";

export default function NFTInvestmentScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { nfts } = useNFTData();
  const { stats, volumeData, priceData } = useNFTStats();
  const {
    filters,
    setFilters,
    tierNFTs,
    otherNFTs,
    resetFilters,
    hasActiveFilters,
    fetchUserNFTs,
    userNFTs,
    otherNFTsData,
    otherNFTsAnalytics,
    searchMarketplace,
    searchNFTs,
    loading,
    fetchOtherNFTs,
    currentPage,
    totalPages,
  } = useNFTFilters(nfts);

  // Sync component loading state with hook loading state
  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    autoConnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-4 py-3 bg-background/90 rounded-lg border border-primary/20">
            <Spinner className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-primary">
              Đang tải dữ liệu ...
            </span>
          </div>
        </div>
      )}
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Market Header */}
        <NFTMarketHeaderCard
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
            initialCount={3}
          />
        ) : (
          <>
            <div className="mb-8">
              <NFTGridCard
                nfts={otherNFTsData}
                title="Danh sách NFT đầu tư "
                initialCount={6}
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={(page) => fetchOtherNFTs(page, 1)}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
