"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, ArrowLeft } from "lucide-react";
import NFTService from "@/api/services/nft-service";
import { config } from "@/api/config";
import { getLevelBadge, getNFTType } from "@/lib/utils";

export default function InvestmentNFTDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  const formatAmount = (value: unknown) => {
    const num = Number(value || 0);
    if (Number.isNaN(num)) return String(value ?? "-");
    return num.toLocaleString("en-US");
  };

  const formatAddress = (address?: string) => {
    if (!address) return "";
    const start = address.slice(0, 6);
    const end = address.slice(-4);
    return `${start}...${end}`;
  };

  const getImageUrl = (imageData: any): string | null => {
    if (!imageData) return null;
    let imageUrl: string | undefined;
    if (typeof imageData === "string") imageUrl = imageData;
    else if (imageData?.url) imageUrl = imageData.url;
    else if (imageData?.image)
      imageUrl =
        typeof imageData.image === "string"
          ? imageData.image
          : imageData.image?.url;
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))
      return imageUrl;
    const base = config.API_BASE_URL.endsWith("/")
      ? config.API_BASE_URL.slice(0, -1)
      : config.API_BASE_URL;
    const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    return `${base}${path}`;
  };

  const imageSrc = useMemo(() => {
    return (
      getImageUrl(data?.image || data?.imageUrl || data?.image_url) ||
      (data?.type === "tier" ? "/tier-gold.jpg" : "/nft-box.jpg")
    );
  }, [data]);

  const sharesSold: number = Number(data?.soldShares ?? data?.sharesSold ?? 0);
  const totalShares: number = Number(data?.totalShares ?? 0);
  const progress = totalShares > 0 ? (sharesSold / totalShares) * 100 : 0;
  const pricePerShare: number = Number(data?.pricePerShare ?? 0);
  const totalCost = Math.max(1, quantity) * (pricePerShare || 0);
  const currency = String((data?.currency || "ETH").toUpperCase());

  useEffect(() => {
    const id = String(params?.id || "");
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const resp = await NFTService.getNFTById(id);

        if (resp?.success) setData((resp.data as any) || null);
      } finally {
        setLoading(false);
      }
    })();
  }, [params?.id]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-12">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Image and stats */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="glass overflow-hidden">
              <div className="relative aspect-square rounded-2xl overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt={data?.name || "NFT"}
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src = "/nft-box.jpg")
                  }
                />
                <button
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-background/70 backdrop-blur flex items-center justify-center"
                  aria-label="like"
                >
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </Card>
          </div>

          {/* Right: Detail card */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">
                  {data?.name || "NFT Investment"}
                </h1>
                {data?.level && (
                  <Badge
                    variant="secondary"
                    className="bg-red-500/20 text-red-400 border-red-500/30"
                  >
                    {getLevelBadge(data.level)}
                  </Badge>
                )}
              </div>
              {data?.description && (
                <p className="text-muted-foreground mb-3 leading-relaxed">
                  {data.description}
                </p>
              )}
            </div>

            <Card className="glass">
              <CardContent className="p-5 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Chủ sở hữu
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {data?.owner?.username || "CryptoCollector"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">
                      Người bán
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {formatAddress(data?.walletAddress)}
                    </div>
                  </div>
                </div>

                {/* Pricing section */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground mb-1">
                      Giá trị tổng
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                      {formatAmount(data?.price)} {currency}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Giá/cổ phần
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {formatAmount(pricePerShare)} {currency}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Tiến trình bán
                    </span>
                    {totalShares > 0 && (
                      <span className="text-muted-foreground">
                        {sharesSold}/{totalShares} cổ phần
                      </span>
                    )}
                  </div>
                  <Progress value={progress} className="h-2.5" />
                  <div className="mt-2 text-xs text-cyan-400 font-semibold">
                    {progress.toFixed(1)}% đã bán
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="text-xs text-muted-foreground">
                    Số cổ phần muốn mua
                  </div>
                  <Input
                    type="number"
                    min={1}
                    max={Math.max(
                      1,
                      Number(
                        data?.remainingShares ?? data?.availableShares ?? 1
                      )
                    )}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Number(e.target.value || 1)))
                    }
                    className="bg-background/50 border-cyan-500/30 focus:border-cyan-500/60"
                  />
                  <div className="text-xs text-muted-foreground">
                    Tổng: {formatAmount(totalCost)} {currency}
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold gap-2 h-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  Mua cổ phần
                </Button>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-4 text-white">Thông tin chi tiết</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                    <div className="text-xs text-muted-foreground mb-1">
                      Loại NFT
                    </div>
                    <div className="text-sm font-semibold text-white capitalize">
                      {data?.type || "—"}
                    </div>
                  </div>
                  <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                    <div className="text-xs text-muted-foreground mb-1">
                      Mức độ
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {getLevelBadge(data?.level as string)}
                    </div>
                  </div>
                  {data?.isFractional && (
                    <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                      <div className="text-xs text-muted-foreground mb-1">
                        Tổng cổ phần
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {formatAmount(data?.totalShares)} phần
                      </div>
                    </div>
                  )}
                  {data?.isFractional && (
                    <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                      <div className="text-xs text-muted-foreground mb-1">
                        Cổ phần tối thiểu
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {formatAmount(data?.minSharesPerPurchase)} phần
                      </div>
                    </div>
                  )}
                  <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                    <div className="text-xs text-muted-foreground mb-1">
                      Trạng thái
                    </div>
                    <div className="text-sm font-semibold">
                      {data?.isActive ? (
                        <span className="text-emerald-400">✓ Hoạt động</span>
                      ) : (
                        <span className="text-red-400">✗ Tạm dừng</span>
                      )}
                    </div>
                  </div>
                  <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                    <div className="text-xs text-muted-foreground mb-1">
                      Số nhà đầu tư
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {formatAmount(data?.totalInvestors)} người
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
