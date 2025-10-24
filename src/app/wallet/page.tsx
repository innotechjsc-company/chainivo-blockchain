"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Check, ArrowLeft } from "lucide-react";

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

  const handleConnect = (walletId: string) => {
    setConnected(walletId);
    console.log(`Connected to ${wallets.find((w) => w.id === walletId)?.name}`);
  };

  const handleDisconnect = () => {
    setConnected(null);
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
                className={`p-6 glass cursor-pointer transition-all hover:scale-105 ${
                  connected === wallet.id ? "opacity-50" : ""
                }`}
                onClick={() => !connected && handleConnect(wallet.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center text-4xl">
                    {wallet.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{wallet.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {wallet.description}
                    </p>
                  </div>
                  {connected === wallet.id && (
                    <Check className="w-6 h-6 text-green-500" />
                  )}
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
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
