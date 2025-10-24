"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Store, TrendingUp, Zap } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

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

export default function BackgroundDemoPage() {
  const router = useRouter();

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
              <span className="gradient-text">Background Image Demo</span>
            </h1>
            <p className="text-muted-foreground">
              Sử dụng nft-box.jpg làm background cho NFT components
            </p>
          </div>

          {/* Mystery Boxes Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Package className="w-8 h-8 text-primary" />
                <h3 className="text-3xl font-bold">
                  Mystery Boxes với Background
                </h3>
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
                    {/* Box Image with nft-box.jpg background */}
                    <div
                      className={`relative h-64 rounded-xl bg-gradient-to-br ${box.color} mb-6 overflow-hidden group`}
                      style={{
                        backgroundImage: `url('/nft-box.jpg')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      {/* Overlay for better text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60"></div>
                      {/* Color overlay based on box type */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${box.color} opacity-30`}
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
                <h3 className="text-3xl font-bold">
                  P2P Marketplace với Background
                </h3>
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
                    {/* NFT Image with nft-box.jpg background */}
                    <div
                      className="relative h-64 overflow-hidden"
                      style={{
                        backgroundImage: `url('/nft-box.jpg')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      {/* Overlay for better content visibility */}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50"></div>
                      {/* Dynamic color overlay based on NFT index */}
                      <div
                        className={`absolute inset-0 ${
                          index === 0
                            ? "bg-gradient-to-br from-primary/40 to-primary/20"
                            : index === 1
                            ? "bg-gradient-to-br from-secondary/40 to-secondary/20"
                            : "bg-gradient-to-br from-accent/40 to-accent/20"
                        }`}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="w-24 h-24 text-white/90 drop-shadow-lg" />
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

          {/* Color Overlay Examples */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Các loại Color Overlay
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Primary Overlay */}
              <Card className="glass">
                <CardContent className="p-0">
                  <div
                    className="relative h-48 overflow-hidden"
                    style={{
                      backgroundImage: `url('/nft-box.jpg')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-primary/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="w-16 h-16 text-white/90 drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold">Primary Overlay</h4>
                    <p className="text-sm text-muted-foreground">
                      Cyan gradient overlay
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Secondary Overlay */}
              <Card className="glass">
                <CardContent className="p-0">
                  <div
                    className="relative h-48 overflow-hidden"
                    style={{
                      backgroundImage: `url('/nft-box.jpg')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 to-secondary/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="w-16 h-16 text-white/90 drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold">Secondary Overlay</h4>
                    <p className="text-sm text-muted-foreground">
                      Purple gradient overlay
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Accent Overlay */}
              <Card className="glass">
                <CardContent className="p-0">
                  <div
                    className="relative h-48 overflow-hidden"
                    style={{
                      backgroundImage: `url('/nft-box.jpg')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/40 to-accent/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="w-16 h-16 text-white/90 drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold">Accent Overlay</h4>
                    <p className="text-sm text-muted-foreground">
                      Purple accent overlay
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Usage Examples */}
          <Card className="glass mt-8">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-4">
                Cách sử dụng Color Overlays
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    1. Basic Background Image
                  </h4>
                  <code className="text-xs bg-muted p-2 rounded block">
                    {`style={{
  backgroundImage: 'url("/nft-box.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}}`}
                  </code>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    2. Dark Overlay cho Text Visibility
                  </h4>
                  <code className="text-xs bg-muted p-2 rounded block">
                    {`<div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50"></div>`}
                  </code>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    3. Color Overlay dựa trên Box Type
                  </h4>
                  <code className="text-xs bg-muted p-2 rounded block">
                    {`<div className={\`absolute inset-0 bg-gradient-to-br \${box.color} opacity-30\`}></div>`}
                  </code>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    4. Dynamic Color Overlay cho NFT Index
                  </h4>
                  <code className="text-xs bg-muted p-2 rounded block">
                    {`<div className={\`absolute inset-0 \${
                      index === 0 ? 'bg-gradient-to-br from-primary/40 to-primary/20' :
                      index === 1 ? 'bg-gradient-to-br from-secondary/40 to-secondary/20' :
                      'bg-gradient-to-br from-accent/40 to-accent/20'
                    }\`}></div>`}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
