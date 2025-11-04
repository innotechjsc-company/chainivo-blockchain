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
import { NFTService } from "@/api/services/nft-service";
import type { ApiResponse } from "@/api/api";
import { config } from "@/api/config";
import { Spinner } from "@/components/ui/spinner";
import { Eye } from "lucide-react";
import { getLevelBadge } from "@/lib/utils";

interface CollectionItem {
  id: string;
  name: string;
  icon: string; // emoji/icon placeholder
}

interface MarketItem {
  id: string;
  name: string;
  collection: string;
  price: number;
  currency: string;
  image?: string;
  level: string;
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
        return "text-amber-800"; // nau/amber dam
      case "2":
        return "text-slate-400"; // bac
      case "3":
        return "text-yellow-500"; // vang
      case "4":
        return "text-indigo-400"; // bach kim (platinum tone)
      case "5":
        return "text-cyan-400"; // kim cuong
      default:
        return "text-foreground";
    }
  };

  useEffect(() => {
    const fetchP2P = async () => {
      try {
        setLoading(true);
        setError("");
        const resp: ApiResponse<any> = await NFTService.getP2PList();
        if (resp?.success) {
          setItems(resp?.data?.docs);
        } else {
          setItems([]);
          setError(resp?.message || resp?.error || "Khong the tai danh sach");
        }
      } catch (e: any) {
        setError(e?.message || "Khong the tai danh sach");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchP2P();
  }, []);

  const filteredItems = useMemo(() => {
    const source = items.length > 0 ? items : [];
    let result = [...source];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (it) =>
          it.name.toLowerCase().includes(q) ||
          it.collection.toLowerCase().includes(q)
      );
    }
    if (selectedCollections.length > 0) {
      result = result.filter((it) =>
        selectedCollections.some((c) => it.collection.toLowerCase().includes(c))
      );
    }
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
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
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Recently listed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently listed</SelectItem>
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
                  <h3 className="text-sm font-semibold">Collections</h3>
                  <span className="text-xl">—</span>
                </div>
                <div className="relative">
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-3"
                    placeholder="Search for anything"
                  />
                </div>
                <div className="max-h-[420px] overflow-auto pr-1 space-y-2">
                  {mockCollections.map((c) => {
                    const isActive = selectedCollections.includes(
                      c.name.toLowerCase()
                    );
                    return (
                      <button
                        key={c.id}
                        onClick={() =>
                          setSelectedCollections((prev) =>
                            isActive
                              ? prev.filter((v) => v !== c.name.toLowerCase())
                              : [...prev, c.name.toLowerCase()]
                          )
                        }
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors text-left ${
                          isActive
                            ? "border-primary/40 bg-primary/5"
                            : "border-border hover:bg-accent/50"
                        }`}
                      >
                        <span className="text-xl" aria-hidden>
                          {c.icon}
                        </span>
                        <span className="text-sm">{c.name}</span>
                      </button>
                    );
                  })}
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
                          Price
                        </span>
                        <span className="text-sm font-bold">
                          {Number(item.price ?? 0).toLocaleString("vi-VN")}{" "}
                          {item.currency.toUpperCase()}
                        </span>
                      </div>
                      <div className="mt-3">
                        <Button
                          className="w-full h-10 justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary/70 
                          text-primary-foreground hover:from-primary/90 hover:to-primary/60 shadow-sm cursor-pointer"
                          size="sm"
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
