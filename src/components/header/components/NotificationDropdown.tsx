import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import dayjs from "dayjs";
import { NotificationService } from "@/api/services/notification-service";
import { ToastService } from "@/services";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";

interface NotificationDropdownProps {
  notifications?: Array<{
    id: string;
    title: string;
    message: string;
    time: string;
    unread?: boolean;
  }>;
  hasUnread?: boolean;
}

export const NotificationDropdown = ({
  notifications: propNotifications,
  hasUnread: propHasUnread,
}: NotificationDropdownProps) => {
  const [notificationsData, setNotificationsData] = useState<
    Array<{
      id: string;
      title: string;
      message: string;
      time: string;
      unread?: boolean;
      isRead?: boolean;
    }>
  >(propNotifications || []);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const fetchNotifications = async () => {
    const res = await NotificationService.getMyNotifications();
    if (res.success) {
      setNotificationsData((res.data as any)?.docs || []);
    } else {
      ToastService.error(res.message || "Lỗi khi tải thông báo");
      setNotificationsData([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // setTimeout(() => {
  //   fetchNotifications();
  // }, 1000);

  const handleReadAllNotifications = async () => {
    try {
      const res = await NotificationService.readAllNotifications(
        user?.id || ""
      );
      if (res?.success) {
        await fetchNotifications();
      } else {
        ToastService.error(
          res?.message || "Không thể đánh dấu đã đọc tất cả thông báo"
        );
      }
    } catch (_e) {
      ToastService.error("Không thể đánh dấu đã đọc tất cả thông báo");
    }
  };

  const handleReadNotification = async (notif: any) => {
    try {
      if (notif?.id) {
        await NotificationService.readNotification(String(notif.id));
        // Cap nhat UI local
        setNotificationsData((prev) =>
          prev.map((n) =>
            n.id === notif.id ? { ...n, isRead: true, unread: false } : n
          )
        );
      }
    } catch (_e) {
      // ignore read failure, still navigate
    } finally {
      const link = (notif as any)?.link;
      if (typeof link === "string" && link.trim()) {
        router.push(link);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex relative cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          {/* {hasUnread && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          )} */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>
            Thông báo (
            {
              notificationsData.filter((notif) => notif?.isRead === false)
                .length
            }
            )
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs cursor-pointer"
            onClick={handleReadAllNotifications}
          >
            Đọc tất cả
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-72 overflow-y-auto notification-scrollbar">
          {loading ? (
            <div className="p-3 text-xs text-muted-foreground">
              Đang tải thông báo...
            </div>
          ) : notificationsData.length === 0 ? (
            <div className="p-3 text-xs text-muted-foreground text-center">
              Không có thông báo
            </div>
          ) : (
            (showAll ? notificationsData : notificationsData.slice(0, 5)).map(
              (notif) => (
                <div
                  key={notif.id}
                  className={`p-3 hover:bg-accent cursor-pointer border-b border-border/50 ${
                    notif.unread ? "bg-primary/5" : ""
                  }`}
                  onClick={async () => {
                    await handleReadNotification(notif);
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-sm">{notif.title}</h4>
                    {notif?.isRead === false && (
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {notif.message}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {notif.time}
                  </span>
                </div>
              )
            )
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="justify-center text-primary cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
          }}
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? "Thu gọn" : "Xem tất cả thông báo"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
