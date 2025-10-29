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
import { useAppSelector, useAppDispatch } from "@/stores";
import { updateProfile } from "@/stores/authSlice";
import { WalletService } from "@/api/services/wallet-service";
import { NFTService } from "@/api/services/nft-service";
import { StakingService } from "@/api/services/staking-service";
import { UserService } from "@/api/services/user-service";
import { buildBlockchainUrl } from "@/api/config";
import { toast } from "sonner";

interface Profile {
  username: string;
  avatar_url: string | null;
  can_balance: number;
  membership_tier: string;
  total_invested: number;
}

export default function AccountManagementPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [canBalance, setCanBalance] = useState(0);
  const [txLoading, setTxLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const user = useAppSelector((state) => state.auth.user);

  // Settings tab states
  const [email, setEmail] = useState(user?.email || "");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

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
      // Validation
      if (!username || username.trim() === "") {
        toast.error("Ten nguoi dung khong duoc de trong");
        return;
      }

      if (username.trim().length < 3) {
        toast.error("Ten nguoi dung phai co it nhat 3 ky tu");
        return;
      }

      setUpdateLoading(true);

      // Goi API that
      const response = await UserService.updateUserProfile({
        
        name: username.trim(),
      });

      if (response.success) {
        // Update local component state
        setProfile((prev) => (prev ? { ...prev, username: username.trim() } : null));

        // Update Redux store (persisted automatically)
        dispatch(updateProfile({ username: username.trim() }));

        // Show success notification
        toast.success("Cap nhat thong tin thanh cong");
      } else {
        // Show error notification
        toast.error(response.error || "Cap nhat that bai");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Co loi xay ra khi cap nhat thong tin");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      if (!email || email.trim() === "") {
        toast.error("Email khong duoc de trong");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Dinh dang email khong hop le");
        return;
      }

      setEmailLoading(true);

      const response = await UserService.updateUserProfile({
        email: email.trim(),
      });

      if (response.success) {
        toast.success("Cap nhat email thanh cong");
        setIsEditingEmail(false);
        // Update Redux store if needed
        dispatch(updateProfile({ email: email.trim() }));
      } else {
        toast.error(response.error || "Cap nhat email that bai");
      }
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Co loi xay ra khi cap nhat email");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error("Vui long dien day du thong tin");
        return;
      }

      if (newPassword.length < 6) {
        toast.error("Mat khau moi phai co it nhat 6 ky tu");
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("Mat khau xac nhan khong khop");
        return;
      }

      setPasswordLoading(true);

      const response = await UserService.updateUserProfile({
        currentPassword: currentPassword,
        newPassword: newPassword,
      });

      if (response.success) {
        toast.success("Cap nhat mat khau thanh cong");
        setIsEditingPassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response.error || "Cap nhat mat khau that bai");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Co loi xay ra khi cap nhat mat khau");
    } finally {
      setPasswordLoading(false);
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
                      {username && username.length > 0
                        ? username[0]?.toUpperCase()
                        : "U"}
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
                        disabled={updateLoading}
                      />
                    </div>
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={updateLoading || !username || username.trim().length < 3}
                    >
                      {updateLoading ? "Đang cập nhật..." : "Cập nhật"}
                    </Button>
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
                  {/* Email Section */}
                  <div className="p-4 glass rounded-lg">
                    <div className="font-semibold mb-2">Email</div>
                    {isEditingEmail ? (
                      <div className="space-y-3">
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Nhap email moi"
                          disabled={emailLoading}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleUpdateEmail}
                            disabled={emailLoading || !email}
                          >
                            {emailLoading ? "Dang luu..." : "Luu"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsEditingEmail(false);
                              setEmail(user?.email || "");
                            }}
                            disabled={emailLoading}
                          >
                            Huy
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {user?.email || "Chua cap nhat"}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingEmail(true)}
                        >
                          Thay doi
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Password Section */}
                  <div className="p-4 glass rounded-lg">
                    <div className="font-semibold mb-2">Mat khau</div>
                    {isEditingPassword ? (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="currentPassword" className="text-sm">
                            Mat khau hien tai
                          </Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Nhap mat khau hien tai"
                            disabled={passwordLoading}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="newPassword" className="text-sm">
                            Mat khau moi
                          </Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nhap mat khau moi"
                            disabled={passwordLoading}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword" className="text-sm">
                            Xac nhan mat khau
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhap lai mat khau moi"
                            disabled={passwordLoading}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleUpdatePassword}
                            disabled={
                              passwordLoading ||
                              !currentPassword ||
                              !newPassword ||
                              !confirmPassword
                            }
                          >
                            {passwordLoading ? "Dang luu..." : "Luu"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsEditingPassword(false);
                              setCurrentPassword("");
                              setNewPassword("");
                              setConfirmPassword("");
                            }}
                            disabled={passwordLoading}
                          >
                            Huy
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          ••••••••
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingPassword(true)}
                        >
                          Thay doi
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* 2FA Section */}
                  <div className="flex items-center justify-between p-4 glass rounded-lg">
                    <div>
                      <div className="font-semibold">Xac thuc 2FA</div>
                      <div className="text-sm text-muted-foreground">
                        Chua bat
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Bat
                    </Button>
                  </div>

                  {/* Sign Out Section */}
                  <div className="p-4 glass rounded-lg">
                    <Button variant="destructive" onClick={handleSignOut}>
                      Dang xuat
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
