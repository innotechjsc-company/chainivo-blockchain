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
import { MediaService } from "@/api/services/media-service";
import { LocalStorageService } from "@/services";
import { ChangePasswordDialog } from "@/components/account/ChangePasswordDialog";
import { AvatarUpload } from "@/components/account/AvatarUpload";
import { updateProfile } from "@/stores/authSlice";
import { MyNFTCollection } from "@/components/account/MyNFTCollection";
import { TransactionStatsCards } from "@/components/account/TransactionStatsCards";
import { TransactionFilters } from "@/components/account/TransactionFilters";
import { TransactionTable } from "@/components/account/TransactionTable";
import { TransactionPagination } from "@/components/account/TransactionPagination";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import { Spinner } from "@/components/ui/spinner";
import MyNFTScreen from "@/screens/my-nft-screen";

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

  // Backup original avatar từ server (template)
  const [originalAvatarUrl, setOriginalAvatarUrl] = useState<string | null>(null);

  const user = useAppSelector((state) => state.auth.user);

  // Transaction History hook
  const {
    transactions: txHistoryTransactions,
    stats: txStats,
    loading: txHistoryLoading,
    error: txHistoryError,
    filters: txFilters,
    setFilter: setTxFilter,
    resetFilters: resetTxFilters,
    pagination: txPagination,
    goToPage: txGoToPage,
    refetch: refetchTxHistory,
  } = useTransactionHistory();

  useEffect(() => {
    // Simulate loading user profile
    const timer = setTimeout(() => {
      // Get avatar from localStorage or Redux
      const userInfo = LocalStorageService.getUserInfo();
      const avatarUrl = userInfo?.avatarUrl || user?.avatarUrl || null;

      // Mock profile data
      const mockProfile: Profile = {
        name: user?.name as string,
        avatarUrl: avatarUrl,
        can_balance: 12500,
        membership_tier: "gold",
        total_invested: 25000,
      };
      setProfile(mockProfile);
      setUsername(mockProfile.name);

      // Store original avatar URL as backup/template
      setOriginalAvatarUrl(avatarUrl);
      console.log('[ACCOUNT] Original avatar URL set as backup:', avatarUrl);

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
        console.error("Không thể lấy số dư CAN:", error);
      }
    };

    fetchCanBalance();
  }, []);

  // Validation: Chỉ cho phép chữ (có dấu), số, khoảng trắng
  const validateName = (name: string): string | null => {
    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      return "Tên không được để trống";
    }

    if (trimmedName.length > 100) {
      return "Tên không được vượt quá 100 ký tự";
    }

    // Regex: chữ cái (a-z, A-Z), chữ Việt có dấu, số (0-9), khoảng trắng
    const nameRegex = /^[a-zA-Z0-9\u00C0-\u1EF9\s]+$/;
    if (!nameRegex.test(trimmedName)) {
      return "Tên chỉ được chứa chữ cái, số và khoảng trắng";
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
      setUpdateError("Vui lòng cập nhật tên hoặc ảnh đại diện");
      return;
    }

    // Validate name if changed
    if (hasNameChange) {
      const validationError = validateName(trimmedName);
      if (validationError) {
        setUpdateError(validationError);
        return;
      }
    }

    setUpdateLoading(true);

    try {
      // ========== BUOC 1: Upload avatar (neu co) ==========
      let avatarMediaId: string | undefined;

      if (hasAvatarChange && selectedAvatar) {
        console.log('[UPDATE-PROFILE] Step 1: Tải lên ảnh đại diện...', {
          fileName: selectedAvatar.name,
          fileSize: selectedAvatar.size,
          fileType: selectedAvatar.type,
        });
        const uploadResponse = await MediaService.uploadAvatar(selectedAvatar);
        console.log('[UPDATE-PROFILE] Upload response:', uploadResponse);

        if (!uploadResponse.success || !uploadResponse.data) {
          console.error('[UPDATE-PROFILE] Tải lên ảnh đại diện thất bại:', uploadResponse.error);
          setUpdateError(uploadResponse.error || "Tải lên ảnh đại diện thất bại");
          setUpdateLoading(false);
          return;
        }

        avatarMediaId = uploadResponse.data.id;
        console.log('[UPDATE-PROFILE] ✅ Tải lên ảnh đại diện thành công:', {
          mediaId: avatarMediaId,
          mediaUrl: uploadResponse.data.url,
          fileName: uploadResponse.data.filename,
        });
      }

      // ========== BUOC 2: Update profile voi JSON ==========
      const updateData: { name?: string; avatar?: string } = {};
      if (hasNameChange) updateData.name = trimmedName;
      if (avatarMediaId) updateData.avatar = avatarMediaId;

      console.log('[UPDATE-PROFILE] Step 2: Cập nhật hồ sơ (JSON):', updateData);
      const response = await UserService.updateProfile(updateData);
      console.log('[UPDATE-PROFILE] Update response:', response);

      if (!response.success) {
        console.error('[UPDATE-PROFILE] Cập nhật hồ sơ thất bại:', response.error);
        setUpdateError(response.error || "Có lỗi khi cập nhật hồ sơ");
        setUpdateLoading(false);
        return;
      }

      console.log('[UPDATE-PROFILE] ✅ Cập nhật hồ sơ thành công');

      // ========== BUOC 3: Goi GET /api/user/profile de lay avatarUrl ==========
      // Thong nhat voi login flow
      console.log('[UPDATE-PROFILE] Step 3: Lấy thông tin hồ sơ mới (GET /api/user/profile)...');
      const profileResponse = await UserService.getCurrentUserProfile();
      console.log('[UPDATE-PROFILE] Profile response:', profileResponse);

      if (!profileResponse.success) {
        console.warn('[UPDATE-PROFILE] ⚠️ Không thể lấy thông tin hồ sơ mới:', profileResponse.error);
      }

      // Parse user data tu profileResponse
      const userData = profileResponse.data as any;
      const newAvatarUrl = userData?.avatarUrl || profile?.avatarUrl || null;
      const newName = userData?.name || trimmedName;

      console.log('[UPDATE-PROFILE] ✅ Dữ liệu hồ sơ mới:', { newName, newAvatarUrl });

      // ========== BUOC 4: Update Redux ==========
      const reduxUpdateData: any = {};
      if (hasNameChange) reduxUpdateData.name = newName;
      if (hasAvatarChange && newAvatarUrl) reduxUpdateData.avatarUrl = newAvatarUrl;

      console.log('[UPDATE-PROFILE] Step 4: Cập nhật Redux:', reduxUpdateData);
      dispatch(updateProfile(reduxUpdateData));
      console.log('[UPDATE-PROFILE] ✅ Redux cập nhật xong');

      // ========== BUOC 5: Update LocalStorage ==========
      console.log('[UPDATE-PROFILE] Step 5: Cập nhật LocalStorage...');
      const currentUserInfo = LocalStorageService.getUserInfo();
      if (currentUserInfo) {
        const updatedUserInfo = {
          ...currentUserInfo,
          name: newName,
          avatarUrl: newAvatarUrl,
        };
        LocalStorageService.setUserInfo(updatedUserInfo);
        console.log('[UPDATE-PROFILE] ✅ LocalStorage cập nhật xong:', updatedUserInfo);
      }

      // ========== BUOC 6: Update local state ==========
      console.log('[UPDATE-PROFILE] Step 6: Cập nhật local state...');
      setProfile({
        ...profile,
        name: newName,
        avatarUrl: newAvatarUrl,
      } as Profile);

      // ========== BUOC 7: Update backup avatar (template) ==========
      // Sau khi upload thành công, cập nhật backup để đảm bảo nếu user
      // chọn ảnh khác sau này, sẽ so sánh với avatar mới từ server
      setOriginalAvatarUrl(newAvatarUrl);
      console.log('[UPDATE-PROFILE] ✅ Backup avatar updated:', newAvatarUrl);

      // Clear avatar upload state (preview)
      setSelectedAvatar(null);
      setAvatarPreview(null);
      console.log('[UPDATE-PROFILE] ✅ Avatar preview state cleared');

      setUpdateSuccess("Cập nhật hồ sơ thành công");
      console.log('[UPDATE-PROFILE] 🎉 Toàn bộ cập nhật hoàn tất!');

      setTimeout(() => setUpdateSuccess(null), 3000);
    } catch (error: any) {
      console.error('[UPDATE-PROFILE] Unexpected error:', error);
      setUpdateError(error.message || "Khong the cap nhat profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleAvatarSelect = (file: File | null, previewUrl: string | null) => {
    if (file && previewUrl) {
      console.log('[ACCOUNT] Avatar selected:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        previewLength: previewUrl.length,
        backupAvatarUrl: originalAvatarUrl, // Ensure backup là safe
      });
    } else {
      console.log('[ACCOUNT] Avatar selection cleared');
    }
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
        <div className="max-w-8xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            <span className="gradient-text">Quản lý tài khoản</span>
          </h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Hồ sơ
              </TabsTrigger>
              <TabsTrigger value="wallet">
                <Wallet className="w-4 h-4 mr-2" />
                Ví
              </TabsTrigger>
              <TabsTrigger value="my-nft">
                <User className="w-4 h-4 mr-2" />
                NFT của tôi
              </TabsTrigger>
              <TabsTrigger value="nft-co-phan">
                <User className="w-4 h-4 mr-2" />
                NFT cổ phần
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
                <div className="flex flex-col gap-6 mb-6">
                  <div className="flex gap-6">
                    <AvatarUpload
                      currentAvatar={originalAvatarUrl || ""}
                      previewUrl={avatarPreview}
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

            <TabsContent value="nft-co-phan">
              <Card className="p-6 glass">
                <h3 className="text-xl font-bold mb-6">NFT cổ phần</h3>
                <MyNFTScreen />
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="p-6 glass space-y-6">
                <h3 className="text-xl font-bold">Lịch sử giao dịch</h3>

                {/* Transaction Stats Cards */}
                <TransactionStatsCards {...txStats} />

                {/* Filters */}
                <TransactionFilters
                  filters={txFilters}
                  onFilterChange={setTxFilter}
                  onReset={resetTxFilters}
                />

                {/* Loading State */}
                {txHistoryLoading && (
                  <div className="flex items-center justify-center py-12">
                    <Spinner className="w-8 h-8 mr-2" />
                    <span className="text-muted-foreground">
                      Dang tai giao dich...
                    </span>
                  </div>
                )}

                {/* Error State */}
                {txHistoryError && (
                  <div className="text-center py-12">
                    <p className="text-red-500 mb-4">{txHistoryError}</p>
                    <Button variant="outline" onClick={refetchTxHistory}>
                      Thu lai
                    </Button>
                  </div>
                )}

                {/* Transaction Table */}
                {!txHistoryLoading && !txHistoryError && (
                  <>
                    <TransactionTable transactions={txHistoryTransactions} />
                    <TransactionPagination
                      pagination={txPagination}
                      onPageChange={txGoToPage}
                    />
                  </>
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
                        {user?.email}
                      </div>
                    </div>
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
