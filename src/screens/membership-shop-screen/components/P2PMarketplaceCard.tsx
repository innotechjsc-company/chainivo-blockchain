"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, Clock, TrendingUp } from "lucide-react";

interface P2PListing {
  id: number;
  tier: string;
  nftName: string;
  rarity: string;
  seller: string;
  price: string;
  usdPrice: string;
  listedTime: string;
  color: string;
}

interface P2PMarketplaceCardProps {
  listings: P2PListing[];
}

export const P2PMarketplaceCard = ({ listings }: P2PMarketplaceCardProps) => {
  const rarityColors = {
    Common: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    Rare: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Epic: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    Legendary: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    Mythic: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    Divine: "bg-red-500/20 text-red-300 border-red-500/30",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Store className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold gradient-text">Thị trường P2P</h2>
        </div>
        <Badge variant="outline" className="text-sm">
          <TrendingUp className="w-4 h-4 mr-1" />
          {listings.length} NFT đang bán
        </Badge>
      </div>

      <div className="space-y-4">
        {listings.map((listing) => (
          <Card
            key={listing.id}
            className="glass hover:scale-[1.01] transition-all cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* NFT Icon */}
                  <div
                    className={`w-16 h-16 rounded-lg bg-gradient-to-br ${listing.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <div className="text-white text-sm font-bold text-center">
                      {listing.tier}
                    </div>
                  </div>

                  {/* NFT Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg truncate">
                        {listing.nftName}
                      </h3>
                      <Badge
                        className={`text-sm ${
                          rarityColors[
                            listing.rarity as keyof typeof rarityColors
                          ]
                        }`}
                      >
                        {listing.rarity}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <span>Người bán:</span>
                        <span className="font-mono">{listing.seller}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{listing.listedTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-xl font-bold text-primary">
                        {listing.price}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ≈ {listing.usdPrice}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buy Button */}
                <Button variant="default" size="lg" className="flex-shrink-0">
                  Mua ngay
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" className="w-full" size="lg">
        Xem tất cả NFT đang bán
      </Button>
    </div>
  );
};
