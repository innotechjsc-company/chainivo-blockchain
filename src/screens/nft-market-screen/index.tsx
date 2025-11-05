"use client";

import { useState, useEffect } from "react";
import { NFTMarketHeaderCard, NFTFiltersCard, NFTGridCard } from "./components";
import { useNFTData, useNFTFilters, useNFTStats } from "./hooks";

export default function NFTMarketScreen() {
  const [isLoading, setIsLoading] = useState(true);
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
  } = useNFTFilters(nfts);

  // Set loading to false when data is loaded
  useEffect(() => {
    // Check if all data is loaded
    if (nfts && nfts.length >= 0 && stats && volumeData && priceData) {
      setIsLoading(false);
    }
  }, [nfts, stats, volumeData, priceData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="glass border border-cyan-500/20 rounded-lg p-8 flex flex-col items-center gap-4 max-w-sm">
            {/* Spinner */}
            <svg
              className="animate-spin h-12 w-12 text-cyan-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>

            {/* Text */}
            <div className="text-center space-y-2">
              <h3 className="text-white font-semibold text-lg">
                Đang tải NFT Marketplace
              </h3>
              <p className="text-muted-foreground text-sm">
                Vui lòng chờ trong giây lát...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-background/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 animate-pulse"></div>
            </div>
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
            {filters.type !== "other" && tierNFTs.length > 0 && (
              <NFTGridCard
                nfts={userNFTs}
                title="NFT của tôi"
                initialCount={3}
              />
            )}

            {/* Other NFTs */}
            {filters.type !== "tier" && otherNFTs.length > 0 && (
              <>
                <div className="mb-8">
                  <NFTGridCard
                    nfts={otherNFTsData}
                    title="NFT Khác"
                    initialCount={6}
                  />
                </div>
              </>
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
