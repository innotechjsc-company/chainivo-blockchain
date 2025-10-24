"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Zap, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock NFT data
const mockNFTs = [
  {
    id: "1",
    name: "Bronze Tier NFT",
    value: 5000,
    image: "/tier-bronze.jpg",
  },
  {
    id: "2",
    name: "Silver Tier NFT",
    value: 15000,
    image: "/tier-silver.jpg",
  },
  {
    id: "3",
    name: "Gold Tier NFT",
    value: 50000,
    image: "/tier-gold.jpg",
  },
  {
    id: "4",
    name: "Platinum Tier NFT",
    value: 150000,
    image: "/tier-platinum.jpg",
  },
];

export default function NFTStakingHeroDemoPage() {
  const router = useRouter();
  const [selectedNFTId, setSelectedNFTId] = useState("");
  const apy = 15;

  const selectedNFT = mockNFTs.find((nft) => nft.id === selectedNFTId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Staking NFT:", selectedNFT);
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

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">
                NFT Staking Hero Background Demo
              </span>
            </h1>
            <p className="text-muted-foreground">
              Sử dụng staking-nft-hero.jpg làm background cho NFT staking form
            </p>
          </div>

          {/* NFT Staking Form with Hero Background */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">
              NFT Staking Form với Hero Background
            </h3>
            <Card className="staking-card overflow-hidden border-primary/30 shadow-lg">
              <div
                className="relative h-48 overflow-hidden"
                style={{
                  backgroundImage: `url('/staking-nft-hero.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* Overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold mb-1 text-white drop-shadow-lg">
                    Stake NFT
                  </h3>
                  <p className="text-white/90 drop-shadow-lg">
                    APY {apy}% - Phần thưởng cao hơn
                  </p>
                </div>
              </div>

              <CardContent className="staking-card-content pt-6 space-y-4">
                <form
                  onSubmit={handleSubmit}
                  className="staking-form space-y-4"
                >
                  <div>
                    <Label
                      htmlFor="nft-select"
                      className="text-sm font-medium mb-2 block"
                    >
                      Chọn NFT để stake
                    </Label>
                    <Select
                      value={selectedNFTId}
                      onValueChange={setSelectedNFTId}
                    >
                      <SelectTrigger className="w-full h-12 text-lg">
                        <SelectValue placeholder="-- Chọn NFT --" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockNFTs.map((nft) => (
                          <SelectItem key={nft.id} value={nft.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{nft.name}</span>
                              <span className="text-muted-foreground ml-2">
                                ({nft.value.toLocaleString()} CAN)
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedNFT && (
                    <div className="p-4 bg-green-500/10 rounded-lg space-y-2 border border-green-500/20 animate-fade-in">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500">
                          Dự kiến phần thưởng
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Giá trị NFT:</span>
                        <span className="font-bold">
                          {selectedNFT.value.toLocaleString()} CAN
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            7 ngày
                          </p>
                          <p className="text-sm font-bold text-green-500">
                            {(
                              (selectedNFT.value * apy * 7) /
                              (365 * 100)
                            ).toFixed(2)}{" "}
                            CAN
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            30 ngày
                          </p>
                          <p className="text-sm font-bold text-green-500">
                            {(
                              (selectedNFT.value * apy * 30) /
                              (365 * 100)
                            ).toFixed(2)}{" "}
                            CAN
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            365 ngày
                          </p>
                          <p className="text-sm font-bold text-green-500">
                            {((selectedNFT.value * apy) / 100).toFixed(2)} CAN
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="staking-form-actions">
                    <Button
                      type="submit"
                      className="w-full h-12 text-lg"
                      disabled={!selectedNFT}
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Stake NFT Ngay
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Background Image Showcase */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-6 text-center">
              NFT Staking Hero Background
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Image */}
              <Card className="glass">
                <CardContent className="p-0">
                  <div
                    className="relative h-64 overflow-hidden"
                    style={{
                      backgroundImage: `url('/staking-nft-hero.jpg')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h4 className="text-xl font-bold mb-2">
                          Original Image
                        </h4>
                        <p className="text-sm opacity-90">
                          staking-nft-hero.jpg
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold">Original Background</h4>
                    <p className="text-sm text-muted-foreground">
                      Raw staking-nft-hero.jpg image
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* With Overlay */}
              <Card className="glass">
                <CardContent className="p-0">
                  <div
                    className="relative h-64 overflow-hidden"
                    style={{
                      backgroundImage: `url('/staking-nft-hero.jpg')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-xl font-bold text-white drop-shadow-lg">
                        Stake NFT
                      </h4>
                      <p className="text-white/90 drop-shadow-lg">
                        APY 15% - Phần thưởng cao hơn
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold">With Overlay & Text</h4>
                    <p className="text-sm text-muted-foreground">
                      Background với overlay và text content
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Comparison with Coin Staking */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-6 text-center">
              So sánh Coin vs NFT Staking
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coin Staking */}
              <Card className="glass">
                <CardContent className="p-0">
                  <div
                    className="relative h-48 overflow-hidden"
                    style={{
                      backgroundImage: `url('/staking-coin-hero.jpg')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-xl font-bold text-white drop-shadow-lg">
                        Stake CAN Token
                      </h4>
                      <p className="text-white/90 drop-shadow-lg">
                        APY 12% - Nhận thưởng liên tục
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold">Coin Staking</h4>
                    <p className="text-sm text-muted-foreground">
                      staking-coin-hero.jpg background
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* NFT Staking */}
              <Card className="glass">
                <CardContent className="p-0">
                  <div
                    className="relative h-48 overflow-hidden"
                    style={{
                      backgroundImage: `url('/staking-nft-hero.jpg')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-xl font-bold text-white drop-shadow-lg">
                        Stake NFT
                      </h4>
                      <p className="text-white/90 drop-shadow-lg">
                        APY 15% - Phần thưởng cao hơn
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold">NFT Staking</h4>
                    <p className="text-sm text-muted-foreground">
                      staking-nft-hero.jpg background
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Usage Examples */}
          <Card className="glass">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-4">
                Cách sử dụng NFT Staking Hero Background
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    1. Background Image Implementation
                  </h4>
                  <code className="text-xs bg-muted p-2 rounded block">
                    {`<div 
  className="relative h-48 overflow-hidden"
  style={{
    backgroundImage: \`url('/staking-nft-hero.jpg')\`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>
  {/* Overlay for better text visibility */}
  <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60"></div>
  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
  <div className="absolute bottom-4 left-4 right-4">
    <h3 className="text-2xl font-bold mb-1 text-white drop-shadow-lg">Stake NFT</h3>
    <p className="text-white/90 drop-shadow-lg">
      APY {apy}% - Phần thưởng cao hơn
    </p>
  </div>
</div>`}
                  </code>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. Overlay System</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      • Dark overlay: `bg-gradient-to-br from-black/40
                      to-black/60`
                    </li>
                    <li>
                      • Bottom gradient: `bg-gradient-to-t from-background
                      to-transparent`
                    </li>
                    <li>• Text styling: `text-white drop-shadow-lg`</li>
                    <li>• Subtitle styling: `text-white/90 drop-shadow-lg`</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">3. Benefits</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Visual appeal với NFT-themed hero background</li>
                    <li>• Better text contrast với overlay system</li>
                    <li>• Professional look cho NFT staking interface</li>
                    <li>• Consistent branding với NFT staking theme</li>
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
