"use client";

import { useState, useEffect } from "react";
import { NFTFiltersCard, NFTGridCard } from "./components";
import { useNFTData, useNFTFilters, useNFTStats } from "./hooks";
import { LoadingSpinner } from "@/lib/loadingSpinner";
import { NFTMarketHeaderCardMarketNft } from "./components/NFTMarketHeaderCardMarketNft";

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
                <NFTGridCard
                  nfts={otherNFTsData}
                  title="NFT Marketplace"
                  initialCount={9}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={(page) => fetchOtherNFTs(page, 9)}
                />
                <NFTGridCard
                  nfts={mysteryBoxData}
                  title="NFT Hộp bí ẩn"
                  initialCount={9}
                  totalPages={mysteryBoxTotalPages}
                  currentPage={mysteryBoxCurrentPage}
                  onPageChange={(page) => fetchMysteryBoxNFTs(page, 9)}
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
