"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Store, TrendingUp, Zap } from "lucide-react";
import { useMysteryBoxData } from "@/screens/mystery-box-screen/hooks";
import type { MysteryBoxData } from "@/screens/mystery-box-screen/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import NFTService from "@/api/services/nft-service";

export const NFTMarketplace = () => {
  const router = useRouter();
  const { boxes: mysteryBoxes, isLoading: isLoadingMysteryBoxes } =
    useMysteryBoxData();
  const [featuredNFTs, setFeaturedNFTs] = useState<any[]>([]);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(true);
  const [dataAnalytics, setDataAnalytics] = useState<any>(null);

  // Fetch featured NFTs from API - similar to otherNFTsData
  useEffect(() => {
    const fetchFeaturedNFTs = async () => {
      try {
        setIsLoadingNFTs(true);
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

  // Helper function to get NFT image
  const getNFTImage = (nft: any) => {
    if (nft.image) return nft.image;
    if (nft.type === "tier") {
      const tierName = (nft.name || "").toLowerCase();
      if (tierName.includes("bronze")) return "/tier-bronze.jpg";
      if (tierName.includes("silver")) return "/tier-silver.jpg";
      if (tierName.includes("gold")) return "/tier-gold.jpg";
      if (tierName.includes("platinum")) return "/tier-platinum.jpg";
    }
    return "/nft-box.jpg";
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

  // Handle purchase click - similar to mystery-box-screen
  const handlePurchase = (boxId: string) => {
    const box = mysteryBoxes.find((b) => b.id === boxId);
    if (!box) return;

    if (!box.isUnlimited && box.remainingSupply === 0) {
      toast.error("Hộp này đã hết hàng!");
      return;
    }

    // Navigate to detail page for purchase
    router.push(`/mysterybox/${boxId}`);
  };

  // Helper function to format drop rates
  const formatDropRates = (box: MysteryBoxData): string => {
    if (!box.dropRates) return "N/A";
    const rates = [];
    if (box.dropRates.common > 0) rates.push(`${box.dropRates.common}% Thường`);
    if (box.dropRates.uncommon > 0)
      rates.push(`${box.dropRates.uncommon}% Không phổ biến`);
    if (box.dropRates.rare > 0) rates.push(`${box.dropRates.rare}% Hiếm`);
    if (box.dropRates.epic > 0) rates.push(`${box.dropRates.epic}% Sử thi`);
    if (box.dropRates.legendary > 0)
      rates.push(`${box.dropRates.legendary}% Huyền thoại`);
    return rates.join(", ") || "N/A";
  };

  // Helper function to get color gradient from rarity
  const getRarityColor = (rarity: string): string => {
    switch (rarity.toLowerCase()) {
      case "common":
        return "from-gray-500 to-gray-700";
      case "uncommon":
        return "from-green-500 to-green-700";
      case "rare":
        return "from-blue-500 to-purple-600";
      case "epic":
        return "from-purple-500 to-pink-600";
      case "legendary":
        return "from-yellow-400 to-red-600";
      default:
        return "from-gray-500 to-gray-700";
    }
  };

  return (
    <section id="nft" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">NFT Marketplace</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Mua bán NFT độc quyền và mở rương thần bí để nhận phần thưởng
          </p>
        </div>

        {/* Mystery Boxes Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-primary" />
              <h3 className="text-3xl font-bold">Mystery Boxes</h3>
            </div>
            <Button variant="outline">
              Xem tất cả
              <Zap className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {isLoadingMysteryBoxes ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Đang tải dữ liệu...</p>
            </div>
          ) : mysteryBoxes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Không có Mystery Box nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mysteryBoxes.map((box, index) => (
                <Card
                  key={box.id}
                  className="glass rounded-2xl p-6 hover:scale-105 transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-0">
                    {/* Box Image */}
                    <div
                      className={`relative h-64 rounded-xl bg-gradient-to-br ${getRarityColor(
                        box.rarity
                      )} mb-6 overflow-hidden group`}
                      style={{
                        backgroundImage: `url('${
                          box.image || "/nft-box.jpg"
                        }')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      {/* Overlay for better text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60"></div>
                      {/* Color overlay based on box type */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(
                          box.rarity
                        )} opacity-30`}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="w-24 h-24 text-white animate-float drop-shadow-lg" />
                      </div>
                      {/* Rarity Badge */}
                      <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                        {box.rarity}
                      </div>
                    </div>

                    {/* Box Info */}
                    <h4 className="text-2xl font-bold mb-2">{box.name}</h4>
                    <div className="text-3xl font-bold text-primary mb-4">
                      {box.price.amount.toLocaleString()} {box.price.currency}
                    </div>

                    <div className="bg-muted/20 rounded-lg p-3 mb-4">
                      <div className="text-xs text-muted-foreground mb-1">
                        Tỷ lệ rơi:
                      </div>
                      <div className="text-sm">{formatDropRates(box)}</div>
                    </div>

                    <Button
                      className="w-full"
                      variant="default"
                      onClick={() => handlePurchase(box.id)}
                    >
                      Mở hộp ngay
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
