import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useAppSelector,
  useAppDispatch,
  setLoginSuccess,
  setLoading,
  setError as setErrorAction,
  clearError as clearErrorAction,
} from "@/stores";
import {
  AuthService,
  type LoginCredentials,
  type RegisterData,
  type AuthResponse,
  type RegisterResponse,
} from "@/api/services/auth-service";

interface ValidationErrors {
  email?: string;
  password?: string;
  name?: string;
  walletAddress?: string;
  confirmPassword?: string;
}

export const useAuthForm = (type: "login" | "register") => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error: serverError, isLoading } = useAppSelector(
    (state) => state.auth
  );

  const clearError = useCallback(() => {
    dispatch(clearErrorAction());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    walletAddress: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  // Validate email
  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email là bắt buộc";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email không hợp lệ";
    return undefined;
  };

  // Validate password
  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Mật khẩu là bắt buộc";
    if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    return undefined;
  };

  // Validate name
  const validateName = (name: string): string | undefined => {
    if (!name) return "Tên người dùng là bắt buộc";
    if (name.length < 3) return "Tên người dùng phải có ít nhất 3 ký tự";
    return undefined;
  };

  // Validate confirm password
  const validateConfirmPassword = (
    confirmPassword: string,
    password: string
  ): string | undefined => {
    if (!confirmPassword) return "Xác nhận mật khẩu là bắt buộc";
    if (confirmPassword !== password) return "Mật khẩu không khớp";
    return undefined;
  };

  // Validate form
  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    errors.email = validateEmail(formData.email);
    errors.password = validatePassword(formData.password);

    if (type === "register") {
      errors.name = validateName(formData.name);
      errors.confirmPassword = validateConfirmPassword(
        formData.confirmPassword,
        formData.password
      );
    }

    setValidationErrors(errors);

    // Return true if no errors
    return !Object.values(errors).some((error) => error !== undefined);
  }, [formData, type]);

  // Handle field change
  const handleChange = useCallback(
    (field: keyof typeof formData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear validation error for this field
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
      // Clear server error when user types
      clearError();
    },
    [clearError]
  );

  // Handle login
  const handleLogin = useCallback(async () => {
    console.log("[AUTH] Starting login process...");

    try {
      dispatch(setLoading(true));
      dispatch(setErrorAction(null));

      const response: AuthResponse = await AuthService.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.token && response.user) {
        console.log("[AUTH] Login successful");

        // Map Payload CMS user to AuthUser
        const authUser = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name || "",
          avatarUrl: response.user.avatarUrl || "", // Include avatarUrl tu AuthService.login()
          walletAddress: response.user.walletAddress || "",
          role: response.user.role || "user",
          createdAt: response.user.createdAt,
          updatedAt: response.user.updatedAt,
        };

        // Save to Redux store
        dispatch(setLoginSuccess({ user: authUser, token: response.token }));

        // Check if user has wallet address
        if (response.user.walletAddress) {
          console.log("[AUTH] User has wallet address, redirecting to home");
          router.push("/");
        } else {
          console.log("[AUTH] User has no wallet, redirecting to wallet page");
          router.push("/wallet");
        }
      }
    } catch (error: any) {
      console.error("[AUTH] Login error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Đăng nhập thất bại";
      dispatch(setErrorAction(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [formData.email, formData.password, dispatch, router]);

  // Handle register
  const handleRegister = useCallback(async () => {
    console.log("[AUTH] Starting registration process...");

    try {
      dispatch(setLoading(true));
      dispatch(setErrorAction(null));

      const registerPayload: RegisterData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
      };

      const response: RegisterResponse = await AuthService.register(
        registerPayload
      );

      if (response.doc && response.doc.email) {
        console.log("[AUTH] Registration successful, redirecting to login");
        router.push("/auth?tab=login");
      }
    } catch (error: any) {
      console.error("[AUTH] Register error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Đăng ký thất bại";
      dispatch(setErrorAction(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [formData.email, formData.password, formData.name, dispatch, router]);

  // Handle submit
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      // CRITICAL: Prevent default form submission behavior FIRST
      e.preventDefault();
      e.stopPropagation();

      console.log("[AUTH] Form submitted, starting validation...");

      // Validate form before submitting
      if (!validateForm()) {
        console.log("[AUTH] Validation failed");
        return;
      }

      console.log("[AUTH] Validation passed");

      try {
        if (type === "login") {
          await handleLogin();
        } else {
          await handleRegister();
        }
      } catch (error) {
        console.log("[AUTH] Error caught:", error);
      }
    },
    [type, validateForm, handleLogin, handleRegister]
  );

  return {
    formData,
    validationErrors,
    serverError,
    isLoading: isLoading || isConnectingWallet,
    isConnectingWallet,
    handleChange,
    handleSubmit,
    clearError,
  };
};
