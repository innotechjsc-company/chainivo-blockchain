"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Wallet,
  Menu,
  LogOut,
  LogIn,
  Bell,
  Globe,
  User,
  Settings,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  session?: any;
  onSignOut?: () => void;
}

interface UserProfile {
  username: string;
  avatar_url: string | null;
}

export const Header = ({ session, onSignOut }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [language, setLanguage] = useState("vi");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setUserProfile({
        username: JSON.parse(storedUser).username,
        avatar_url: null,
      });
    }
  }, []);

  const notifications = [
    {
      id: 1,
      title: "Staking thành công",
      message: "Bạn đã stake 1000 CAN thành công",
      time: "5 phút trước",
      unread: true,
    },
    {
      id: 2,
      title: "Nhận thưởng NFT",
      message: "Bạn đã nhận được NFT mới từ nhiệm vụ",
      time: "1 giờ trước",
      unread: true,
    },
    {
      id: 3,
      title: "Đầu tư hoàn tất",
      message: "Giai đoạn 1 đã hoàn tất với lợi nhuận 15%",
      time: "3 giờ trước",
      unread: false,
    },
    {
      id: 4,
      title: "Hệ thống",
      message: "Cập nhật tính năng mới đã có sẵn",
      time: "1 ngày trước",
      unread: false,
    },
  ];

  const languages = [
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
  ];

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    // Toast notification would go here
  };

  const handleSignOut = async () => {
    // Clear user from localStorage
    localStorage.removeItem("user");
    setUser(null);
    setUserProfile(null);
    onSignOut?.();
    router.push("/");
  };

  const handleSignIn = () => {
    router.push("/auth");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] glass border-b border-border/50 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-glow">
              <span className="text-2xl font-bold">₿</span>
            </div>
            <span className="text-xl font-bold gradient-text">CryptoHub</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              href="/investments"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Đầu tư
            </Link>
            <Link
              href="/membership"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Mua hạng
            </Link>
            <Link
              href="/nftmarket"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              NFT Market
            </Link>
            <Link
              href="/missions"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Nhiệm vụ
            </Link>
            <Link
              href="/staking"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Staking
            </Link>
            {/* <Link
              href="/news"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Tin tức
            </Link> */}
            <Link
              href="/about"
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Về chúng tôi
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden md:flex relative cursor-pointer"
                    >
                      <Bell className="w-5 h-5" />
                      {notifications.some((n) => n.unread) && (
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
                            <h4 className="font-semibold text-sm">
                              {notif.title}
                            </h4>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden md:flex cursor-pointer"
                    >
                      <Globe className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Chọn ngôn ngữ</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className="cursor-pointer"
                      >
                        <span className="mr-2">{lang.flag}</span>
                        <span className="flex-1">{lang.name}</span>
                        {language === lang.code && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="default"
                  className="hidden md:flex cursor-pointer"
                  onClick={() => router.push("/wallet")}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Kết nối ví
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="hidden md:flex items-center space-x-2 h-auto py-2 cursor-pointer"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={userProfile?.avatar_url || ""} />
                        <AvatarFallback>
                          {userProfile?.username?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {userProfile?.username || "User"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/account")}>
                      <User className="w-4 h-4 mr-2" />
                      Quản lý tài khoản
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Cài đặt
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                variant="default"
                className="hidden md:flex cursor-pointer"
                onClick={handleSignIn}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Đăng nhập
              </Button>
            )}
            {/* <ThemeToggle /> */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-foreground/80 hover:text-primary transition-colors py-2"
              >
                Trang chủ
              </Link>
              <Link
                href="/investments"
                className="text-foreground/80 hover:text-primary transition-colors py-2"
              >
                Đầu tư
              </Link>
              <Link
                href="/membership"
                className="text-foreground/80 hover:text-primary transition-colors py-2"
              >
                Mua hạng
              </Link>
              <Link
                href="/nftmarket"
                className="text-foreground/80 hover:text-primary transition-colors py-2"
              >
                NFT Market
              </Link>
              <Link
                href="/missions"
                className="text-foreground/80 hover:text-primary transition-colors py-2"
              >
                Nhiệm vụ
              </Link>
              <Link
                href="/staking"
                className="text-foreground/80 hover:text-primary transition-colors py-2"
              >
                Staking
              </Link>
              {/* <Link
                href="/news"
                className="text-foreground/80 hover:text-primary transition-colors py-2"
              >
                Tin tức
              </Link> */}
              {user ? (
                <>
                  <div className="flex items-center space-x-2 py-2 border-t border-border/50 mt-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-1 relative"
                    >
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
                  <Button variant="ghost" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    Quản lý tài khoản
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  className="w-full mt-2"
                  onClick={handleSignIn}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Đăng nhập
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
