"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Wallet, Menu, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

// Hooks
import { useAuth } from "./hooks/useAuth";
import { useNotifications } from "./hooks/useNotifications";
import { useLanguage } from "./hooks/useLanguage";

// Components
import { Logo } from "./components/Logo";
import { DesktopNav } from "./components/DesktopNav";
import { NotificationDropdown } from "./components/NotificationDropdown";
import { LanguageDropdown } from "./components/LanguageDropdown";
import { UserMenu } from "./components/UserMenu";
import { MobileMenu } from "./components/MobileMenu";
import { UserService } from "@/api/services/user-service";
import { setWalletBalance, updateBalance } from "@/stores/walletSlice";
import { LocalStorageService } from "@/services";
import { log } from "console";

interface HeaderProps {
  session?: any;
  onSignOut?: () => void;
}

export const Header = ({ session, onSignOut }: HeaderProps) => {
  // Local state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // Custom hooks for logic
  const { user, userProfile, handleSignOut, handleSignIn } = useAuth(onSignOut);
  const { notifications, hasUnread } = useNotifications();
  const { language, languages, handleLanguageChange } = useLanguage();

  const handleSignUp = () => {
    router.push("/auth?tab=register");
  };
  const handleLogin = () => {
    router.push("/auth?tab=login");
  };

  const getBalance = async () => {
    if (!user?.walletAddress) return;

    try {
      // get connected metamask account
      if (!window.ethereum?.isMetaMask) return false;
      const accounts: string[] = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        if (accounts[0].toLowerCase() === user?.walletAddress?.toLowerCase()) {
          LocalStorageService.setWalletConnectionStatus(true);
          console.log("wallet connected");
        }
      }
      // update wallet to redux
      dispatch(setWalletBalance(user?.walletAddress || ""));
      const balance = await UserService.getBalance(user?.walletAddress || "");
      if (balance?.success) {
        const data = (balance as any)?.data;
        const canAmount = Number(data?.can ?? 0);
        const usdtAmount = Number(data?.usdt ?? 0);
        const polAmount = Number(data?.pol ?? 0);
        if (!Number.isNaN(canAmount)) {
          dispatch(
            updateBalance({
              token: data?.token || "ALL",
              can: canAmount,
              usdt: usdtAmount,
              pol: polAmount,
            })
          );
          console.log("balance done!");
        }
      }
    } catch (error) {
      console.error("Failed to get balance:", error);
    }
  };

  useEffect(() => {
    console.log("user", user);
    if (user) {
      getBalance();
    }
  }, [user]);
  // Compose UI from components
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] glass border-b border-border/50 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <DesktopNav />

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NotificationDropdown
                  notifications={notifications}
                  hasUnread={hasUnread}
                />
                <LanguageDropdown
                  languages={languages}
                  currentLanguage={language}
                  onLanguageChange={handleLanguageChange}
                />
                <Button
                  variant="default"
                  className="hidden md:flex cursor-pointer"
                  onClick={() => router.push("/wallet")}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {user?.walletAddress ? "Đã kết nối ví" : "Kết nối ví"}
                </Button>
                <UserMenu userProfile={userProfile} onSignOut={handleSignOut} />
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="hidden md:flex cursor-pointer"
                  onClick={handleSignUp}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Đăng ký
                </Button>
                <Button
                  variant="default"
                  className="hidden md:flex cursor-pointer"
                  onClick={handleLogin}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Đăng nhập
                </Button>
              </>
            )}
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

        <MobileMenu
          isOpen={isMenuOpen}
          user={user}
          notifications={notifications}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          onSignUp={handleSignUp}
        />
      </div>
    </header>
  );
};
