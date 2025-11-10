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
  Globe,
  Image,
  Sparkles,
  RefreshCw,
  X,
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

  // Ket noi lai MetaMask voi vi cua user
  const handleReconnect = async () => {
    if (!user?.walletAddress) return;

    try {
      const eth = (window as any)?.ethereum;
      if (!eth?.isMetaMask) {
        console.error("MetaMask is not installed");
        return;
      }

      const accounts: string[] = await eth.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        const connectedAddress = accounts[0].toLowerCase();
        const userAddress = user.walletAddress.toLowerCase();

        if (connectedAddress === userAddress) {
          LocalStorageService.setWalletConnectionStatus(true);
          dispatch(setWalletBalance(user.walletAddress));
          setIsWalletConnected(true);
          await getBalance();
        } else {
          console.error("Connected wallet does not match user wallet");
        }
      }
    } catch (error) {
      console.error("Failed to reconnect wallet:", error);
    }
  };

  // Ngat ket noi MetaMask
  const handleDisconnect = async () => {
    try {
      const eth = (window as any)?.ethereum;
      if (!eth?.isMetaMask) return;

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
        // Bo qua neu khong ho tro
      }

      LocalStorageService.removeWalletConnectionStatus();
      LocalStorageService.clearWalletData();
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="hidden md:flex cursor-pointer relative">
                      Ví của tôi
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/wallet")}>
                      <Wallet className="w-4 h-4 mr-2" />
                      Ví
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/mynft")}>
                      <Image className="w-4 h-4 mr-2" />
                      NFT của tôi
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/nft-investment")}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      NFT cổ phần giúp tôi
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <UserMenu
                  userProfile={userProfile}
                  onSignOut={handleSignOut}
                  onReconnect={handleReconnect}
                  onDisconnect={handleDisconnect}
                />
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
