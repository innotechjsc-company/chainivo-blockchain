"use client";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/stores";
import { NewsEvent, EventStatus } from "@/types/news";

/**
 * Custom hook để quản lý dữ liệu news & events
 * Copy y hệt logic từ NewsList.tsx gốc
 */
export const useNewsData = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [allNews, setAllNews] = useState<NewsEvent[]>([]);

  // Copy y hệt logic loadNews từ component gốc
  const loadNews = async () => {
    try {
      // TODO: Thay thế bằng API calls thực tế khi có authentication
      // const { data, error } = await supabase
      //   .from("news_events")
      //   .select("*")
      //   .order("created_at", { ascending: false });

      // Mock data cho development - copy y hệt cấu trúc từ component gốc
      const mockNews: NewsEvent[] = [
        {
          id: "1",
          title: "Ra mắt tính năng Staking mới",
          description:
            "Chúng tôi vui mừng thông báo về việc ra mắt tính năng staking CAN token và NFT với APY hấp dẫn lên đến 15%.",
          image_url:
            "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500",
          event_type: "news",
          event_date: null,
          created_at: new Date().toISOString(),
          location: null,
          start_time: null,
          end_time: null,
          is_featured: true,
        },
        {
          id: "2",
          title: "Sự kiện AMA với CEO",
          description:
            "Tham gia buổi AMA trực tiếp với CEO của chúng tôi để tìm hiểu về roadmap và tương lai của dự án.",
          image_url:
            "https://images.unsplash.com/photo-1511578314322-379afb476865?w=500",
          event_type: "event",
          event_date: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          created_at: new Date().toISOString(),
          location: "Zoom Meeting",
          start_time: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          end_time: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
          ).toISOString(),
          is_featured: true,
        },
        {
          id: "3",
          title: "Thông báo bảo trì hệ thống",
          description:
            "Hệ thống sẽ được bảo trì từ 2:00 - 4:00 ngày mai để nâng cấp hiệu suất.",
          image_url: null,
          event_type: "notification",
          event_date: null,
          created_at: new Date().toISOString(),
          location: null,
          start_time: null,
          end_time: null,
          is_featured: false,
        },
        {
          id: "4",
          title: "Cập nhật giao diện mới",
          description:
            "Chúng tôi đã cập nhật giao diện người dùng với nhiều tính năng mới và cải thiện trải nghiệm.",
          image_url:
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500",
          event_type: "news",
          event_date: null,
          created_at: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
          location: null,
          start_time: null,
          end_time: null,
          is_featured: false,
        },
        {
          id: "5",
          title: "Workshop Blockchain cơ bản",
          description:
            "Tham gia workshop miễn phí để tìm hiểu về blockchain và cryptocurrency từ cơ bản đến nâng cao.",
          image_url:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500",
          event_type: "event",
          event_date: new Date(
            Date.now() + 14 * 24 * 60 * 60 * 1000
          ).toISOString(),
          created_at: new Date().toISOString(),
          location: "Hội trường A, Tòa nhà ABC",
          start_time: new Date(
            Date.now() + 14 * 24 * 60 * 60 * 1000
          ).toISOString(),
          end_time: new Date(
            Date.now() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000
          ).toISOString(),
          is_featured: false,
        },
      ];

      setAllNews(mockNews);
    } catch (error) {
      console.error("Error loading news:", error);
    } finally {
      setLoading(false);
    }
  };

  // Copy y hệt logic filterByType từ component gốc
  const filterByType = (type: string) => {
    return allNews.filter((item) => item.event_type === type);
  };

  // Copy y hệt logic getEventStatus từ component gốc
  const getEventStatus = (
    startTime: string | null,
    endTime: string | null
  ): EventStatus | null => {
    if (!startTime || !endTime) return null;

    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "ongoing";
    return "ended";
  };

  // Effects - copy y hệt từ component gốc
  useEffect(() => {
    loadNews();
  }, []);

  return {
    // Data
    allNews,
    loading,

    // Actions
    loadNews,
    filterByType,
    getEventStatus,
  };
};
