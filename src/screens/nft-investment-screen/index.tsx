"use client";

import { NFTMarketHeaderCard, NFTFiltersCard, NFTGridCard } from "./components";
import {
  useNFTData,
  useNFTFilters,
  useNFTStats,
} from "@/screens/nft-market-screen/hooks";

export default function NFTInvestmentScreen() {
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
            <div className="mb-8">
              <NFTGridCard
                nfts={otherNFTsData}
                title="Danh sách NFT đầu tư"
                initialCount={6}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
