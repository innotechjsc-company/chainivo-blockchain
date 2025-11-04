"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Check, ArrowLeft, Loader2 } from "lucide-react";
import { UserService } from "@/api/services/user-service";
import { useAppSelector, useAppDispatch, updateAuthProfile } from "@/stores";
import { setWalletBalance } from "@/stores/walletSlice";
import { LocalStorageService } from "@/services";

// MetaMask types
interface MetaMaskProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: MetaMaskProvider;
  }
}

const wallets = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    description: "Ví phổ biến nhất cho Ethereum",
  },
  {
    id: "trust",
    name: "Trust Wallet",
    icon: "🛡️",
    description: "Ví đa năng an toàn",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "💰",
    description: "Ví từ sàn Coinbase",
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "🔗",
    description: "Kết nối với nhiều loại ví",
  },
];

export default function WalletConnectPage() {
  const router = useRouter();
  const [connected, setConnected] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Initialize wallet address from user if available (display only, no auto-connect)
  useEffect(() => {
    if (user?.walletAddress) {
      setWalletAddress(user.walletAddress);
      // Don't auto-connect, just show the saved wallet address
      precheckAndAutoConnectIfSame();
    }
  }, [user]);

  // Clear wallet state when user changes (logout/login different account)
  useEffect(() => {
    // Get saved user ID from LocalStorageService to detect user changes
    const savedUserId = LocalStorageService.getCurrentUserId();

    if (user?.id && savedUserId !== user.id) {
      // User has changed, clear wallet connection state
      setConnected(null);
      setWalletAddress(null);
      setError(null);

      // Update saved user ID
      LocalStorageService.setCurrentUserId(user.id);
    } else if (!user?.id && savedUserId) {
      // User logged out
      setConnected(null);
      setWalletAddress(null);
      setError(null);
      LocalStorageService.removeCurrentUserId();
    }
  }, [user?.id]);

  // Check for saved wallet connection status and verify with MetaMask
  useEffect(() => {
    const checkSavedConnection = async () => {
      const savedWalletAddress = LocalStorageService.getWalletAddress();
      const isConnectedToWallet = LocalStorageService.isConnectedToWallet();

      if (isConnectedToWallet && savedWalletAddress) {
        // Show saved wallet address and try to verify with MetaMask
        setWalletAddress(savedWalletAddress);

        // Try to verify with MetaMask if available
        if (typeof window !== "undefined" && window.ethereum?.isMetaMask) {
          await verifyMetaMaskConnection();
        }
      } else {
        setConnected(null);
        setWalletAddress(null);
      }
    };

    checkSavedConnection();
  }, [user]);

  // Check if MetaMask is installed and set up listeners
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum?.isMetaMask) {
      setIsMetaMaskInstalled(true);

      // Listen for account changes (when user switches accounts or disconnects)
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected from MetaMask
          setConnected(null);
          setWalletAddress(null);
          setError(null);

          LocalStorageService.removeWalletAddress();
        } else if (connected === "metamask") {
          // User switched accounts
          setWalletAddress(accounts[0]);
          LocalStorageService.setWalletAddress(accounts[0]);
        }
      };

      // Listen for chain changes
      const handleChainChanged = (_chainId: string) => {
        // Co the can nhac thong bao nguoi dung chuyen chain khac
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      // Cleanup listeners on unmount
      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, [connected]);

  // Verify existing MetaMask connection
  const verifyMetaMaskConnection = async () => {
    if (!window.ethereum?.isMetaMask) {
      setError(
        "MetaMask không được cài đặt. Vui lòng cài đặt MetaMask extension."
      );
      return false;
    }

    try {
      // Check if we can get accounts without requesting permission
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        const currentAccount = accounts[0];
        const savedAddress = LocalStorageService.getWalletAddress();

        if (
          savedAddress &&
          currentAccount.toLowerCase() === savedAddress.toLowerCase()
        ) {
          // Same account, auto-connect
          setWalletAddress(currentAccount);
          LocalStorageService.setWalletConnectionStatus(true);

          setConnected("metamask");
          return true;
        } else if (savedAddress) {
          // Different account, need to reconnect
          setError("Ví đã thay đổi. Vui lòng kết nối lại.");
          setWalletAddress(null);
          setConnected(null);
          return false;
        }
      }

      return false;
    } catch (_err) {
      return false;
    }
  };

  const isSameAddress = (a?: string | null, b?: string | null) => {
    if (!a || !b) return false;
    return a.toLowerCase() === b.toLowerCase();
  };

  // Neu user co walletAddress va trung voi dia chi luu local va MetaMask dang o cung tai khoan,
  // thi tu dong set state va bo qua yeu cau quyen ket noi (eth_requestAccounts)
  const precheckAndAutoConnectIfSame = async (): Promise<boolean> => {
    const userAddr = user?.walletAddress || null;
    const localAddr = await Promise.resolve(
      LocalStorageService.getWalletAddress()
    );
    const isConnected = await Promise.resolve(
      LocalStorageService.isConnectedToWallet()
    );
    if (isConnected && userAddr) {
      if (!window.ethereum?.isMetaMask) return false;
      const accounts: string[] = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setConnected("metamask");
        LocalStorageService.setWalletConnectionStatus(true);
        return true;
      }
    }
    return false;
  };

  // MetaMask connection function
  const connectToMetaMask = async () => {
    if (!window.ethereum?.isMetaMask) {
      setError(
        "MetaMask không được cài đặt. Vui lòng cài đặt MetaMask extension."
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    // Clear any previous connection state when retrying
    setConnected(null);
    setWalletAddress(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setConnected("metamask");

        if (accounts?.length > 1) {
          setError("Bạn chỉ kết nối được 1 ví cho 1 tài khoản");
          setConnected(null);
          await disconnectFromMetaMask();

          setWalletAddress(null);
          setIsLoading(false);
          return;
        }

        if (
          accounts[0] &&
          user?.walletAddress !== accounts[0] &&
          !LocalStorageService.getWalletAddress()
        ) {
          try {
            let res = await UserService.updateWalletAddress({
              walletAddress: accounts[0],
              userId: user?.id as unknown as string,
            });

            if (res.success) {
              LocalStorageService.setWalletConnectionStatus(true);
              LocalStorageService.setWalletAddress(accounts[0]);
              dispatch(updateAuthProfile({ walletAddress: accounts[0] }));
              // update wallet to redux
              dispatch(setWalletBalance(accounts[0]));
            } else {
              await disconnectFromMetaMask();

              setError(
                res?.error
                  ? "Ví đã được kết nối với tài khoản khác"
                  : "Lỗi kết nối MetaMask"
              );

              setConnected(null);
              setWalletAddress(null);
              setIsLoading(false);
            }
          } catch (err) {
            setError("Lỗi cập nhật địa chỉ ví");
            setConnected(null);
            setWalletAddress(null);
            setIsLoading(false);
          }
        } else if (accounts[0]) {
          // If wallet address is the same, still update local state
          LocalStorageService.setWalletAddress(accounts[0]);
          dispatch(updateAuthProfile({ walletAddress: accounts[0] }));
          // update wallet to redux
        }
      }
    } catch (err: any) {
      if (err.code === 4001) {
        setError("Người dùng đã từ chối kết nối MetaMask");
      } else if (err.code === -32002) {
        setError("Yêu cầu kết nối MetaMask đang chờ xử lý");
      } else {
        setError("Lỗi kết nối MetaMask: " + (err.message || "Unknown error"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // MetaMask disconnect function
  const disconnectFromMetaMask = async () => {
    if (!window.ethereum?.isMetaMask) {
      return;
    }

    setIsDisconnecting(true);
    setError(null);

    try {
      // Try to revoke permissions (if supported)
      await window.ethereum.request({
        method: "wallet_revokePermissions",
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
      LocalStorageService.removeWalletConnectionStatus();
    } catch (_err: any) {
      // Bo qua neu khong ho tro hoac that bai
    }

    // Clear local state regardless of API success
    setConnected(null);

    setWalletAddress(null);
    setError(null);

    // Clear wallet data from LocalStorageService
    LocalStorageService.clearWalletData();
    setIsDisconnecting(false);
  };

  const handleConnect = async (walletId: string) => {
    if (walletId === "metamask") {
      await connectToMetaMask();
    } else {
      setConnected(walletId);
    }
  };

  const handleDisconnect = async () => {
    if (connected === "metamask") {
      await disconnectFromMetaMask();
    } else {
      // For other wallets, just clear local state
      setConnected(null);

      setWalletAddress(null);
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">
              <span className="gradient-text">Kết nối ví</span>
            </h1>
            <p className="text-muted-foreground">
              Chọn ví để kết nối với tài khoản của bạn
            </p>
            {user && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Đang đăng nhập với:{" "}
                  <span className="font-semibold">{user.name}</span>
                </p>
              </div>
            )}
          </div>

          {error && (
            <Card className="p-4 mb-6 border-2 border-red-500 bg-red-50 dark:bg-red-950">
              <div className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            </Card>
          )}

          {connected && connected.length > 0 && (
            <Card className="p-6 glass mb-8 border-2 border-primary">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center text-3xl">
                    {wallets.find((w) => w.id === connected)?.icon}
                  </div>
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      {wallets.find((w) => w.id === connected)?.name}
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Đã kết nối
                    </div>
                    {walletAddress && (
                      <div className="text-xs text-muted-foreground mt-1 font-mono">
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                >
                  Ngắt kết nối
                </Button>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wallets.map((wallet) => (
              <Card
                key={wallet.id}
                className={`p-6 glass transition-all ${
                  connected === wallet.id
                    ? "opacity-50 cursor-not-allowed"
                    : isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:scale-105"
                }`}
                onClick={() =>
                  !isLoading &&
                  connected !== wallet.id &&
                  handleConnect(wallet.id)
                }
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center text-4xl">
                    {wallet.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                      {wallet.name}
                      {!isMetaMaskInstalled && wallet.id === "metamask" && (
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                          Cần cài đặt
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {wallet.description}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {isLoading && wallet.id === "metamask" ? (
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    ) : connected === wallet.id ? (
                      <Check className="w-6 h-6 text-green-500" />
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 glass rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Lưu ý khi kết nối ví
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Chỉ kết nối ví từ các nhà cung cấp uy tín</li>
              <li>
                • Không chia sẻ private key hoặc seed phrase với bất kỳ ai
              </li>
              <li>• Đảm bảo bạn đang truy cập đúng website chính thức</li>
              <li>• Luôn kiểm tra kỹ trước khi ký các giao dịch</li>
              <li>
                • Đối với MetaMask: Cần cài đặt extension trước khi kết nối
              </li>
              <li>• MetaMask sẽ yêu cầu xác nhận kết nối trong popup</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
