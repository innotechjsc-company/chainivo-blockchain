import { useEffect, useState } from "react";

interface UserMembership {
  username: string;
  can_balance: number;
  membership_tier: string;
}

interface TierInfo {
  name: string;
  color: string;
  next: string;
  required: number;
}

export const useUserMembership = () => {
  const [profile, setProfile] = useState<UserMembership | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tierInfo: Record<string, TierInfo> = {
    bronze: {
      name: "Bronze",
      color: "text-amber-600",
      next: "Silver",
      required: 250,
    },
    silver: {
      name: "Silver",
      color: "text-gray-400",
      next: "Gold",
      required: 750,
    },
    gold: {
      name: "Gold",
      color: "text-yellow-400",
      next: "Platinum",
      required: 2500,
    },
    platinum: {
      name: "Platinum",
      color: "text-cyan-400",
      next: "MAX",
      required: 0,
    },
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock data for demonstration
        // TODO: Replace with actual API call
        const mockProfile: UserMembership = {
          username: "Nguyễn Văn A",
          can_balance: 1250,
          membership_tier: "bronze",
        };

        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setProfile(mockProfile);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch user membership"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const currentTier = profile ? tierInfo[profile.membership_tier] : null;
  const progressToNext =
    currentTier && currentTier.next !== "MAX"
      ? (profile!.can_balance / currentTier.required) * 100
      : 100;

  return {
    profile,
    loading,
    error,
    currentTier,
    progressToNext,
    tierInfo,
  };
};
