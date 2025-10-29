"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Wallet, History, Settings, Upload } from "lucide-react";
import { useAppSelector } from "@/stores";
import { WalletService } from "@/api/services/wallet-service";
import { NFTService } from "@/api/services/nft-service";
import { StakingService } from "@/api/services/staking-service";
import { buildBlockchainUrl } from "@/api/config";

interface Profile {
  username: string;
  avatar_url: string | null;
  can_balance: number;
  membership_tier: string;
  total_invested: number;
}

export default function AccountManagementPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [canBalance, setCanBalance] = useState(0);
  const [txLoading, setTxLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    // Simulate loading user profile
    const timer = setTimeout(() => {
      // Mock profile data
      const mockProfile: Profile = {
        username: user?.username as string,
        avatar_url: null,
        can_balance: 12500,
        membership_tier: "gold",
        total_invested: 25000,
      };
      setProfile(mockProfile);
      setUsername(mockProfile.username);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchCanBalance = async () => {
      try {
        if (!user?.walletAddress) return;
        const response = await WalletService.getWalletCanBalances(
          user.walletAddress
        );
        if (response?.success) {
          const raw = Number(response.data.balance);
          setCanBalance(Number.isFinite(raw) ? Math.round(raw) : 0);
        }
      } catch (error) {
        console.error("Failed to fetch CAN balance:", error);
      }
    };

    fetchCanBalance();
  }, [user?.walletAddress]);

  const handleUpdateProfile = async () => {
    try {
      // Mock update profile
      console.log("Updating profile with username:", username);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProfile((prev) => (prev ? { ...prev, username } : null));
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSignOut = async () => {
    console.log("Signing out...");
    router.push("/auth");
  };

  const handleCopyAddress = async () => {
    try {
      const address = user?.walletAddress || "";
      if (!address) return;
      await navigator.clipboard.writeText(address);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  const getRecentMetaMaskTransactions = async () => {
    try {
      if (!user?.walletAddress) return [] as any[];
      setTxLoading(true);

      const [nftsRes, rewardsRes] = await Promise.all([
        NFTService.getNFTsByOwner(user.walletAddress),
        StakingService.getStakesByOwner(user.walletAddress),
      ]);
      let transactions = [];
      let nfts: any[] = ((nftsRes?.data as any) || [])?.nfts?.sort?.(
        (a: any, b: any) =>
          new Date(b.createdAt)?.getTime() - new Date(a.createdAt)?.getTime()
      );
      debugger;
      let stakes: any[] = (rewardsRes?.data as any)?.stakes?.sort(
        (a: any, b: any) =>
          new Date(b.createdAt)?.getTime() - new Date(a.createdAt)?.getTime()
      );
      transactions.push(...nfts, ...stakes);
      setTransactions(transactions);
    } catch (error) {
      console.error("Error fetching NFTs and rewards:", error);
      setTransactions([]);
      return [] as any[];
    } finally {
      setTxLoading(false);
    }
  };

  useEffect(() => {
    getRecentMetaMaskTransactions();
  }, [user?.walletAddress]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 pt-20 pb-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        </main>
      </div>
    );
  }

  const tierColors: Record<string, string> = {
    bronze: "text-orange-600",
    silver: "text-gray-400",
    gold: "text-yellow-500",
    platinum: "text-purple-500",
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            <span className="gradient-text">Quản lý tài khoản</span>
          </h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Hồ sơ
              </TabsTrigger>
              <TabsTrigger value="wallet">
                <Wallet className="w-4 h-4 mr-2" />
                Ví
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="w-4 h-4 mr-2" />
                Lịch sử
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-2" />
                Cài đặt
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="p-6 glass">
                <div className="flex items-start gap-6 mb-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="text-2xl">
                      {username[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="mb-4">
                      <Label htmlFor="username">Tên người dùng</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <Button onClick={handleUpdateProfile}>Cập nhật</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="glass p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      Số dư CAN
                    </div>
                    <div className="text-2xl font-bold gradient-text">
                      {canBalance?.toLocaleString()} CAN
                    </div>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      Hạng thành viên
                    </div>
                    <div
                      className={`text-2xl font-bold capitalize ${
                        tierColors[profile?.membership_tier || "bronze"]
                      }`}
                    >
                      {profile?.membership_tier}
                    </div>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      Tổng đầu tư
                    </div>
                    <div className="text-2xl font-bold gradient-text">
                      ${profile?.total_invested?.toLocaleString()}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="wallet">
              <Card className="p-6 glass">
                <h3 className="text-xl font-bold mb-4">Ví của tôi</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 glass rounded-lg">
                    <div>
                      <div className="font-semibold">Số dư CAN</div>
                      <div className="text-2xl gradient-text font-bold">
                        {canBalance?.toLocaleString()} CAN
                      </div>
                    </div>
                    <Button>Nạp tiền</Button>
                  </div>
                  <div className="p-4 glass rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">
                      Địa chỉ ví
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-muted/20 p-2 rounded text-sm">
                        {user?.walletAddress}{" "}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs cursor-pointer"
                        onClick={handleCopyAddress}
                      >
                        Sao chép
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="p-6 glass">
                <h3 className="text-xl font-bold mb-4">Lịch sử giao dịch</h3>
                {txLoading ? (
                  <div className="text-sm text-muted-foreground">
                    Đang tải giao dịch...
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Không có giao dịch.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((tx) => (
                      <div
                        key={tx._id}
                        className="flex items-center justify-between p-4 glass rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold break-all">
                              {tx.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(
                                tx.transactions?.[0]?.timestamp
                              )?.toLocaleString("vi-VN")}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {/* <a
                            className="text-sm text-blue-500 underline"
                            href={buildBlockchainUrl("transaction", tx.hash)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Xem trên explorer
                          </a> */}
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${
                              tx.status?.toLowerCase?.() === "active"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : tx.status?.toLowerCase?.() === "pending"
                                ? "bg-yellow-100 text-orange-600 border-yellow-200"
                                : "bg-orange-100 text-red-600 border-orange-200"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="p-6 glass">
                <h3 className="text-xl font-bold mb-4">Cài đặt</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 glass rounded-lg">
                    <div>
                      <div className="font-semibold">Email</div>
                      <div className="text-sm text-muted-foreground">
                        user@example.com
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Thay đổi
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 glass rounded-lg">
                    <div>
                      <div className="font-semibold">Mật khẩu</div>
                      <div className="text-sm text-muted-foreground">
                        ••••••••
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Thay đổi
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 glass rounded-lg">
                    <div>
                      <div className="font-semibold">Xác thực 2FA</div>
                      <div className="text-sm text-muted-foreground">
                        Chưa bật
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Bật
                    </Button>
                  </div>

                  <div className="p-4 glass rounded-lg">
                    <Button variant="destructive" onClick={handleSignOut}>
                      Đăng xuất
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
