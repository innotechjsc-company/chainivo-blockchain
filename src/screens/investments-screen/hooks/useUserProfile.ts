import { useEffect, useState } from "react";
import { useAppSelector } from "@/stores";

interface UserProfile {
  username: string;
  can_balance: number;
  total_invested: number;
  membership_tier: string;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy thông tin từ Redux store
  const authUser = useAppSelector((state) => state.auth.user);
  const walletBalance = useAppSelector((state) => state.wallet.wallet?.balance || 0);
  const totalInvested = useAppSelector((state) => state.investment.totalValue || 0);
  const isAuthLoading = useAppSelector((state) => state.auth.isLoading);
  const isWalletLoading = useAppSelector((state) => state.wallet.isLoading);
  const isInvestmentLoading = useAppSelector((state) => state.investment.isLoading);

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
          username: authUser.username || authUser.email,
          can_balance: walletBalance,
          total_invested: totalInvested,
          membership_tier: authUser.role || "bronze", // Default tier
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
    error 
  };
};
