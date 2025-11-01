"use client";

import { NFTMarketHeaderCard, NFTFiltersCard, NFTGridCard } from "./components";
import { useNFTData, useNFTFilters, useNFTStats } from "./hooks";

export default function NFTMarketScreen() {
  // 1. Fetch dữ liệu qua hooks
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

  return (
    <div className="min-h-screen bg-background">
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
