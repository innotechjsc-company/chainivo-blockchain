import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useAppSelector,
  useAppDispatch,
  logoutAction,
  initializeAuth,
} from "@/stores";
import { AuthService } from "@/api/services/auth-service";

interface UserProfile {
  username: string;
  avatar_url: string | null;
}

export const useAuth = (onSignOut?: () => void) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Initialize auth state from localStorage on mount/reload
  useEffect(() => {
    // Only initialize if not already authenticated
    if (!isAuthenticated) {
      dispatch(initializeAuth());
    }
  }, [dispatch, isAuthenticated]);

  // Convert authStore user to userProfile format
  const userProfile: UserProfile | null = user
    ? {
        username: user.email,
        avatar_url: null, // Can be added to authStore user type later
      }
    : null;

  const handleSignOut = async () => {
    try {
      // Call AuthService logout (clears localStorage and API call)
      await AuthService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear Redux state
      dispatch(logoutAction());
      onSignOut?.();
      router.push("/");
    }
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
