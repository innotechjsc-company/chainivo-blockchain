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
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { formatAmount, getLevelBadge, getNFTType } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/lib/loadingSpinner";

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
  const [sort, setSort] = useState("all");
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  // Lưu filter params hiện tại để dùng khi chuyển trang
  const [currentFilterParams, setCurrentFilterParams] =
    useState<any>(undefined);
  // filter states
  const [rarity, setRarity] = useState<string>("");
  const [assetType, setAssetType] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [pendingRange, setPendingRange] = useState<[number, number]>([0, 0]);
  const [isPriceRangeActive, setIsPriceRangeActive] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
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
  const fetchP2P = async (
    params?: any,
    page: number = 1,
    limit: number = 9
  ) => {
    try {
      setLoading(true);
      setError("");

      // Thêm pagination params
      const requestParams = {
        ...params,
        page,
        limit,
      };

      const resp: ApiResponse<any> = await NFTService.getP2PList(requestParams);
      if (resp?.success) {
        const data: any = resp.data as any;

        // Lấy danh sách items - kiểm tra nhiều cấu trúc có thể
        let list: any[] = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data?.docs && Array.isArray(data.docs)) {
          list = data.docs;
        } else if (data?.items && Array.isArray(data.items)) {
          list = data.items;
        } else if (data?.data && Array.isArray(data.data)) {
          list = data.data;
        } else {
          list = [];
        }

        setItems(list);

        // Lấy thông tin pagination từ response
        const totalPagesFromData =
          data?.totalPages ||
          data?.data?.totalPages ||
          data?.total_pages ||
          data?.data?.total_pages;

        const pagination =
          data?.pagination ||
          data?.data?.pagination ||
          (resp as any).pagination;

        if (totalPagesFromData) {
          setTotalPages(totalPagesFromData);
          setCurrentPage(data?.page || data?.data?.page || page);
        } else if (pagination) {
          setTotalPages(pagination.totalPages || pagination.total_pages || 1);
          setCurrentPage(pagination.page || page);
        } else {
          // Fallback: tính toán từ data nếu không có pagination object
          const totalItems =
            data?.total || data?.data?.total || data?.totalDocs || list.length;
          setTotalPages(Math.max(1, Math.ceil(totalItems / limit)));
          setCurrentPage(page);
        }
      } else {
        setItems([]);
        setError(resp?.message || resp?.error || "Không thể tải danh sách");
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (e: any) {
      setError(e?.message || "Không thể tải danh sách");
      setItems([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchP2P(undefined, 1, 9);
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
      {loading && <LoadingSpinner />}
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            {loading
              ? "Loading..."
              : `${items.length.toLocaleString()} Results`}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort:</span>
            <Select
              value={sort}
              onValueChange={(value) => {
                setSort(value);
                if (value === "all") {
                  setLoading(true);
                  setCurrentPage(1);
                  setCurrentFilterParams(undefined);
                  fetchP2P(undefined, 1, 9)
                    .catch(() => {})
                    .finally(() => setLoading(false));
                } else if (value === "price-asc" || value === "price-desc") {
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
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="price-asc">Giá từ thấp đến cao</SelectItem>
                <SelectItem value="price-desc">Giá từ cao đến thấp</SelectItem>
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
                      onValueChange={(v) => {
                        const [min, max] = v as [number, number];
                        const roundedMin = Math.round(min);
                        const roundedMax = Math.round(max);
                        setPendingRange([roundedMin, roundedMax]);
                        setIsPriceRangeActive(
                          !(roundedMin === 0 && roundedMax === 0)
                        );
                      }}
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
                      if (
                        isPriceRangeActive &&
                        pendingRange &&
                        pendingRange.length === 2
                      ) {
                        params.minPrice = pendingRange[0];
                        params.maxPrice = pendingRange[1];
                      }
                      const finalParams =
                        Object.keys(params).length > 0 ? params : undefined;
                      setCurrentFilterParams(finalParams);
                      setCurrentPage(1);
                      fetchP2P(finalParams, 1, 9);
                      setHasSearched(true);
                    }}
                  >
                    Tìm kiếm
                  </Button>
                  {hasSearched && (
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer"
                      onClick={() => {
                        setSearch("");
                        setRarity("");
                        setAssetType("");
                        setUnit("");
                        setPendingRange([0, 0]);
                        setIsPriceRangeActive(false);
                        setCurrentFilterParams(undefined);
                        setCurrentPage(1);
                        setSort("all");
                        fetchP2P(undefined, 1, 9);
                        setHasSearched(false);
                      }}
                    >
                      Xoá tìm kiếm
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Grid */}
          <section className="col-span-12 md:col-span-9 lg:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.length > 0 ? (
                items.map((item) => (
                  <Card
                    key={item.id}
                    className="glass overflow-hidden hover:scale-105 transition-all group cursor-pointer h-full flex flex-col p-0"
                  >
                    <div className="relative h-64 overflow-hidden w-full">
                      <img
                        src={getNFTImage(item)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const t = e.target as HTMLImageElement;
                          t.src = "/nft-box.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                      <Badge
                        className={`absolute top-4 right-4 z-10 bg-background/80 ${getLevelTextClass(
                          item.level as string
                        )} backdrop-blur-sm border`}
                      >
                        {getLevelBadge(item.level as string)}
                      </Badge>
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold mb-2 truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        {item.collection}
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Giá bán
                          </div>
                          <div className="text-lg font-bold flex items-center gap-2">
                            <div className="truncate max-w-full ">
                              {formatAmount((item as any)?.salePrice)}
                            </div>
                            {item.currency.toUpperCase()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">
                            Loại NFT
                          </div>
                          <div className="text-lg font-bold">
                            {getNFTType(item.type ?? "normal")}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <Button
                          className="flex-1 gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white cursor-pointer"
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

            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newPage = Math.max(1, currentPage - 1);
                  setCurrentPage(newPage);
                  fetchP2P(currentFilterParams, newPage, 9);
                }}
                disabled={currentPage === 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Trước
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => {
                    const isActive = pageNum === currentPage;

                    return (
                      <Button
                        key={pageNum}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (pageNum !== currentPage) {
                            setCurrentPage(pageNum);
                            fetchP2P(currentFilterParams, pageNum, 9);
                          }
                        }}
                        className={`h-9 w-9 p-0 ${
                          isActive ? "bg-primary text-primary-foreground" : ""
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newPage = Math.min(totalPages, currentPage + 1);
                  setCurrentPage(newPage);
                  fetchP2P(currentFilterParams, newPage, 9);
                  if (typeof window !== "undefined") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                disabled={currentPage === totalPages}
                className="gap-2"
              >
                Sau
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
