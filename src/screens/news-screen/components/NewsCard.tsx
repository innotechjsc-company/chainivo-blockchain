"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewsEvent, EventStatus } from "@/types/news";
import { Calendar, MapPin, Clock } from "lucide-react";

interface NewsCardProps {
  item: NewsEvent;
  onNavigate?: (id: string) => void;
  getEventStatus?: (
    startTime: string | null,
    endTime: string | null
  ) => EventStatus | null;
}

/**
 * NewsCard component - Copy y hệt từ NewsList.tsx gốc
 */
export const NewsCard = ({
  item,
  onNavigate,
  getEventStatus,
}: NewsCardProps) => {
  // Copy y hệt logic từ component gốc
  const eventStatus =
    item.event_type === "event"
      ? getEventStatus?.(item.start_time, item.end_time)
      : null;

  const handleClick = () => {
    if (onNavigate) {
      onNavigate(item.id);
    }
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      onClick={handleClick}
    >
      {item.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {item.is_featured && (
            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-primary to-secondary">
              Nổi bật
            </Badge>
          )}
          {eventStatus && (
            <Badge
              className="absolute top-4 left-4"
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
      )}
      <div className="p-6">
        <Badge
          variant={item.event_type === "event" ? "default" : "secondary"}
          className="mb-3"
        >
          {item.event_type === "news"
            ? "Tin tức"
            : item.event_type === "notification"
            ? "Thông báo"
            : "Sự kiện"}
        </Badge>
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {item.description}
        </p>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(item.created_at).toLocaleDateString("vi-VN")}</span>
          </div>
          {item.event_type === "event" && item.start_time && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                {new Date(item.start_time).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
          {item.event_type === "event" && item.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="truncate max-w-[150px]">{item.location}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
