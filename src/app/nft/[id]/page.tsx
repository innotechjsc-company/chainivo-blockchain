"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  TrendingUp,
  Clock,
  User,
  ShoppingBag,
  DollarSign,
  TrendingDown,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const rarityColors = {
  Common: "bg-gray-500/20 text-gray-300",
  Rare: "bg-blue-500/20 text-blue-300",
  Epic: "bg-purple-500/20 text-purple-300",
  Legendary: "bg-yellow-500/20 text-yellow-300",
  Mythic: "bg-pink-500/20 text-pink-300",
  Divine: "bg-red-500/20 text-red-300",
};

// Financial data for other NFTs
const revenueData = [
  { month: "T1", revenue: 45000, expenses: 32000, profit: 13000 },
  { month: "T2", revenue: 52000, expenses: 35000, profit: 17000 },
  { month: "T3", revenue: 48000, expenses: 33000, profit: 15000 },
  { month: "T4", revenue: 61000, expenses: 38000, profit: 23000 },
  { month: "T5", revenue: 58000, expenses: 36000, profit: 22000 },
  { month: "T6", revenue: 67000, expenses: 40000, profit: 27000 },
];

const performanceData = [
  { month: "T1", roi: 12.5 },
  { month: "T2", roi: 15.8 },
  { month: "T3", roi: 14.2 },
  { month: "T4", roi: 18.9 },
  { month: "T5", roi: 17.6 },
  { month: "T6", roi: 21.3 },
];

// Chart configuration for shadcn/ui
const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "hsl(var(--primary))",
  },
  profit: {
    label: "Lợi nhuận",
    color: "hsl(var(--secondary))",
  },
  roi: {
    label: "ROI %",
    color: "hsl(var(--primary))",
  },
};

interface NFTDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function NFTDetailPage({ params }: NFTDetailPageProps) {
  const router = useRouter();
  const [purchaseAmount, setPurchaseAmount] = useState<string>("1");
  const [loading, setLoading] = useState(true);

  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);
  const id = resolvedParams?.id;

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Check if it's an "other" type NFT (id >= 5)
  const isOtherNFT = parseInt(id || "0") >= 5;

  // Mock NFT data - in real app, fetch from API
  const nft = {
    id,
    name: isOtherNFT ? "Cyber Punk #4231" : "Gold Tier NFT #1523",
    image: "/placeholder.svg", // Using placeholder since we don't have the actual image
    price: isOtherNFT ? "2.5 ETH" : "0.8 ETH",
    usdPrice: isOtherNFT ? "$5,250" : "$1,680",
    rarity: isOtherNFT ? "Divine" : "Legendary",
    type: isOtherNFT ? "other" : "tier",
    seller: "0x1234...5678",
    owner: "CryptoCollector",
    likes: 892,
    views: 3421,
    description: isOtherNFT
      ? "Một tác phẩm nghệ thuật kỹ thuật số độc đáo, được tạo ra bởi nghệ sĩ nổi tiếng. NFT này mang phong cách Cyber Punk hiện đại với các chi tiết tinh tế và màu sắc sống động."
      : "NFT hạng Gold mang đến đặc quyền cao cấp trong hệ sinh thái. Được bán một lần cho toàn bộ NFT hạng này với quyền lợi và lợi ích đặc biệt.",
    // For other NFTs
    totalValue: "250 ETH",
    pricePerShare: "2.5 ETH",
    sharesSold: 67,
    totalShares: 100,
    purchases: 892,
    attributes: [
      { trait: "Background", value: "Neon City", rarity: "15%" },
      { trait: "Character", value: "Warrior", rarity: "8%" },
      { trait: "Outfit", value: "Cyber Suit", rarity: "12%" },
      { trait: "Weapon", value: "Laser Blade", rarity: "5%" },
      { trait: "Accessory", value: "VR Visor", rarity: "20%" },
    ],
    history: [
      {
        event: "Listed",
        price: isOtherNFT ? "2.5 ETH" : "0.8 ETH",
        from: "0x1234...5678",
        date: "2 giờ trước",
      },
      {
        event: "Transferred",
        from: "0xabcd...efgh",
        to: "0x1234...5678",
        date: "1 ngày trước",
      },
      {
        event: "Minted",
        price: isOtherNFT ? "0.1 ETH" : "0.5 ETH",
        from: "0x0000...0000",
        date: "7 ngày trước",
      },
    ],
  };

  const progressPercentage = (nft.sharesSold / nft.totalShares) * 100;

  const handlePurchase = () => {
    if (isOtherNFT) {
      const shares = parseInt(purchaseAmount) || 1;
      const totalPrice = (
        parseFloat(nft.pricePerShare.split(" ")[0]) * shares
      ).toFixed(2);

      console.log(
        `Purchasing ${shares} shares (${totalPrice} ETH) of ${nft.name}`
      );
    } else {
      console.log(`Purchasing ${nft.name} for ${nft.price}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Không tìm thấy NFT</h1>
            <Button onClick={() => router.push("/nftmarket")}>Quay lại</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-12">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push("/nftmarket")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden glass">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🎨</span>
                  </div>
                  <p className="text-muted-foreground">NFT Image</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full glass backdrop-blur-xl"
                >
                  <Heart className="w-5 h-5" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full glass backdrop-blur-xl"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
              {!isOtherNFT && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary/90 text-white">
                    🏆 Bán 1 lần
                  </Badge>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="glass rounded-xl p-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{nft.views}</div>
                <div className="text-xs text-muted-foreground">Lượt xem</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{nft.likes}</div>
                <div className="text-xs text-muted-foreground">Yêu thích</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {isOtherNFT ? nft.purchases : "1"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isOtherNFT ? "Lượt mua" : "Sở hữu"}
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{nft.name}</h1>
                <Badge
                  className={
                    rarityColors[nft.rarity as keyof typeof rarityColors]
                  }
                >
                  {nft.rarity}
                </Badge>
              </div>
              <p className="text-muted-foreground">{nft.description}</p>
            </div>

            {/* Owner & Seller */}
            <div className="glass rounded-xl p-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Chủ sở hữu
                  </div>
                  <div className="font-semibold">{nft.owner}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Người bán</div>
                  <div className="font-mono text-sm">{nft.seller}</div>
                </div>
              </div>
            </div>

            {/* Price & Buy */}
            <div className="glass rounded-xl p-6">
              {isOtherNFT ? (
                <>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Giá trị tổng
                      </span>
                      <span className="text-xl font-bold gradient-text">
                        {nft.totalValue}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Giá/cổ phần
                      </span>
                      <span className="text-lg font-semibold">
                        {nft.pricePerShare}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Tiến trình bán</span>
                        <span>
                          {nft.sharesSold}/{nft.totalShares} cổ phần
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-3" />
                      <div className="text-sm text-primary font-semibold">
                        {progressPercentage.toFixed(1)}% đã bán
                      </div>
                    </div>
                  </div>

                  {/* Purchase form for shares */}
                  <div className="mb-4">
                    <Label htmlFor="shares">Số cổ phần muốn mua</Label>
                    <Input
                      id="shares"
                      type="number"
                      min="1"
                      max={nft.totalShares - nft.sharesSold}
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(e.target.value)}
                      className="mt-2"
                      placeholder="1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Tổng:{" "}
                      {(
                        parseFloat(nft.pricePerShare.split(" ")[0]) *
                        (parseInt(purchaseAmount) || 1)
                      ).toFixed(2)}{" "}
                      ETH
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      size="lg"
                      className="flex-1 gap-2"
                      onClick={handlePurchase}
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Mua cổ phần
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      Giá hiện tại
                    </div>
                    <div className="flex items-baseline gap-3">
                      <div className="text-4xl font-bold gradient-text">
                        {nft.price}
                      </div>
                      <div className="text-xl text-muted-foreground">
                        {nft.usdPrice}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      💎 NFT hạng này được bán một lần cho toàn bộ quyền sở hữu
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      size="lg"
                      className="flex-1 gap-2"
                      onClick={handlePurchase}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Mua ngay
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Attributes */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Thuộc tính</h3>
              <div className="grid grid-cols-2 gap-3">
                {nft.attributes.map((attr) => (
                  <div
                    key={attr.trait}
                    className="bg-muted/20 rounded-lg p-3 text-center"
                  >
                    <div className="text-xs text-muted-foreground mb-1">
                      {attr.trait}
                    </div>
                    <div className="font-semibold">{attr.value}</div>
                    <div className="text-xs text-primary mt-1">
                      {attr.rarity} độ hiếm
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* History */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Lịch sử giao dịch</h3>
              <div className="space-y-3">
                {nft.history.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-semibold">{item.event}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.from}
                          {item.to && ` → ${item.to}`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.price || "-"}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Report for Other NFTs */}
        {isOtherNFT && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 gradient-text">
                Báo cáo tài chính
              </h2>
              <p className="text-muted-foreground">
                Thông tin chi tiết về doanh thu và lợi nhuận của NFT
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Doanh thu TB
                      </p>
                      <p className="text-2xl font-bold">$55.2K</p>
                    </div>
                  </div>
                  <p className="text-xs text-primary flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +12.5% từ tháng trước
                  </p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-8 h-8 text-secondary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Lợi nhuận TB
                      </p>
                      <p className="text-2xl font-bold">$19.5K</p>
                    </div>
                  </div>
                  <p className="text-xs text-secondary flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +18.3% từ tháng trước
                  </p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingDown className="w-8 h-8 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Chi phí TB
                      </p>
                      <p className="text-2xl font-bold">$35.7K</p>
                    </div>
                  </div>
                  <p className="text-xs text-accent flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +8.2% từ tháng trước
                  </p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">ROI TB</p>
                      <p className="text-2xl font-bold">16.7%</p>
                    </div>
                  </div>
                  <p className="text-xs text-primary flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +2.1% từ tháng trước
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Doanh thu & Lợi nhuận (6 tháng)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={chartConfig}
                    className="h-[300px] w-full"
                  >
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value, name) => {
                              if (name === "revenue")
                                return [`$${value}`, "Doanh thu"];
                              if (name === "profit")
                                return [`$${value}`, "Lợi nhuận"];
                              return [value, name];
                            }}
                          />
                        }
                      />
                      <Bar
                        dataKey="revenue"
                        fill="var(--color-revenue)"
                        name="revenue"
                      />
                      <Bar
                        dataKey="profit"
                        fill="var(--color-profit)"
                        name="profit"
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>ROI theo thời gian (%)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={chartConfig}
                    className="h-[300px] w-full"
                  >
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value, name) => {
                              if (name === "roi") return [`${value}%`, "ROI"];
                              return [value, name];
                            }}
                          />
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="roi"
                        stroke="var(--color-roi)"
                        strokeWidth={3}
                        dot={{ fill: "var(--color-roi)", strokeWidth: 2, r: 4 }}
                        name="roi"
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Financial Timeline */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Dòng thời gian tài chính</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {revenueData
                    .slice()
                    .reverse()
                    .map((data, index) => (
                      <div
                        key={index}
                        className="relative pl-8 pb-6 border-l-2 border-primary/30 last:pb-0"
                      >
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                        <div className="glass rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold">Tháng {data.month}</h4>
                            <Badge variant="outline">Đã hoàn thành</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Doanh thu</p>
                              <p className="font-bold text-primary">
                                ${data.revenue.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Chi phí</p>
                              <p className="font-bold text-accent">
                                ${data.expenses.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Lợi nhuận</p>
                              <p className="font-bold text-secondary">
                                ${data.profit.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
