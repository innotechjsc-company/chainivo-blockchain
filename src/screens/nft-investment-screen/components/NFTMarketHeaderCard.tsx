"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Package } from "lucide-react";

interface NFTStats {
  totalNFTs: string;
  activeUsers: string;
  volume: string;
  averagePrice: string;
  volumeTrend: string;
  priceTrend: string;
}

interface ChartData {
  name: string;
  value: number;
}

interface NFTMarketHeaderCardProps {
  stats: NFTStats;
  volumeData: ChartData[];
  priceData: ChartData[];
  analytics?: any; // Analytics data from otherNFTsData
}

export const NFTMarketHeaderCard = ({
  stats,
  volumeData,
  priceData,
  analytics,
}: NFTMarketHeaderCardProps) => {
  const statItems = [
    {
      icon: Package,
      label: "Tổng NFT",
      value: analytics?.allNFT.toLocaleString(),
      trend: "+12.5%",
      trendUp: true,
    },
    {
      icon: Users,
      label: "Người dùng hoạt động",
      value: analytics?.allUserCount,
      trend: "+8.3%",
      trendUp: true,
    },
  ];

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">Đầu tư NFT</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Khám phá, mua bán và sở hữu các NFT độc quyền
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Basic Stats */}
        {statItems.map((stat, index) => (
          <Card
            key={stat.label}
            className="glass hover:scale-105 transition-all"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div
                  className={`text-sm font-semibold ${
                    stat.trendUp ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stat.trend}
                </div>
              </div>
              <div className="text-3xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}

        {/* Volume Chart */}
        <Card className="glass">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm font-semibold text-green-500">
                {stats.volumeTrend}
              </div>
            </div>
            <CardTitle className="text-lg">Khối lượng giao dịch</CardTitle>
            <div className="text-2xl font-bold gradient-text">
              {analytics?.allMoney.toLocaleString()}
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="h-16 flex items-end gap-1">
              {volumeData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex-1 bg-primary rounded-t-sm transition-all hover:bg-primary/80"
                  style={{
                    height: `${(item.value / 10) * 100}%`,
                    animationDelay: `${index * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Price Chart */}
        <Card className="glass">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm font-semibold text-green-500">
                {stats.priceTrend}
              </div>
            </div>
            <CardTitle className="text-lg">Giá sàn TB</CardTitle>
            <div className="text-2xl font-bold gradient-text">
              {analytics?.priceRange.toLocaleString()}
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="h-16 flex items-end gap-1">
              {priceData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-t-sm transition-all hover:from-primary/80 hover:to-primary/40"
                  style={{
                    height: `${(item.value / 1) * 100}%`,
                    animationDelay: `${index * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
