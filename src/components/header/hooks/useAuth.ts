import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useAppSelector,
  useAppDispatch,
  logout as logoutAction,
  initializeAuth,
} from "@/stores";

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
    await dispatch(logoutAction());
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
