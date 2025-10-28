"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, User, Wallet, Loader2, AlertCircle } from "lucide-react";
import { useAuthForm } from "../hooks/useAuthForm";

export const RegisterForm = () => {
  const {
    formData,
    validationErrors,
    serverError,
    isLoading,
    handleChange,
    handleSubmit,
  } = useAuthForm("register");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e, formData as any);
    return false;
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6"
      noValidate
      action="javascript:void(0)"
    >
      {/* Username Field */}
      <div className="space-y-2">
        <Label htmlFor="username">Tên người dùng</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            id="username"
            type="text"
            placeholder="Nhập tên người dùng"
            className="pl-10"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            disabled={isLoading}
          />
        </div>
        {validationErrors.username && (
          <p className="text-sm text-destructive">
            {validationErrors.username}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            className="pl-10"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            disabled={isLoading}
          />
        </div>
        {validationErrors.email && (
          <p className="text-sm text-destructive">{validationErrors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            disabled={isLoading}
          />
        </div>
        {validationErrors.password && (
          <p className="text-sm text-destructive">
            {validationErrors.password}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            disabled={isLoading}
          />
        </div>
        {validationErrors.confirmPassword && (
          <p className="text-sm text-destructive">
            {validationErrors.confirmPassword}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang đăng ký...
          </>
        ) : (
          "Đăng ký"
        )}
      </Button>

      {/* Terms and Conditions */}
      <p className="text-xs text-center text-muted-foreground">
        Bằng cách đăng ký, bạn đồng ý với{" "}
        <a href="/terms" className="text-primary hover:underline">
          Điều khoản dịch vụ
        </a>{" "}
        và{" "}
        <a href="/privacy" className="text-primary hover:underline">
          Chính sách bảo mật
        </a>
      </p>
    </form>
  );
};
