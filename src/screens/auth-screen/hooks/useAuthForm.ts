import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useAppSelector,
  useAppDispatch,
  login as loginAction,
  register as registerAction,
  clearError as clearErrorAction,
  updateAuthProfile,
} from "@/stores";
import type {
  LoginCredentials,
  RegisterData,
} from "@/api/services/auth-service";
import { UserService } from "@/api/services/user-service";

// MetaMask types
interface MetaMaskProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: MetaMaskProvider;
  }
}

interface ValidationErrors {
  email?: string;
  password?: string;
  username?: string;
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
    username: "",
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

  // Validate username
  const validateUsername = (username: string): string | undefined => {
    if (!username) return "Tên người dùng là bắt buộc";
    if (username.length < 3) return "Tên người dùng phải có ít nhất 3 ký tự";
    return undefined;
  };

  // Validate wallet address
  const validateWalletAddress = (address: string): string | undefined => {
    if (!address) return "Địa chỉ ví là bắt buộc";
    // Basic validation - can be enhanced based on specific blockchain
    if (address.length < 20) return "Địa chỉ ví không hợp lệ";
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
      errors.username = validateUsername(formData.username);
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

      console.log("[AUTH] Validation passed, starting async dispatch...");

      try {
        if (type === "login") {
          const result = await dispatch(
            loginAction({
              email: formData.email,
              password: formData.password,
            })
          ).unwrap();

          if (result && result.token) {
            console.log("Login successful, checking wallet address...");
            console.log("User data:", result.user);

            // Check if user has wallet address
            if (result.user?.walletAddress) {
              console.log(
                "User has wallet address:",
                result.user.walletAddress
              );

              // Set loading state for wallet connection
              setIsConnectingWallet(true);

              try {
                if (result.user.walletAddress) {
                  console.log(
                    "MetaMask connected successfully, redirecting to home"
                  );
                  router.push("/");
                } else {
                  console.log(
                    "MetaMask connection failed, redirecting to wallet page"
                  );
                  router.push("/wallet");
                }
              } catch (error) {
                console.error("Error connecting to MetaMask:", error);
                router.push("/wallet");
              } finally {
                setIsConnectingWallet(false);
              }
            } else {
              console.log(
                "User has no wallet address, redirecting to wallet page"
              );
              router.push("/wallet");
            }
          }
        } else {
          const registerPayload: RegisterData = {
            email: formData.email,
            password: formData.password,
            username: formData.username,
          };
          const result = await dispatch(
            registerAction(registerPayload)
          ).unwrap();

          // Registration successful - redirect to login page
          if (result && result.success) {
            console.log("Registration successful, redirecting to login");
            router.push("/auth?tab=login");
          }
        }
      } catch (error) {
        // Error is already in Redux state and will be displayed via serverError
        console.log("[AUTH] Error caught:", error);
      }
    },
    [
      formData.email,
      formData.password,
      formData.username,
      type,
      validateForm,
      dispatch,
      router,
      setIsConnectingWallet,
    ]
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
