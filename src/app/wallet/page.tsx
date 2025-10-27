"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Check, ArrowLeft, Loader2 } from "lucide-react";
import { UserService } from "@/api/services/user-service";

// MetaMask types
interface MetaMaskProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (accounts: string[]) => void) => void;
  removeListener: (
    event: string,
    handler: (accounts: string[]) => void
  ) => void;
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
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  // Check if MetaMask is installed
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum?.isMetaMask) {
      setIsMetaMaskInstalled(true);
    }
  }, []);

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

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setConnected("metamask");
        console.log("Connected to MetaMask:", accounts[0]);
        if (accounts[0]) {
          let res = await UserService.updateWalletAddress({
            walletAddress: accounts[0],
          });
          if (res.success) {
            localStorage.setItem("walletAddress", accounts[0]);
          }
        }
      }
    } catch (err: any) {
      console.error("MetaMask connection error:", err);
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

  const handleConnect = async (walletId: string) => {
    if (walletId === "metamask") {
      await connectToMetaMask();
    } else {
      setConnected(walletId);
      console.log(
        `Connected to ${wallets.find((w) => w.id === walletId)?.name}`
      );
    }
  };

  const handleDisconnect = () => {
    setConnected(null);
    setWalletAddress(null);
    setError(null);
    console.log("Wallet disconnected");
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
          </div>

          {error && (
            <Card className="p-4 mb-6 border-2 border-red-500 bg-red-50 dark:bg-red-950">
              <div className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            </Card>
          )}

          {connected && (
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
                <Button variant="outline" onClick={handleDisconnect}>
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
                    ? "opacity-50"
                    : isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:scale-105"
                }`}
                onClick={() =>
                  !connected && !isLoading && handleConnect(wallet.id)
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
