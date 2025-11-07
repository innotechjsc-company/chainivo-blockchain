"use client";

import { useState, useEffect } from "react";
import { NFTMarketHeaderCard, NFTFiltersCard, NFTGridCard } from "./components";
import { useNFTData, useNFTFilters, useNFTStats } from "./hooks";
import { LoadingSpinner } from "@/lib/loadingSpinner";

export default function NFTMarketScreen() {
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
    // use hook loading to drive global loading
    loading,
    fetchOtherNFTs,
    currentPage,
    totalPages,
  } = useNFTFilters(nfts);

  const isLoading = loading;

  return (
    <div className="min-h-screen bg-background">
      {/* Loading Spinner */}
      {isLoading && <LoadingSpinner />}

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
            {filters.type !== "tier" && otherNFTs.length > 0 && (
              <div className="mb-8">
                <NFTGridCard
                  nfts={otherNFTsData}
                  title="NFT Marketplace"
                  initialCount={6}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={(page) => fetchOtherNFTs(page, 1)}
                />
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {tierNFTs.length === 0 && otherNFTs.length === 0 && (
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
