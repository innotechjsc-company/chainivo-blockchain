import { useState, useMemo } from "react";
import { MOCK_NOTIFICATIONS, type Notification } from "../constants";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const hasUnread = useMemo(
    () => notifications.some((n) => n.unread),
    [notifications]
  );

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, unread: false }))
    );
  };

  return {
    notifications,
    hasUnread,
    markAsRead,
    markAllAsRead,
  };
};
