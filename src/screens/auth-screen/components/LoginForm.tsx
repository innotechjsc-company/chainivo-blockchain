"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { useAuthForm } from "../hooks/useAuthForm";

export const LoginForm = () => {
  const {
    formData,
    validationErrors,
    serverError,
    isLoading,
    handleChange,
    handleSubmit,
  } = useAuthForm("login");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('[LoginForm] onSubmit called');
    handleSubmit(e);
    return false;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate action="javascript:void(0)">
      {/* Server Error */}
      {serverError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

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
          <p className="text-sm text-destructive">{validationErrors.password}</p>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="flex justify-end">
        <button
          type="button"
          className="text-sm text-primary hover:underline"
          disabled={isLoading}
        >
          Quên mật khẩu?
        </button>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang đăng nhập...
          </>
        ) : (
          "Đăng nhập"
        )}
      </Button>
    </form>
  );
};
