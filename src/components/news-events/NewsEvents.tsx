"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp } from "lucide-react";

interface NewsEvent {
  id: string;
  title: string;
  description: string;
  event_type: string;
  event_date: string | null;
  is_featured: boolean;
  created_at: string;
}

export const NewsEvents = () => {
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([]);

  useEffect(() => {
    // Mock data for demonstration
    setNewsEvents([
      {
        id: "1",
        title: "CAN Token được niêm yết trên sàn giao dịch lớn",
        description:
          "Chúng tôi vui mừng thông báo CAN token đã chính thức được niêm yết trên các sàn giao dịch hàng đầu thế giới.",
        event_type: "news",
        event_date: "2025-01-15",
        is_featured: true,
        created_at: "2025-01-15T10:00:00Z",
      },
      {
        id: "2",
        title: "Sự kiện Airdrop lớn nhất trong lịch sử",
        description:
          "Tham gia sự kiện airdrop để nhận 1000 CAN token miễn phí. Cơ hội có một không hai!",
        event_type: "event",
        event_date: "2025-01-20",
        is_featured: false,
        created_at: "2025-01-14T15:30:00Z",
      },
      {
        id: "3",
        title: "Cập nhật tính năng Staking mới",
        description:
          "Hệ thống staking đã được nâng cấp với nhiều tính năng mới và lợi nhuận cao hơn.",
        event_type: "announcement",
        event_date: null,
        is_featured: false,
        created_at: "2025-01-13T09:15:00Z",
      },
      {
        id: "4",
        title: "NFT Marketplace chính thức ra mắt",
        description:
          "Nền tảng giao dịch NFT của chúng tôi đã chính thức đi vào hoạt động với nhiều tính năng độc đáo.",
        event_type: "news",
        event_date: "2025-01-10",
        is_featured: true,
        created_at: "2025-01-10T12:00:00Z",
      },
      {
        id: "5",
        title: "Chương trình giới thiệu bạn bè",
        description:
          "Mời bạn bè tham gia và nhận thưởng lên đến 50% hoa hồng từ giao dịch của họ.",
        event_type: "event",
        event_date: "2025-01-25",
        is_featured: false,
        created_at: "2025-01-12T14:20:00Z",
      },
      {
        id: "6",
        title: "Bảo trì hệ thống định kỳ",
        description:
          "Hệ thống sẽ được bảo trì từ 2:00 - 4:00 sáng ngày 18/01 để nâng cấp hiệu suất.",
        event_type: "announcement",
        event_date: "2025-01-18",
        is_featured: false,
        created_at: "2025-01-11T16:45:00Z",
      },
    ]);
  }, []);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "news":
        return "bg-primary/20 text-primary";
      case "event":
        return "bg-secondary/20 text-secondary";
      case "announcement":
        return "bg-accent/20 text-accent";
      default:
        return "bg-muted";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Tin tức & Sự kiện
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Cập nhật những thông tin mới nhất về CryptoHub và CAN token
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsEvents.map((item) => (
            <Card
              key={item.id}
              className={`glass hover:scale-105 transition-all ${
                item.is_featured ? "border-primary/60" : "border-border/30"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge className={getEventTypeColor(item.event_type)}>
                    {item.event_type === "news" && "Tin tức"}
                    {item.event_type === "event" && "Sự kiện"}
                    {item.event_type === "announcement" && "Thông báo"}
                  </Badge>
                  {item.is_featured && (
                    <TrendingUp className="w-4 h-4 text-primary animate-pulse" />
                  )}
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3 mb-4">
                  {item.description}
                </CardDescription>
                {item.event_date && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(item.event_date)}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
