"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, Eye, Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock NFT data
const mockNFTs = [
  {
    id: "1",
    name: "Bronze Tier NFT",
    type: "tier" as const,
    rarity: "Common" as const,
    price: "50 CAN",
    image: "/tier-bronze.jpg",
    seller: "0x1234...5678",
    purchases: 1247,
  },
  {
    id: "2",
    name: "Silver Tier NFT",
    type: "tier" as const,
    rarity: "Rare" as const,
    price: "250 CAN",
    image: "/tier-silver.jpg",
    seller: "0x2345...6789",
    purchases: 856,
  },
  {
    id: "3",
    name: "Gold Tier NFT",
    type: "tier" as const,
    rarity: "Epic" as const,
    price: "750 CAN",
    image: "/tier-gold.jpg",
    seller: "0x3456...7890",
    purchases: 423,
  },
  {
    id: "4",
    name: "Platinum Tier NFT",
    type: "tier" as const,
    rarity: "Legendary" as const,
    price: "2500 CAN",
    image: "/tier-platinum.jpg",
    seller: "0x4567...8901",
    purchases: 127,
  },
  {
    id: "5",
    name: "Mystery Box NFT",
    type: "other" as const,
    rarity: "Mythic" as const,
    price: "100 CAN",
    image: "/nft-box.jpg",
    seller: "0x5678...9012",
    purchases: 2156,
    sharesSold: 45,
    totalShares: 100,
    totalValue: "10,000 CAN",
    pricePerShare: "100 CAN",
  },
  {
    id: "6",
    name: "Rare Collection NFT",
    type: "other" as const,
    rarity: "Divine" as const,
    price: "500 CAN",
    image: "/nft-box.jpg",
    seller: "0x6789...0123",
    purchases: 89,
    sharesSold: 12,
    totalShares: 50,
    totalValue: "25,000 CAN",
    pricePerShare: "500 CAN",
  },
];

const rarityColors = {
  Common: "bg-gray-500/20 text-gray-300",
  Rare: "bg-blue-500/20 text-blue-300",
  Epic: "bg-purple-500/20 text-purple-300",
  Legendary: "bg-yellow-500/20 text-yellow-300",
  Mythic: "bg-pink-500/20 text-pink-300",
  Divine: "bg-red-500/20 text-red-300",
};

export default function NFTImagesDemoPage() {
  const router = useRouter();

  // Function to get NFT image from public folder
  const getNFTImage = (nft: (typeof mockNFTs)[0]) => {
    // If it's a tier NFT, use tier images
    if (nft.type === "tier") {
      const tierName = nft.name.toLowerCase();
      if (tierName.includes("bronze")) return "/tier-bronze.jpg";
      if (tierName.includes("silver")) return "/tier-silver.jpg";
      if (tierName.includes("gold")) return "/tier-gold.jpg";
      if (tierName.includes("platinum")) return "/tier-platinum.jpg";
    }

    // For other NFTs, use nft-box.jpg as default
    return "/nft-box.jpg";
  };

  const renderNFTCard = (nft: (typeof mockNFTs)[0]) => {
    const isOtherNFT = nft.type === "other";
    const progressPercentage =
      isOtherNFT && nft.sharesSold && nft.totalShares
        ? (nft.sharesSold / nft.totalShares) * 100
        : 0;

    const nftImage = getNFTImage(nft);

    return (
      <Card
        key={nft.id}
        className="glass overflow-hidden hover:scale-105 transition-all group cursor-pointer"
      >
        {/* Image */}
        <div
          className="relative h-64 overflow-hidden"
          style={{
            backgroundImage: `url('${nftImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Overlay for better content visibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

          {/* Rarity Badge */}
          <Badge
            className={`absolute top-4 right-4 ${
              rarityColors[nft.rarity as keyof typeof rarityColors]
            }`}
          >
            {nft.rarity}
          </Badge>

          {/* Like/Purchase Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm hover:bg-background"
          >
            {isOtherNFT ? (
              <ShoppingBag className="w-4 h-4" />
            ) : (
              <Heart className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Info */}
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-2 truncate">{nft.name}</h3>

          {nft.seller && (
            <div className="text-xs text-muted-foreground mb-3">
              Người bán:{" "}
              <span className="font-mono text-foreground">{nft.seller}</span>
            </div>
          )}

          {isOtherNFT ? (
            // Other NFT specific info
            <>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Giá trị tổng</span>
                  <span className="font-bold text-primary">
                    {nft.totalValue}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Giá/cổ phần</span>
                  <span className="font-semibold">{nft.pricePerShare}</span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Tiến trình bán</span>
                    <span>
                      {nft.sharesSold}/{nft.totalShares} cổ phần
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="text-xs text-primary font-semibold">
                    {progressPercentage.toFixed(1)}% đã bán
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="text-xs text-muted-foreground">Lượt mua</div>
                  <div className="text-sm font-semibold flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3" />
                    {nft.purchases}
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Tier NFT info
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-muted-foreground">Giá</div>
                <div className="text-xl font-bold text-primary">
                  {nft.price}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="default" className="flex-1 gap-2">
              <ShoppingCart className="w-4 h-4" />
              {isOtherNFT ? "Mua cổ phần" : "Mua ngay"}
            </Button>
            <Button variant="outline" size="icon">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-12">
        <Button
          variant="ghost"
          onClick={() => router.push("/examples")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">NFT Images Demo</span>
            </h1>
            <p className="text-muted-foreground">
              Sử dụng ảnh từ thư mục public cho NFT cards
            </p>
          </div>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {mockNFTs.map((nft, index) => (
              <div key={nft.id} style={{ animationDelay: `${index * 0.1}s` }}>
                {renderNFTCard(nft)}
              </div>
            ))}
          </div>

          {/* Available Images Showcase */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Available Images in Public Folder
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: "Tier Bronze", image: "/tier-bronze.jpg" },
                { name: "Tier Silver", image: "/tier-silver.jpg" },
                { name: "Tier Gold", image: "/tier-gold.jpg" },
                { name: "Tier Platinum", image: "/tier-platinum.jpg" },
                { name: "NFT Box", image: "/nft-box.jpg" },
              ].map((item) => (
                <Card key={item.name} className="glass">
                  <CardContent className="p-4 text-center">
                    <div
                      className="w-20 h-20 mx-auto rounded-lg mb-3 relative overflow-hidden"
                      style={{
                        backgroundImage: `url('${item.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
                    </div>
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.image}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Usage Examples */}
          <Card className="glass">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-4">
                Cách sử dụng NFT Images
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    1. NFT Image Mapping Function
                  </h4>
                  <code className="text-xs bg-muted p-2 rounded block">
                    {`const getNFTImage = (nft: NFT) => {
  // If it's a tier NFT, use tier images
  if (nft.type === "tier") {
    const tierName = nft.name.toLowerCase();
    if (tierName.includes("bronze")) return "/tier-bronze.jpg";
    if (tierName.includes("silver")) return "/tier-silver.jpg";
    if (tierName.includes("gold")) return "/tier-gold.jpg";
    if (tierName.includes("platinum")) return "/tier-platinum.jpg";
  }
  
  // For other NFTs, use nft-box.jpg as default
  return "/nft-box.jpg";
};`}
                  </code>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    2. Background Image Implementation
                  </h4>
                  <code className="text-xs bg-muted p-2 rounded block">
                    {`<div
  className="relative h-64 overflow-hidden"
  style={{
    backgroundImage: \`url('\${nftImage}')\`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>
  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
</div>`}
                  </code>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">3. Available Images</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• /tier-bronze.jpg - Bronze tier NFT image</li>
                    <li>• /tier-silver.jpg - Silver tier NFT image</li>
                    <li>• /tier-gold.jpg - Gold tier NFT image</li>
                    <li>• /tier-platinum.jpg - Platinum tier NFT image</li>
                    <li>• /nft-box.jpg - Default NFT box image</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
