import { useEffect, useState } from "react";

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock data for demonstration
        // TODO: Replace with actual API call
        const mockProfile: UserProfile = {
          username: "Nguyễn Văn A",
          can_balance: 125000,
          total_invested: 5000,
          membership_tier: "gold",
        };

        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setProfile(mockProfile);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch user profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};
