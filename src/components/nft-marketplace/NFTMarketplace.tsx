"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Store, TrendingUp, Zap } from "lucide-react";

const mysteryBoxes = [
  {
    name: "Basic Box",
    price: "0.1 ETH",
    rarity: "Common",
    chance: "70% Common, 25% Rare, 5% Epic",
    color: "from-gray-500 to-gray-700",
  },
  {
    name: "Premium Box",
    price: "0.5 ETH",
    rarity: "Rare",
    chance: "40% Rare, 40% Epic, 20% Legendary",
    color: "from-blue-500 to-purple-600",
  },
  {
    name: "Legendary Box",
    price: "1.5 ETH",
    rarity: "Legendary",
    chance: "50% Epic, 40% Legendary, 10% Mythic",
    color: "from-yellow-400 to-red-600",
  },
];

const featuredNFTs = [
  {
    id: 1,
    name: "Cyber Punk #4231",
    price: "2.5 ETH",
    seller: "0x1234...5678",
  },
  {
    id: 2,
    name: "Digital Warrior #892",
    price: "1.8 ETH",
    seller: "0xabcd...efgh",
  },
  {
    id: 3,
    name: "Future Vision #156",
    price: "3.2 ETH",
    seller: "0x9876...5432",
  },
];

export const NFTMarketplace = () => {
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mysteryBoxes.map((box, index) => (
              <Card
                key={box.name}
                className="glass rounded-2xl p-6 hover:scale-105 transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  {/* Box Image */}
                  <div
                    className={`relative h-64 rounded-xl bg-gradient-to-br ${box.color} mb-6 overflow-hidden group`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="w-24 h-24 text-white animate-float" />
                    </div>
                    {/* Rarity Badge */}
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                      {box.rarity}
                    </div>
                  </div>

                  {/* Box Info */}
                  <h4 className="text-2xl font-bold mb-2">{box.name}</h4>
                  <div className="text-3xl font-bold text-primary mb-4">
                    {box.price}
                  </div>

                  <div className="bg-muted/20 rounded-lg p-3 mb-4">
                    <div className="text-xs text-muted-foreground mb-1">
                      Tỷ lệ rơi:
                    </div>
                    <div className="text-sm">{box.chance}</div>
                  </div>

                  <Button className="w-full" variant="default">
                    Mở hộp ngay
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredNFTs.map((nft, index) => (
              <Card
                key={nft.id}
                className="glass rounded-2xl overflow-hidden hover:scale-105 transition-all animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  {/* NFT Image */}
                  <div className="relative h-64 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Package className="w-24 h-24 text-primary/50" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                  </div>

                  {/* NFT Info */}
                  <div className="p-6">
                    <h4 className="text-xl font-bold mb-2">{nft.name}</h4>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Người bán
                        </div>
                        <div className="text-sm font-mono">{nft.seller}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Giá hiện tại
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          {nft.price}
                        </div>
                      </div>
                    </div>

                    <Button className="w-full" variant="default">
                      Mua ngay
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 glass rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">
                15,234
              </div>
              <div className="text-sm text-muted-foreground">NFT đã bán</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">2,456</div>
              <div className="text-sm text-muted-foreground">
                Người dùng tích cực
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">$8.5M</div>
              <div className="text-sm text-muted-foreground">
                Khối lượng giao dịch
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">156</div>
              <div className="text-sm text-muted-foreground">Collections</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
