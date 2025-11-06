"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Wallet, History, Settings } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/stores";
import { WalletService } from "@/api/services/wallet-service";
import { NFTService } from "@/api/services/nft-service";
import { StakingService } from "@/api/services/staking-service";
import { UserService } from "@/api/services/user-service";
import { LocalStorageService } from "@/services";
import { ChangePasswordDialog } from "@/components/account/ChangePasswordDialog";
import { AvatarUpload } from "@/components/account/AvatarUpload";
import { updateProfile } from "@/stores/authSlice";
import { MyNFTCollection } from "@/components/account/MyNFTCollection";

interface Profile {
  name: string;
  avatarUrl: string | null; //
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
  const [canBalance, setCanBalance] = useState(0);
  const [txLoading, setTxLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    console.log('[DEBUG useEffect] Triggered. user from Redux:', user);

    // Simulate loading user profile
    const timer = setTimeout(() => {
      // Get avatar from localStorage or Redux
      const userInfo = LocalStorageService.getUserInfo();
      console.log('[DEBUG useEffect] localStorage userInfo:', userInfo);

      const avatarUrl = userInfo?.avatarUrl || user?.avatarUrl || null;
      console.log('[DEBUG useEffect] Final avatarUrl:', avatarUrl);
      console.log('[DEBUG useEffect] Source: userInfo.avatarUrl =', userInfo?.avatarUrl, ', user.avatarUrl =', user?.avatarUrl);

      // Mock profile data
      const mockProfile: Profile = {
        name: user?.name as string,
        avatarUrl: avatarUrl, //
        can_balance: 12500,
        membership_tier: "gold",
        total_invested: 25000,
      };
      console.log('[DEBUG useEffect] Setting profile to:', mockProfile);
      setProfile(mockProfile);
      setUsername(mockProfile.name);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    const fetchCanBalance = async () => {
      try {
        if (!user?.walletAddress) return;
        const response = await WalletService.getWalletCanBalances(
          user.walletAddress
        );
        if (response?.success) {
          const raw = Number((response.data as any)?.can as number);
          setCanBalance(Number.isFinite(raw) ? Math.round(raw) : 0);
        }
      } catch (error) {
        console.error("Failed to fetch CAN balance:", error);
      }
    };

    fetchCanBalance();
  }, []);

  // Validation: Chi cho phep chu (co dau), so, khoang trang
  const validateName = (name: string): string | null => {
    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      return "Ten khong duoc de trong";
    }

    if (trimmedName.length > 100) {
      return "Ten khong duoc vuot qua 100 ky tu";
    }

    // Regex: chu cai (a-z, A-Z), chu Viet co dau, so (0-9), khoang trang
    const nameRegex = /^[a-zA-Z0-9\u00C0-\u1EF9\s]+$/;
    if (!nameRegex.test(trimmedName)) {
      return "Ten chi duoc chua chu cai, so va khoang trang";
    }

    return null;
  };

  const handleUpdateProfile = async () => {
    setUpdateError(null);
    setUpdateSuccess(null);

    const trimmedName = username.trim();
    const hasNameChange = trimmedName !== profile?.name;
    const hasAvatarChange = selectedAvatar !== null;

    if (!hasNameChange && !hasAvatarChange) {
      setUpdateError("Vui long cap nhat ten hoac anh dai dien");
      return;
    }

    if (hasNameChange) {
      const validationError = validateName(trimmedName);
      if (validationError) {
        setUpdateError(validationError);
        return;
      }
    }

    setUpdateLoading(true);

    try {
      // Create FormData
      const formData = new FormData();

      if (hasNameChange) {
        formData.append("name", trimmedName);
      }

      if (hasAvatarChange && selectedAvatar) {
        formData.append("avatar", selectedAvatar);
      }

      // Call API
      const response = await UserService.updateProfile(formData);

      // DEBUG: Check response structure
      console.log('[DEBUG handleUpdateProfile] Full response:', response);
      console.log('[DEBUG handleUpdateProfile] response.success:', response.success);
      console.log('[DEBUG handleUpdateProfile] response.data:', response.data);
      console.log('[DEBUG handleUpdateProfile] response.data type:', typeof response.data);

      if (response.success) {
        const updateData: any = {};
        let avatarUrl: string | null = null;

        if (hasNameChange) {
          updateData.name = trimmedName;
        }

        const actualData = (response.data as any)?.data || response.data;

        // DEBUG: Check actualData structure
        console.log('[DEBUG handleUpdateProfile] actualData:', actualData);
        console.log('[DEBUG handleUpdateProfile] actualData.avatarUrl:', actualData?.avatarUrl);
        console.log('[DEBUG handleUpdateProfile] actualData.avatar:', actualData?.avatar);
        console.log('[DEBUG handleUpdateProfile] actualData.avatar?.url:', actualData?.avatar?.url);

        if (hasAvatarChange && actualData?.avatarUrl) {
          console.log('[DEBUG handleUpdateProfile] Branch 1: actualData.avatarUrl exists');
          avatarUrl = actualData.avatarUrl;
          updateData.avatarUrl = avatarUrl;
        } else if (hasAvatarChange && actualData?.avatar?.url) {
          console.log('[DEBUG handleUpdateProfile] Branch 2: actualData.avatar.url exists');
          avatarUrl = actualData.avatar.url;
          updateData.avatarUrl = avatarUrl;
        } else {
          console.log('[DEBUG handleUpdateProfile] Branch 3: No avatar URL found');
        }

        console.log('[DEBUG handleUpdateProfile] Final avatarUrl:', avatarUrl);
        console.log('[DEBUG handleUpdateProfile] Final updateData:', updateData);

        // Update Redux store
        console.log('[DEBUG handleUpdateProfile] Dispatching updateProfile to Redux with:', updateData);
        dispatch(updateProfile(updateData));

        // Update local profile state
        const newProfileState = {
          ...profile,
          name: hasNameChange ? trimmedName : (profile?.name || ''),
          avatarUrl: hasAvatarChange && avatarUrl ? avatarUrl : (profile?.avatarUrl || null),
        };
        console.log('[DEBUG handleUpdateProfile] Updating local profile state to:', newProfileState);
        setProfile(newProfileState as Profile);

        // Update localStorage with new user info (including avatar URL)
        const currentUserInfo = LocalStorageService.getUserInfo();
        console.log('[DEBUG handleUpdateProfile] Current localStorage userInfo:', currentUserInfo);

        if (currentUserInfo) {
          const updatedUserInfo = {
            ...currentUserInfo,
            name: hasNameChange ? trimmedName : currentUserInfo.name,
            avatarUrl:
              hasAvatarChange && avatarUrl
                ? avatarUrl
                : currentUserInfo.avatarUrl,
          };
          console.log('[DEBUG handleUpdateProfile] Updating localStorage with:', updatedUserInfo);
          LocalStorageService.setUserInfo(updatedUserInfo);
        }

        // Clear avatar upload state
        setSelectedAvatar(null);
        setAvatarPreview(null);

        setUpdateSuccess("Cap nhat profile thanh cong");

        setTimeout(() => setUpdateSuccess(null), 3000);
      } else {
        setUpdateError(
          response.error ||
            response.message ||
            "Co loi xay ra khi cap nhat profile"
        );
      }
    } catch (error: any) {
      setUpdateError(error.message || "Khong the cap nhat profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleAvatarSelect = (file: File | null, previewUrl: string | null) => {
    setSelectedAvatar(file);
    setAvatarPreview(previewUrl);
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
        NFTService.getNFTsByOwner({ ownerAddress: user.walletAddress }),
        StakingService.getStakesByOwner(user.walletAddress),
      ]);
      let transactions = [];
      let nfts: any[] = ((nftsRes?.data as any) || [])?.nfts?.sort?.(
        (a: any, b: any) =>
          new Date(b.createdAt)?.getTime() - new Date(a.createdAt)?.getTime()
      );
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
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Hồ sơ
              </TabsTrigger>
              <TabsTrigger value="wallet">
                <Wallet className="w-4 h-4 mr-2" />
                Ví
              </TabsTrigger>
              <TabsTrigger value="my-nft">NFT của tôi</TabsTrigger>
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
                <div className="flex flex-col gap-6 mb-6">
                  <div className="flex gap-6">
                    <AvatarUpload
                      currentAvatar={profile?.avatarUrl || ""}
                      userName={username}
                      onAvatarSelect={handleAvatarSelect}
                      disabled={updateLoading}
                      error={selectedAvatar ? undefined : undefined}
                    />
                    <div className="flex-1">
                      <div className="mb-4">
                        <Label htmlFor="name">Tên hiển thị </Label>
                        <Input
                          id="name"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="mt-2"
                          maxLength={100}
                          disabled={updateLoading}
                        />
                      </div>
                      {updateError && (
                        <p className="text-sm text-red-500 mt-1">
                          {updateError}
                        </p>
                      )}
                      {updateSuccess && (
                        <p className="text-sm text-green-500 mt-1">
                          {updateSuccess}
                        </p>
                      )}
                      <Button
                        onClick={handleUpdateProfile}
                        disabled={updateLoading}
                      >
                        {updateLoading ? "Đang cập nhật..." : "Cập nhật"}
                      </Button>
                    </div>
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
                <h3 className="text-xl font-bold mb-6">Ví của tôi</h3>

                {/* Wallet Balance Overview */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 glass rounded-lg">
                    <div>
                      <div className="font-semibold">Số dư CAN</div>
                      <div className="text-2xl gradient-text font-bold">
                        {canBalance?.toLocaleString()} CAN
                      </div>
                    </div>
                    {/* <Button>Nạp tiền</Button> */}
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

            <TabsContent value="my-nft">
              <Card className="p-6 glass">
                <h3 className="text-xl font-bold mb-6">NFT của tôi</h3>
                <MyNFTCollection />
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsChangePasswordOpen(true)}
                    >
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

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
        userEmail={user?.email}
      />
    </div>
  );
}
