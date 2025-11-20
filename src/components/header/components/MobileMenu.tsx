import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Globe,
  Wallet,
  User,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { NAVIGATION_ITEMS } from "../constants";
import type { Notification } from "../constants";
import { useRouter } from "next/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  user: any;
  notifications: Notification[];
  onSignIn: () => void;
  onSignOut: () => void;
  onSignUp: () => void;
  onClose: () => void;
}

export const MobileMenu = ({
  isOpen,
  user,
  notifications,
  onSignIn,
  onSignOut,
  onSignUp,
  onClose,
}: MobileMenuProps) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
      <nav className="flex flex-col space-y-3">
        {NAVIGATION_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-foreground/80 hover:text-primary transition-colors py-2"
            onClick={onClose}
          >
            {item.label}
          </Link>
        ))}
        {user ? (
          <>
            <div className="flex items-center space-x-2 py-2 border-t border-border/50 mt-2">
              <Button variant="ghost" size="icon" className="flex-1 relative">
                <Bell className="w-5 h-5" />
                {notifications.some((n) => n.unread) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="flex-1">
                <Globe className="w-5 h-5" />
              </Button>
            </div>
            <Button variant="default" className="w-full mt-2">
              <Wallet className="w-4 h-4 mr-2" />
              Kết nối ví
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                router.push("/account");
                onClose();
              }}
            >
              <User className="w-4 h-4 mr-2" />
              Quản lý tài khoản
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                onSignOut();
                onClose();
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => {
                onSignUp();
                onClose();
              }}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Đăng ký
            </Button>
            <Button
              variant="default"
              className="w-full"
              onClick={() => {
                onSignIn();
                onClose();
              }}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Đăng nhập
            </Button>
          </>
        )}
      </nav>
    </div>
  );
};
