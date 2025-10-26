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
import type { Notification } from "../constants";

interface NotificationDropdownProps {
  notifications: Notification[];
  hasUnread: boolean;
}

export const NotificationDropdown = ({
  notifications,
  hasUnread,
}: NotificationDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex relative cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          {hasUnread && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-72 overflow-y-auto notification-scrollbar">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 hover:bg-accent cursor-pointer border-b border-border/50 ${
                notif.unread ? "bg-primary/5" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-sm">{notif.title}</h4>
                {notif.unread && (
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
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-primary cursor-pointer">
          Xem tất cả thông báo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
