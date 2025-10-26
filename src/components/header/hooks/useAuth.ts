import { useRouter } from "next/navigation";
import { useAuthUser,  useLogout } from "@/stores/authStore";

interface UserProfile {
  username: string;
  avatar_url: string | null;
}

export const useAuth = (onSignOut?: () => void) => {
  const router = useRouter();
  const user = useAuthUser();
  const logout = useLogout();

  // Convert authStore user to userProfile format
  const userProfile: UserProfile | null = user
    ? {
        username: user.username,
        avatar_url: null, // Can be added to authStore user type later
      }
    : null;

  const handleSignOut = async () => {
    await logout();
    onSignOut?.();
    router.push("/");
  };

  const handleSignIn = () => {
    router.push("/auth");
  };

  return {
    user,
    userProfile,
    handleSignOut,
    handleSignIn,
  };
};
