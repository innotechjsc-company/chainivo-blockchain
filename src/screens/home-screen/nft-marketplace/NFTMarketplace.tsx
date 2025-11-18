"use client";

import { useState, useEffect } from "react";
import NFTService from "@/api/services/nft-service";
import { isAuthenticated } from "@/utils/auth-helper";
import { useNFTFilters } from "@/screens/nft-market-screen/hooks/useNFTFilters";
import { NFTCarouselCard } from "@/screens/nft-market-screen/components";
import { toast } from "sonner";

export const NFTMarketplace = () => {
  const [featuredNFTs, setFeaturedNFTs] = useState<any[]>([]);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(true);
  const [dataAnalytics, setDataAnalytics] = useState<any>(null);

  // Use hook to fetch mystery box NFTs
  const {
    mysteryBoxData,
    loading,
  } = useNFTFilters([], true);

  // Fetch featured NFTs from API - similar to otherNFTsData
  useEffect(() => {
    const fetchFeaturedNFTs = async () => {
      try {
        setIsLoadingNFTs(true);

        // Kiểm tra authentication trước khi gọi API
        if (!isAuthenticated()) {
          console.warn("User not authenticated, skipping NFT fetch");
          setFeaturedNFTs([]);
          setIsLoadingNFTs(false);
          return;
        }

        const response = await NFTService.allNFTInMarketplace();
        if (response.success) {
          const data: any = response.data as any;

          // Handle different response structures (same as useNFTFilters)
          let nfts: any[] = [];
          if (data?.nfts || data?.items) {
            nfts = data.nfts || data.items || [];
            if (data.analytics) {
              setDataAnalytics(data.analytics);
            }
          } else if (Array.isArray(data)) {
            nfts = data;
            if ((response as any).analytics) {
              setDataAnalytics((response as any).analytics);
            }
          } else if (data?.data) {
            nfts = data.data?.nfts || data.data?.items || data.data || [];
            if (data.data?.analytics || data.analytics) {
              setDataAnalytics(data.data?.analytics || data.analytics);
            }
          } else {
            nfts = data || [];
            if (data?.analytics) {
              setDataAnalytics(data.analytics);
            } else if ((response as any).analytics) {
              setDataAnalytics((response as any).analytics);
            }
          }

          // Get all NFTs for random rotation
          setFeaturedNFTs(nfts);
        } else {
          toast.error(response.message || "Không thể tải dữ liệu NFT");
          setFeaturedNFTs([]);
        }
      } catch (error) {
        console.error("Error fetching featured NFTs:", error);
        toast.error("Lỗi khi tải dữ liệu NFT");
        setFeaturedNFTs([]);
      } finally {
        setIsLoadingNFTs(false);
      }
    };

    fetchFeaturedNFTs();
  }, []);

  return (
    <section id="nft" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">NFT Marketplace</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Mua bán NFT độc quyền trên marketplace
          </p>
        </div>
        {/* nft mysteryBox Section */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Đang tải dữ liệu NFT...</p>
          </div>
        ) : (
          <>
            {mysteryBoxData.length > 0 && (
              <NFTCarouselCard
                nfts={mysteryBoxData}
                title="Hộp bí ấn"
                displayCount={3}
                rotationInterval={5000}
                viewAllLink="/nft-market"
              />
            )}

            {/* P2P Marketplace Section */}
            {!isLoadingNFTs && featuredNFTs.length > 0 && (
              <NFTCarouselCard
                nfts={featuredNFTs}
                title="P2P Marketplace"
                displayCount={3}
                rotationInterval={5000}
                viewAllLink="/p2p-market"
              />
            )}
          </>
        )}

        {/* Stats Section */}
        {/* <div className="mt-12 glass rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">
                {dataAnalytics?.allNFT
                  ? dataAnalytics.allNFT.toLocaleString()
                  : "0"}
              </div>
              <div className="text-sm text-muted-foreground">Tổng NFT</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">
                {dataAnalytics?.allUserCount || "0"}
              </div>
              <div className="text-sm text-muted-foreground">
                Người dùng hoạt động
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">
                {dataAnalytics?.allMoney
                  ? dataAnalytics.allMoney.toLocaleString()
                  : "0"}
              </div>
              <div className="text-sm text-muted-foreground">
                Khối lượng giao dịch
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">
                {dataAnalytics?.priceRange
                  ? dataAnalytics.priceRange.toLocaleString()
                  : "0"}
              </div>
              <div className="text-sm text-muted-foreground">Giá sàn TB</div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};
