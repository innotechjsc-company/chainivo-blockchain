/**
 * Types cho News & Events system
 * Copy y hệt từ NewsList.tsx gốc
 */

export interface NewsEvent {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  event_type: string;
  event_date: string | null;
  created_at: string;
  location: string | null;
  start_time: string | null;
  end_time: string | null;
  is_featured: boolean;
}

export type EventStatus = "upcoming" | "ongoing" | "ended";
