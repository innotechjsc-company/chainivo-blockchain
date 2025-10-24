"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  AlertCircle,
} from "lucide-react";

interface NewsEvent {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string | null;
  event_type: string;
  event_date: string | null;
  created_at: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  zoom_link: string | null;
  start_time: string | null;
  end_time: string | null;
  max_attendees: number | null;
}

interface NewsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const router = useRouter();
  const [news, setNews] = useState<NewsEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [eventStatus, setEventStatus] = useState<
    "upcoming" | "ongoing" | "ended"
  >("upcoming");

  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);
  const id = resolvedParams?.id;

  useEffect(() => {
    loadNews();
  }, [id]);

  useEffect(() => {
    if (news?.event_type === "event" && news.start_time && news.end_time) {
      updateEventStatus();
      const interval = setInterval(() => {
        updateEventStatus();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [news]);

  const updateEventStatus = () => {
    if (!news?.start_time || !news?.end_time) return;

    const now = new Date().getTime();
    const start = new Date(news.start_time).getTime();
    const end = new Date(news.end_time).getTime();

    if (now < start) {
      setEventStatus("upcoming");
      const diff = start - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining(
        `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`
      );
    } else if (now >= start && now <= end) {
      setEventStatus("ongoing");
      const diff = end - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining(`Còn ${hours} giờ ${minutes} phút`);
    } else {
      setEventStatus("ended");
      setTimeRemaining("Sự kiện đã kết thúc");
    }
  };

  const loadNews = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockNews: NewsEvent = {
        id: id || "1",
        title: "Hội thảo Blockchain & DeFi 2024",
        description:
          "Tham gia hội thảo về công nghệ blockchain và tài chính phi tập trung với các chuyên gia hàng đầu trong ngành.",
        content: `Hội thảo Blockchain & DeFi 2024 sẽ mang đến những thông tin mới nhất về:

• Công nghệ blockchain và ứng dụng thực tế
• Tài chính phi tập trung (DeFi) và cơ hội đầu tư
• NFT và thị trường nghệ thuật số
• Web3 và tương lai của internet
• Quy định pháp lý và bảo mật trong crypto

Chương trình bao gồm:
- 3 bài thuyết trình chính từ các chuyên gia
- Panel discussion với Q&A
- Networking session
- Demo các dự án mới nhất

Đây là cơ hội tuyệt vời để kết nối với cộng đồng blockchain Việt Nam và học hỏi từ những người đi đầu trong ngành.`,
        image_url: "/placeholder.svg",
        event_type: "event",
        event_date: "2024-03-15",
        created_at: "2024-02-15T10:00:00Z",
        location: "Hội trường A, Trung tâm Hội nghị Quốc gia",
        latitude: 21.0285,
        longitude: 105.8542,
        zoom_link: "https://zoom.us/j/123456789",
        start_time: "2024-03-15T09:00:00Z",
        end_time: "2024-03-15T17:00:00Z",
        max_attendees: 200,
      };

      setNews(mockNews);
      setRegistrationCount(45); // Mock registration count
    } catch (error) {
      console.error("Error loading news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (news?.max_attendees && registrationCount >= news.max_attendees) {
      console.log("Event is full");
      return;
    }

    try {
      if (isRegistered) {
        setIsRegistered(false);
        setRegistrationCount((prev) => prev - 1);
        console.log("Registration cancelled");
      } else {
        setIsRegistered(true);
        setRegistrationCount((prev) => prev + 1);
        console.log("Registration successful");
      }
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  const openMaps = () => {
    if (news?.latitude && news?.longitude) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${news.latitude},${news.longitude}`,
        "_blank"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Không tìm thấy tin tức</h1>
            <Button onClick={() => router.push("/news")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
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
          onClick={() => router.push("/news")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <article className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                variant={news.event_type === "event" ? "default" : "secondary"}
              >
                {news.event_type === "news"
                  ? "Tin tức"
                  : news.event_type === "notification"
                  ? "Thông báo"
                  : "Sự kiện"}
              </Badge>
              {news.event_type === "event" && (
                <Badge
                  variant={
                    eventStatus === "upcoming"
                      ? "outline"
                      : eventStatus === "ongoing"
                      ? "default"
                      : "secondary"
                  }
                >
                  {eventStatus === "upcoming"
                    ? "Sắp diễn ra"
                    : eventStatus === "ongoing"
                    ? "Đang diễn ra"
                    : "Đã kết thúc"}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-4">
              {news.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(news.created_at).toLocaleDateString("vi-VN")}
                </span>
              </div>
              {news.event_type === "event" && news.start_time && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(news.start_time).toLocaleString("vi-VN")}
                  </span>
                </div>
              )}
              {news.event_type === "event" && news.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{news.location}</span>
                </div>
              )}
            </div>
          </div>

          {news.image_url && (
            <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl mb-8 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📰</span>
                </div>
                <p className="text-muted-foreground">News Image</p>
              </div>
            </div>
          )}

          {news.event_type === "event" &&
            eventStatus === "upcoming" &&
            timeRemaining && (
              <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-secondary/10">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Thời gian bắt đầu</h3>
                  <p className="text-3xl font-bold gradient-text">
                    {timeRemaining}
                  </p>
                </div>
              </Card>
            )}

          {news.event_type === "event" && eventStatus === "ongoing" && (
            <Card className="p-6 mb-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/50">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-amber-500" />
                <div>
                  <h3 className="text-xl font-bold">Sự kiện đang diễn ra</h3>
                  <p className="text-muted-foreground">{timeRemaining}</p>
                </div>
              </div>
            </Card>
          )}

          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-lg text-muted-foreground mb-4">
              {news.description}
            </p>
            {news.content && (
              <div className="whitespace-pre-wrap">{news.content}</div>
            )}
          </div>

          {news.event_type === "event" && (
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">
                    {registrationCount} người đã đăng ký
                    {news.max_attendees && ` / ${news.max_attendees}`}
                  </span>
                </div>
              </div>

              {eventStatus !== "ended" && (
                <div className="space-y-4">
                  {eventStatus === "upcoming" && (
                    <Button
                      onClick={handleRegister}
                      className="w-full"
                      variant={isRegistered ? "outline" : "default"}
                      disabled={
                        !isRegistered && news.max_attendees
                          ? registrationCount >= news.max_attendees
                          : false
                      }
                    >
                      {isRegistered
                        ? "Hủy đăng ký"
                        : news.max_attendees &&
                          registrationCount >= news.max_attendees
                        ? "Đã đầy"
                        : "Đăng ký tham gia"}
                    </Button>
                  )}

                  {news.zoom_link && (
                    <Button
                      onClick={() => window.open(news.zoom_link!, "_blank")}
                      className="w-full"
                      variant={
                        eventStatus === "ongoing" ? "default" : "outline"
                      }
                    >
                      <Video className="mr-2 h-4 w-4" />
                      {eventStatus === "ongoing"
                        ? "Tham gia online ngay"
                        : "Link Zoom"}
                    </Button>
                  )}

                  {news.latitude && news.longitude && (
                    <Button
                      onClick={openMaps}
                      className="w-full"
                      variant="outline"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      {eventStatus === "ongoing"
                        ? "Xem chỉ đường"
                        : "Xem vị trí"}
                    </Button>
                  )}
                </div>
              )}
            </Card>
          )}
        </article>
      </main>
    </div>
  );
}
