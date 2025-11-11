import { useEffect, useState } from "react";
import { useAppSelector, WalletBalance } from "@/stores";

export interface UserProfile {
  name: string;
  username: string;
  email?: string;
  can_balance: number;
  total_invested: number;
  membership_tier: string;
  avatarUrl: string | null; // Doi sang camelCase de nhat quan
  walletAddress: string;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy thông tin từ Redux store
  const authUser = useAppSelector((state) => state.auth.user);
  const walletBalance = useAppSelector(
    (state) => state.wallet.wallet?.balance || 0
  );
  const totalInvested = useAppSelector(
    (state) => state.investment.totalValue || 0
  );
  const isAuthLoading = useAppSelector((state) => state.auth.isLoading);
  const isWalletLoading = useAppSelector((state) => state.wallet.isLoading);
  const isInvestmentLoading = useAppSelector(
    (state) => state.investment.isLoading
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Kiểm tra nếu user đã đăng nhập
        if (!authUser) {
          setError("User not authenticated");
          setProfile(null);
          setLoading(false);
          return;
        }

        // Tạo profile từ Redux store
        const userProfile: UserProfile = {
          name: authUser.name || authUser.email,
          username: authUser.name || authUser.email,
          email: authUser.email || undefined,
          can_balance: (walletBalance as WalletBalance)?.can || 0,
          total_invested: totalInvested,
          membership_tier: authUser.role || "bronze", // Default tier
          avatarUrl: authUser.avatarUrl || null, // Dung camelCase nhat quan
          walletAddress: authUser.walletAddress || "",
        };
        setProfile(userProfile);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch user profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser, walletBalance, totalInvested]);

  return {
    profile,
    loading: loading || isAuthLoading || isWalletLoading || isInvestmentLoading,
    error,
  };
};
