"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Wallet,
  Menu,
  LogIn,
  UserPlus,
  RefreshCw,
  X,
  Globe,
} from "lucide-react";
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
  const [isWalletConnected, setIsWalletConnected] = useState(false);
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

  // Kết nối lại MetaMask với ví của user
  const handleReconnect = async () => {
    if (!user?.walletAddress) return;

    try {
      const eth = (window as any)?.ethereum;
      if (!eth?.isMetaMask) {
        console.error("MetaMask is not installed");
        return;
      }

      // Yêu cầu kết nối MetaMask
      const accounts: string[] = await eth.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        const connectedAddress = accounts[0].toLowerCase();
        const userAddress = user.walletAddress.toLowerCase();

        if (connectedAddress === userAddress) {
          LocalStorageService.setWalletConnectionStatus(true);
          dispatch(setWalletBalance(user.walletAddress));
          // Update state để trigger re-render
          setIsWalletConnected(true);
          // Refresh balance
          await getBalance();
        } else {
          console.error("Connected wallet does not match user wallet");
        }
      }
    } catch (error) {
      console.error("Failed to reconnect wallet:", error);
    }
  };

  // Ngắt kết nối MetaMask
  const handleDisconnect = async () => {
    try {
      const eth = (window as any)?.ethereum;
      if (!eth?.isMetaMask) return;

      // Thử revoke permissions (nếu được hỗ trợ)
      try {
        await eth.request({
          method: "wallet_revokePermissions",
          params: [
            {
              eth_accounts: {},
            },
          ],
        });
      } catch (_err) {
        // Bỏ qua nếu không hỗ trợ hoặc thất bại
      }

      // Xóa trạng thái kết nối
      LocalStorageService.removeWalletConnectionStatus();
      LocalStorageService.clearWalletData();
      // Update state để trigger re-render
      setIsWalletConnected(false);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
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

  // Sync wallet connection status với localStorage
  useEffect(() => {
    setIsWalletConnected(LocalStorageService.isConnectedToWallet());
  }, [user?.walletAddress]);

  useEffect(() => {
    console.log("user", user);
    if (user) {
      getBalance();
    }
  }, [user]);

  // Auto-connect MetaMask if user has a saved walletAddress
  useEffect(() => {
    const autoConnect = async () => {
      try {
        if (!user?.walletAddress) return;
        const eth = (window as any)?.ethereum;
        if (!eth?.isMetaMask) return;

        // Check existing accounts
        let accounts: string[] = await eth.request({ method: "eth_accounts" });
        if (!accounts || accounts.length === 0) {
          // Prompt connect if not yet connected
          try {
            await eth.request({ method: "eth_requestAccounts" });
            accounts = await eth.request({ method: "eth_accounts" });
          } catch (_err) {
            // user rejected or not available, skip silently
            return;
          }
        }

        if (
          accounts?.[0] &&
          accounts[0].toLowerCase() === user.walletAddress.toLowerCase()
        ) {
          LocalStorageService.setWalletConnectionStatus(true);
          // Optionally refresh balances
          dispatch(setWalletBalance(user.walletAddress));
          // Update state để trigger re-render
          setIsWalletConnected(true);
        }
      } catch (_e) {
        // ignore auto-connect errors
      }
    };

    autoConnect();
  }, [user?.walletAddress, dispatch]);
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
                {!user?.walletAddress ? (
                  <Button
                    variant="default"
                    className="hidden md:flex cursor-pointer"
                    onClick={() => router.push("/wallet")}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    "Kết nối ví"
                  </Button>
                ) : !isWalletConnected ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="default"
                        className="hidden md:flex cursor-pointer relative"
                      >
                        <span
                          className={`absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full border border-background ${
                            isWalletConnected ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        />
                        <Wallet className="w-4 h-4 mr-2" />
                        {user?.walletAddress?.slice(0, 6)}...
                        {user?.walletAddress?.slice(-4)}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={handleReconnect}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Kết nối lại
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDisconnect}>
                        <X className="w-4 h-4 mr-2" />
                        Ngắt kết nối
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="hidden md:flex cursor-pointer relative">
                        <span
                          className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-background ${
                            isWalletConnected ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        />
                        <Wallet className="w-4 h-4 mr-2" />
                        {user?.walletAddress?.slice(0, 6)}...
                        {user?.walletAddress?.slice(-4)}{" "}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleReconnect}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Kết nối lại
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDisconnect}>
                        <X className="w-4 h-4 mr-2" />
                        Ngắt kết nối
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
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
