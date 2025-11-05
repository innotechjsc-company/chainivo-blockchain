"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { NFTService } from "@/api/services/nft-service";
import type { ApiResponse } from "@/api/api";
import { config } from "@/api/config";
import { Spinner } from "@/components/ui/spinner";
import { Eye } from "lucide-react";
import { getLevelBadge, getNFTType } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface CollectionItem {
  id: string;
  name: string;
  icon: string; // emoji/icon placeholder
}

interface MarketItem {
  id: string;
  name: string;
  collection: string;
  salePrice: number;
  currency: string;
  image?: string;
  level: string;
  type: string;
}

const mockCollections: CollectionItem[] = [
  { id: "pancake", name: "Pancake Bunnies", icon: "🥞" },
  { id: "gego", name: "GEGO-V2", icon: "🧩" },
  { id: "treas", name: "Treasurland", icon: "🗝️" },
  { id: "apes", name: "ApeSwap", icon: "🐵" },
  { id: "soul", name: "randomSOUL", icon: "💠" },
  { id: "scv", name: "SCV.finance", icon: "📊" },
];

export default function P2PMarketPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  // filter states
  const [rarity, setRarity] = useState<string>("");
  const [assetType, setAssetType] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [pendingRange, setPendingRange] = useState<[number, number]>([
    0, 1000000,
  ]);
  const router = useRouter();
  // Build full image URL from backend or fallback to default
  const getNFTImage = (nft: any): string => {
    const extract = (imageData: any): string | null => {
      if (!imageData) return null;
      let url: string | undefined;
      if (typeof imageData === "string") url = imageData;
      else if (imageData?.url) url = imageData.url as string;
      else if (imageData?.image) {
        url =
          typeof imageData.image === "string"
            ? imageData.image
            : imageData.image?.url;
      }
      if (!url || url.trim() === "") return null;
      if (url.startsWith("http://") || url.startsWith("https://")) return url;
      const apiBase = config.API_BASE_URL.endsWith("/")
        ? config.API_BASE_URL.slice(0, -1)
        : config.API_BASE_URL;
      const path = url.startsWith("/") ? url : `/${url}`;
      return `${apiBase}${path}`;
    };

    return (
      extract(nft?.image) ||
      extract(nft?.imageUrl) ||
      extract(nft?.image_url) ||
      "/nft-box.jpg"
    );
  };

  // Text color per level: 1 thuong (nau), 2 bac, 3 vang, 4 bach kim, 5 kim cuong
  const getLevelTextClass = (level: string): string => {
    const l = (level || "").toString();
    switch (l) {
      case "1":
        return "text-amber-800";
      case "2":
        return "text-slate-400";
      case "3":
        return "text-yellow-500";
      case "4":
        return "text-indigo-400";
      case "5":
        return "text-cyan-400";
      default:
        return "text-foreground";
    }
  };

  // Fetch P2P list with optional params
  const fetchP2P = async (params?: any) => {
    try {
      setLoading(true);
      setError("");
      const resp: ApiResponse<any> = await NFTService.getP2PList(params);
      if (resp?.success) {
        setItems(resp?.data?.docs);
      } else {
        setItems([]);
        setError(resp?.message || resp?.error || "Không thể tải danh sách");
      }
    } catch (e: any) {
      setError(e?.message || "Không thể tải danh sách");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchP2P();
  }, []);

  const filteredItems = useMemo(() => {
    const source = items.length > 0 ? items : [];
    let result = [...source];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (it) =>
          (it.name ?? "").toLowerCase().includes(q) ||
          (it.collection ?? "").toLowerCase().includes(q)
      );
    }
    if (selectedCollections.length > 0) {
      result = result.filter((it) =>
        selectedCollections.some((c) =>
          (it.collection ?? "").toLowerCase().includes(c)
        )
      );
    }
    // Items đã được sort trong state khi chọn sort option
    // Không cần sort lại ở đây
    return result;
  }, [search, sort, selectedCollections]);

  return (
    <div className="min-h-screen bg-background">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-4 py-3 bg-background/90 rounded-lg border border-primary/20">
            <Spinner className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-primary">
              Đang tải dữ liệu ...
            </span>
          </div>
        </div>
      )}
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            {loading
              ? "Loading..."
              : `${filteredItems.length.toLocaleString()} Results`}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort:</span>
            <Select
              value={sort}
              onValueChange={(value) => {
                setSort(value);
                if (value === "price-asc" || value === "price-desc") {
                  setLoading(true);
                  // Sort items trong state
                  setTimeout(() => {
                    setItems((prevItems) => {
                      const sorted = [...prevItems];
                      if (value === "price-asc") {
                        sorted.sort((a, b) => {
                          const priceA = Number(a.salePrice ?? 0) || 0;
                          const priceB = Number(b.salePrice ?? 0) || 0;
                          return priceA - priceB;
                        });
                      } else if (value === "price-desc") {
                        sorted.sort((a, b) => {
                          const priceA = Number(a.salePrice ?? 0) || 0;
                          const priceB = Number(b.salePrice ?? 0) || 0;
                          return priceB - priceA;
                        });
                      }
                      return sorted;
                    });
                    setLoading(false);
                  }, 300);
                } else {
                  // "recent" - không cần sort
                  setLoading(false);
                }
              }}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Recently listed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && <div className="mb-4 text-sm text-destructive">{error}</div>}

        {/* Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Collections */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-3">
            <Card className="glass sticky top-24">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Tìm kiếm NFT</h3>
                </div>
                <div className="relative">
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-3"
                    placeholder="Tìm kiếm NFT theo tên"
                  />
                </div>
                <div className="space-y-4">
                  {/* Do hiem (Rarity) */}
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Độ hiếm</span>
                    <Select value={rarity} onValueChange={setRarity}>
                      <SelectTrigger>
                        <SelectValue placeholder="-- Chọn độ hiếm --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Thường</SelectItem>
                        <SelectItem value="2">Bạc</SelectItem>
                        <SelectItem value="3">Vàng</SelectItem>
                        <SelectItem value="4">Bạch kim</SelectItem>
                        <SelectItem value="5">Kim cương</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Loai (Type) */}
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Loại</span>
                    <Select value={assetType} onValueChange={setAssetType}>
                      <SelectTrigger>
                        <SelectValue placeholder="-- Chọn loại --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">NFT Thường</SelectItem>
                        <SelectItem value="rank">NFT Hạng</SelectItem>
                        <SelectItem value="mysteryBox">
                          NFT Hộp bí ẩn
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Don vi giao dich (Currency) */}
                  {/* <div className="space-y-2">
                    <span className="text-sm font-medium">
                      Đơn vị giao dịch
                    </span>
                    <Select value={unit} onValueChange={setUnit}>
                      <SelectTrigger>
                        <SelectValue placeholder="-- Chọn đơn vị --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="polygon">Polygon</SelectItem>
                        <SelectItem value="can">CAN</SelectItem>
                        <SelectItem value="usdt">USDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}

                  {/* Khoang gia (Price Range) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Khoảng giá</span>
                      <span className="text-xs text-muted-foreground">
                        {pendingRange[0].toLocaleString("vi-VN")} -{" "}
                        {pendingRange[1].toLocaleString("vi-VN")}{" "}
                        {unit?.toUpperCase()}
                      </span>
                    </div>
                    <Slider
                      min={0}
                      max={1000000}
                      step={1}
                      value={pendingRange}
                      onValueChange={(v) =>
                        setPendingRange([
                          Math.round((v as [number, number])[0]),
                          Math.round((v as [number, number])[1]),
                        ])
                      }
                      className="w-full"
                    />
                  </div>
                  <Button
                    className="w-full cursor-pointer"
                    onClick={() => {
                      const params: any = {};
                      if (search.trim()) {
                        params.name = search.trim();
                      }
                      if (rarity) {
                        params.level = rarity;
                      }
                      if (assetType) {
                        params.type = assetType;
                      }
                      if (unit) {
                        params.currency = unit;
                      }
                      if (pendingRange && pendingRange.length === 2) {
                        params.minPrice = pendingRange[0];
                        params.maxPrice = pendingRange[1];
                      }
                      fetchP2P(
                        Object.keys(params).length > 0 ? params : undefined
                      );
                    }}
                  >
                    Tìm kiếm
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Grid */}
          <section className="col-span-12 md:col-span-9 lg:col-span-9">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {items.length > 0 ? (
                items.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden group hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-[4/5] bg-muted">
                      <img
                        src={getNFTImage(item)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const t = e.target as HTMLImageElement;
                          t.src = "/nft-box.jpg";
                        }}
                      />
                      <Badge
                        className={`absolute top-2 right-2 bg-background/80 ${getLevelTextClass(
                          item.level as string
                        )} backdrop-blur-sm border`}
                      >
                        {getLevelBadge(item.level as string)}
                      </Badge>
                    </div>
                    <CardContent className="p-3 space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {item.collection}
                      </p>
                      <p className="text-sm font-semibold truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">
                          Giá bán
                        </span>
                        <span className="text-sm font-bold">
                          {Number(item.salePrice ?? 0).toLocaleString("vi-VN")}{" "}
                          {item.currency.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">
                          Loại NFT
                        </span>
                        <span className="text-sm font-bold">
                          {getNFTType(item.type ?? "normal")}
                        </span>
                      </div>
                      <div className="mt-3">
                        <Button
                          className="w-full h-10 justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary/70 
                          text-primary-foreground hover:from-primary/90 hover:to-primary/60 shadow-sm cursor-pointer"
                          size="sm"
                          onClick={() => {
                            router.push(`/nft/${item.id}?type=other`);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          Mua ngay
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-12">
                  <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-border bg-background/60">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                      <span className="text-2xl">🛍️</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      Bạn chưa có NFT nào được đăng bán
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Hay đăng bán NFT để hiển thị tại đây
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
