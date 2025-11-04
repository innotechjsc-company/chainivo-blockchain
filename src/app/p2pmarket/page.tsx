"use client";

import { useMemo, useState } from "react";
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
}

const mockCollections: CollectionItem[] = [
  { id: "pancake", name: "Pancake Bunnies", icon: "🥞" },
  { id: "gego", name: "GEGO-V2", icon: "🧩" },
  { id: "treas", name: "Treasurland", icon: "🗝️" },
  { id: "apes", name: "ApeSwap", icon: "🐵" },
  { id: "soul", name: "randomSOUL", icon: "💠" },
  { id: "scv", name: "SCV.finance", icon: "📊" },
];

const mockItems: MarketItem[] = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  name:
    i % 3 === 0
      ? "Guts Vending Machine"
      : i % 3 === 1
      ? "Orange Voodoo"
      : "hip mudfish",
  collection: i % 3 === 2 ? "ALPACA" : "The Cryptoz NFT Universe",
  price: Number((Math.random() * 0.05 + 0.001).toFixed(4)),
  currency: "BNB",
  image: "/nft-box.jpg",
}));

export default function P2PMarketPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  const filteredItems = useMemo(() => {
    let result = [...mockItems];
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
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            {filteredItems.length.toLocaleString()} Results
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
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden group hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-[4/5] bg-muted">
                    <img
                      src={item.image || "/nft-box.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        t.src = "/nft-box.jpg";
                      }}
                    />
                    {/* top-right rarity badge placeholder */}
                    <Badge className="absolute top-2 right-2 bg-primary/90 text-primary-foreground">
                      NFT
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
                        {item.price.toFixed(4)} {item.currency}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-500 mt-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs">Verified</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
