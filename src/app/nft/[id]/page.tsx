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
import { NFT, NFTService } from "@/api/services/nft-service";

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
  const [loading, setLoading] = useState(true);
  const [nftData, setNftData] = useState<NFT | null>(null);
  const resolvedParams = use(params);
  const id = resolvedParams?.id;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    NFTService.getNFTById(id)
      .then((res) => {
        if (res.success && res.data) setNftData(res.data);
        else setNftData(null);
      })
      .catch(() => setNftData(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!nftData) {
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
          {/* Image section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden glass flex items-center justify-center">
              {nftData.image ? (
                <img
                  src={nftData.image}
                  alt={nftData.name ?? "NFT"}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  No image
                </div>
              )}
            </div>
            <div className="glass rounded-xl p-4 flex flex-col gap-2">
              <div>
                <span className="text-xs text-muted-foreground">ID NFT:</span>{" "}
                <span className="font-mono">
                  {nftData.tokenId ?? "Không rõ"}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Tạo lúc:</span>{" "}
                {(() => {
                  try {
                    return new Date(nftData.createdAt).toLocaleString();
                  } catch {
                    return "Không rõ";
                  }
                })()}
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Cập nhật:</span>{" "}
                {(() => {
                  try {
                    return new Date(nftData.updatedAt).toLocaleString();
                  } catch {
                    return "Không rõ";
                  }
                })()}
              </div>
            </div>
          </div>

          {/* Details section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {nftData.name ?? "Không rõ"}
              </h1>
              <p className="text-muted-foreground mb-3">
                {nftData.description ?? "Không có mô tả"}
              </p>
              <div className="flex flex-wrap gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">
                    Người tạo:{" "}
                  </span>
                  <span className="font-mono">
                    {nftData.creator
                      ? typeof nftData.creator === "object" &&
                        nftData.creator !== null
                        ? (nftData.creator as any).address ?? "Không rõ"
                        : nftData.creator
                      : "Không rõ"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    Chủ sở hữu:{" "}
                  </span>
                  <span className="font-mono">
                    {nftData.owner
                      ? typeof nftData.owner === "object" &&
                        nftData.owner !== null
                        ? (nftData.owner as any).address ?? "Không rõ"
                        : nftData.owner
                      : "Không rõ"}
                  </span>
                </div>
              </div>
            </div>
            {/* Price */}
            <div className="glass rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-1">Giá bán</div>
              <div className="text-3xl font-bold gradient-text">
                {nftData.price !== undefined && nftData.price !== null ? (
                  `${nftData.price} ETH`
                ) : (
                  <span className="text-lg italic text-gray-400">
                    Chưa niêm yết
                  </span>
                )}
              </div>
              <div className="mt-2 text-xs">
                {nftData.isForSale ? "Đang mở bán" : "Không còn bán"}
              </div>
            </div>
            {/* Attributes */}
            {Array.isArray(nftData.attributes) &&
              nftData.attributes.length > 0 && (
                <div className="glass rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-2">Thuộc tính NFT</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {nftData.attributes.map((attr, idx) => (
                      <div
                        key={idx}
                        className="bg-muted/20 rounded-lg p-3 text-center"
                      >
                        <div className="text-xs text-muted-foreground mb-1">
                          {attr.trait_type ?? "Không rõ"}
                        </div>
                        <div className="font-semibold">{attr.value ?? "-"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            {/* Metadata (if exists) */}
            {nftData.metadata && (
              <div className="glass rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-2">Metadata</h3>
                <pre className="bg-muted text-xs rounded p-2 overflow-auto max-h-60">
                  {(() => {
                    try {
                      return JSON.stringify(nftData.metadata, null, 2);
                    } catch {
                      return "Không đọc được metadata";
                    }
                  })()}
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
