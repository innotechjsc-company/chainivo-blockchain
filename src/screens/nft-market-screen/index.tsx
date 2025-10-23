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
  } = useNFTFilters(nfts);

  // 2. Event handlers
  const handleNFTPurchase = (nftId: string) => {
    // TODO: Implement NFT purchase logic
    console.log("Purchase NFT:", nftId);
  };

  const handleNFTView = (nftId: string) => {
    // TODO: Implement NFT view logic
    console.log("View NFT:", nftId);
  };

  // 3. Compose UI
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Market Header */}
        <NFTMarketHeaderCard
          stats={stats}
          volumeData={volumeData}
          priceData={priceData}
        />

        {/* Filters */}
        <NFTFiltersCard
          filters={filters}
          onFiltersChange={setFilters}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={resetFilters}
        />

        {/* Tier NFTs */}
        {filters.type !== "other" && tierNFTs.length > 0 && (
          <NFTGridCard nfts={tierNFTs} title="NFT Hạng" initialCount={3} />
        )}

        {/* Other NFTs */}
        {filters.type !== "tier" && otherNFTs.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6 gradient-text">NFT Khác</h2>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Đang bán</h3>
              <NFTGridCard nfts={otherNFTs} title="" initialCount={6} />
            </div>
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
