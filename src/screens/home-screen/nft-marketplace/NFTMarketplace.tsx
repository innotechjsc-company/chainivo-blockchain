"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import NFTService from "@/api/services/nft-service";
import { isAuthenticated } from "@/utils/auth-helper";

export const NFTMarketplace = () => {
  const router = useRouter();
  const [featuredNFTs, setFeaturedNFTs] = useState<any[]>([]);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(true);
  const [dataAnalytics, setDataAnalytics] = useState<any>(null);

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

          // Get only first 3 NFTs as featured
          setFeaturedNFTs(nfts.slice(0, 3));
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

  // Helper function to format address
  const formatAddress = (address?: string) => {
    if (!address) return "N/A";
    const start = address.slice(0, 6);
    const end = address.slice(-4);
    return `${start}...${end}`;
  };

  // Helper function to format price
  const formatPrice = (nft: any) => {
    if (nft.currentPrice?.amount) {
      return `${Number(nft.currentPrice.amount).toLocaleString()} ${
        nft.currentPrice.currency || "CAN"
      }`;
    }
    if (nft.price) {
      if (typeof nft.price === "string") return nft.price;
      return `${Number(nft.price).toLocaleString()} CAN`;
    }
    return "Thương lượng";
  };

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

        {/* P2P Marketplace Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Store className="w-8 h-8 text-primary" />
              <h3 className="text-3xl font-bold">P2P Marketplace</h3>
            </div>
            <Button variant="outline">
              Xem tất cả
              <TrendingUp className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {isLoadingNFTs ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Đang tải dữ liệu NFT...</p>
            </div>
          ) : featuredNFTs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Không có NFT nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredNFTs.map((nft, index) => (
                <Card
                  key={nft.id || nft._id || nft.tokenId || index}
                  className="glass rounded-2xl overflow-hidden hover:scale-105 transition-all animate-fade-in group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-0">
                    {/* NFT Image */}
                    <div
                      className="relative h-64 overflow-hidden cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/nft/${nft.id || nft._id || nft.tokenId}?type=other`
                        )
                      }
                      style={{
                        backgroundImage: `url("/nft-box.jpg")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      {/* Overlay for better content visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                    </div>

                    {/* NFT Info */}
                    <div className="p-6">
                      <h4 className="text-xl font-bold mb-2 truncate">
                        {nft.name || "Unnamed NFT"}
                      </h4>

                      {nft?.owner?.address && (
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Người bán
                            </div>
                            <div className="text-sm font-mono">
                              {formatAddress(nft.owner.address)}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Giá hiện tại
                          </div>
                          <div className="text-2xl font-bold text-primary">
                            {formatPrice(nft)}
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        variant="default"
                        onClick={() =>
                          router.push(
                            `/nft/${
                              nft.id || nft._id || nft.tokenId
                            }?type=other`
                          )
                        }
                      >
                        Mua ngay
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-12 glass rounded-2xl p-8">
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
        </div>
      </div>
    </section>
  );
};
