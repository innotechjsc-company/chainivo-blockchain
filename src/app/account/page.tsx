"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Wallet, History, Settings, FileText } from "lucide-react";
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
import { DigitizingNftScreen } from "@/screens/digitizing-nft-screen";
import { DigitizationRequestList } from "@/components/account/DigitizationRequestList";
import { TOKEN_DEAULT_CURRENCY, config } from "@/api/config";

interface Profile {
  name: string;
  avatarUrl: string | null; //
  can_balance: number;
  membership_tier: string;
  total_invested: number;
}

export default function AccountManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [tabValue, setTabValue] = useState<string>(() => {
    const sectionParam = searchParams.get("section");
    return sectionParam ?? "profile";
  });
  const user = useAppSelector((state) => state.auth.user);
  const walletSectionRef = useRef<HTMLDivElement | null>(null);

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
    setLoading(false);
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

  useEffect(() => {
    const sectionParam = searchParams.get("section");
    if (sectionParam && sectionParam !== tabValue) {
      setTabValue(sectionParam);
    }
  }, [searchParams, tabValue]);

  useEffect(() => {
    if (tabValue === "wallet" && walletSectionRef.current) {
      walletSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [tabValue]);

  const handleTabChange = (value: string) => {
    setTabValue(value);
    // Luôn lưu tab value vào URL để giữ nguyên khi reload
    router.replace(`/account?section=${value}`);
  };

  // Validation: Chi cho phep chu (co dau), so, khoang trang
  const validateName = (name: string): string | null => {
    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      return "Tên không được để trống";
    }

    if (trimmedName.length > 100) {
      return "Ten khong duoc vuot qua 100 ky tu ";
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

      let uploadedAvatarId: string | undefined;
      if (hasAvatarChange && selectedAvatar) {
        const uploadResponse = await MediaService.uploadAvatar(selectedAvatar);
        if (uploadResponse.success && uploadResponse.data) {
          uploadedAvatarId = uploadResponse.data.id;
          formData.append("avatar", uploadedAvatarId);
        } else {
          setUpdateError(uploadResponse.error || "Loi khi upload anh dai dien");
          setUpdateLoading(false);
          return;
        }
      }

      // Call API
      const response = await UserService.updateProfile(formData as any);

      if (response.success) {
        // Refetch profile to get the latest data
        await refetchProfile();

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
  const referralCode = ((user as any)?.refCode as string) || "";
  const handleCopyReferral = async () => {
    try {
      if (!referralCode) return;
      await navigator.clipboard.writeText(referralCode);
    } catch (err) {
      console.error("Failed to copy referral code:", err);
    }
  };

  const refetchProfile = async () => {
    try {
      const response = await UserService.getCurrentUserProfile();
      if (response.success && response.data) {
        const userProfile = response.data;
        const newProfile: Profile = {
          name: userProfile.name || "",
          avatarUrl: userProfile.avatarUrl || null,
          can_balance: profile?.can_balance || 0,
          membership_tier: profile?.membership_tier || "bronze",
          total_invested: profile?.total_invested || 0,
        };
        setProfile(newProfile);
        setUsername(newProfile.name);
        dispatch(
          updateProfile({
            name: userProfile.name,
            avatarUrl: userProfile.avatarUrl,
          })
        );

        // Update localStorage as well to prevent useEffect from overwriting with stale data
        const currentUserInfo = LocalStorageService.getUserInfo();
        if (currentUserInfo) {
          LocalStorageService.setUserInfo({
            ...currentUserInfo,
            name: userProfile.name || currentUserInfo.name,
            avatarUrl: userProfile.avatarUrl || currentUserInfo.avatarUrl,
          });
        }
      }
    } catch (error) {
      console.error("Failed to refetch profile:", error);
    }
  };

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
    dong: "text-orange-600",
    bac: "text-gray-400",
    vang: "text-yellow-500",
    "kim cuong": "text-purple-500",
    "kim cương": "text-purple-500",
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-8xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            <span className="gradient-text">Quản lý tài khoản</span>
          </h1>

          <Tabs
            value={tabValue}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-8 mb-8">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Hồ sơ
              </TabsTrigger>
              {/* <TabsTrigger value="wallet">
                <Wallet className="w-4 h-4 mr-2" />
                Ví
              </TabsTrigger> */}
              <TabsTrigger value="my-nft">
                <User className="w-4 h-4 mr-2" />
                NFT của tôi
              </TabsTrigger>
              <TabsTrigger value="nft-co-phan">
                <User className="w-4 h-4 mr-2" />
                NFT cổ phần
              </TabsTrigger>
              <TabsTrigger value="referral">
                <User className="w-4 h-4 mr-2" />
                Mã giới thiệu
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="w-4 h-4 mr-2" />
                Lịch sử
              </TabsTrigger>
              <TabsTrigger value="digitizing-request">
                <FileText className="w-4 h-4 mr-2" />
                Số hóa NFT
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
                      Số dư TOKEN
                    </div>
                    <div className="text-2xl font-bold gradient-text">
                      {canBalance?.toLocaleString()} {TOKEN_DEAULT_CURRENCY}
                    </div>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      Hạng thành viên
                    </div>
                    <div
                      className={`text-2xl font-bold capitalize ${
                        tierColors[
                          (user as any)?.rank?.name?.toLowerCase() || "dong"
                        ]
                      }`}
                    >
                      {(user as any)?.rank?.name || "Đồng"}
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

                {/* Thông tin tài khoản */}
                <div className="mb-6 pt-6 border-t border-white/10">
                  <h4 className="text-lg font-semibold mb-3">
                    Thông tin tài khoản
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">
                        Email
                      </div>
                      <div className="text-base font-medium">
                        {user?.email || "—"}
                      </div>
                    </div>
                    <div className="glass p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">
                        Địa chỉ ví
                      </div>
                      <div className="text-xs font-mono break-all">
                        {user?.walletAddress || "Chưa kết nối"}
                      </div>
                    </div>
                    {/* <div className="glass p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">
                        Vai trò
                      </div>
                      <div className="text-base font-medium capitalize">
                        {user?.role || "user"}
                      </div>
                    </div> */}
                    <div className="glass p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">
                        Điểm tích lũy
                      </div>
                      <div className="text-base font-bold gradient-text">
                        {user?.points?.toLocaleString() || 0} điểm
                      </div>
                    </div>
                    <div className="glass p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">
                        Mã giới thiệu
                      </div>
                      <div className="text-base font-mono font-medium">
                        {user?.refCode || "—"}
                      </div>
                    </div>
                    <div className="glass p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">
                        Trạng thái tài khoản
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            user?.isActive && !user?.isSuspended
                              ? "bg-green-500/20 text-green-500"
                              : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {user?.isSuspended
                            ? "Đã bị khóa"
                            : user?.isActive
                            ? "Hoạt động"
                            : "Không hoạt động"}
                        </span>
                      </div>
                      {user?.suspensionReason && (
                        <p className="text-xs text-red-500 mt-2">
                          Lý do: {user.suspensionReason}
                        </p>
                      )}
                    </div>
                    <div className="glass p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">
                        Ngày tạo tài khoản
                      </div>
                      <div className="text-base font-medium">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                          : "—"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trạng thái xác minh */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3">
                    Trạng thái xác minh
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Xác minh Email
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            user?.isEmailVerified
                              ? "bg-green-500/20 text-green-500"
                              : "bg-gray-500/20 text-gray-500"
                          }`}
                        >
                          {user?.isEmailVerified
                            ? "Đã xác minh"
                            : "Chưa xác minh"}
                        </span>
                      </div>
                    </div>
                    <div className="glass p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Xác minh KYC
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            user?.isKYCVerified
                              ? "bg-green-500/20 text-green-500"
                              : "bg-gray-500/20 text-gray-500"
                          }`}
                        >
                          {user?.isKYCVerified
                            ? "Đã xác minh"
                            : "Chưa xác minh"}
                        </span>
                      </div>
                    </div>
                    <div className="glass p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Xác minh Ví
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            user?.isWalletVerified
                              ? "bg-green-500/20 text-green-500"
                              : "bg-gray-500/20 text-gray-500"
                          }`}
                        >
                          {user?.isWalletVerified
                            ? "Đã xác minh"
                            : "Chưa xác minh"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio nếu có */}
                {user?.bio && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Giới thiệu</h4>
                    <div className="glass p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {user.bio}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="wallet">
              <div ref={walletSectionRef}>
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
              </div>
            </TabsContent>

            <TabsContent value="my-nft">
              <Card className="p-6 glass">
                <h3 className="text-xl font-bold mb-6">NFT của tôi</h3>
                <MyNFTCollection type="my-nft" />
              </Card>
            </TabsContent>

            <TabsContent value="nft-co-phan">
              <Card className="p-6 glass">
                <h3 className="text-xl font-bold mb-6">NFT cổ phần</h3>
                <MyNFTScreen type="investment" />
              </Card>
            </TabsContent>
            <TabsContent value="referral">
              <Card className="p-6 glass">
                <h3 className="text-xl font-bold mb-6">Mã giới thiệu</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Mã giới thiệu:
                  </span>
                  <span className="font-mono text-lg text-primary">
                    {referralCode || "Chưa có"}
                  </span>
                  {referralCode && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs cursor-pointer"
                      onClick={handleCopyReferral}
                    >
                      Sao chép
                    </Button>
                  )}
                </div>
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
                      Đang tải giao dịch...
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
            <TabsContent value="digitizing-request">
              <Card className="p-6 glass">
                <DigitizationRequestList />
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
