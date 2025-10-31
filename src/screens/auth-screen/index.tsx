"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { Shield } from "lucide-react";

export const AuthScreen = () => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>("login");

  // Check URL params for tab selection
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "register") {
      setActiveTab("register");
    } else {
      setActiveTab("login");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 animate-glow">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">CryptoHub</h1>
          <p className="text-muted-foreground mt-2 text-center">
            Nền tảng đầu tư blockchain hàng đầu
          </p>
        </div>

        {/* Auth Card */}
        <Card className="glass border-border/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {activeTab === "login" ? "Đăng nhập" : "Đăng ký"}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === "login"
                ? "Chào mừng bạn quay trở lại!"
                : "Tạo tài khoản mới để bắt đầu"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register">Đăng ký</TabsTrigger>
              </TabsList> */}

              <TabsContent value="login">
                <LoginForm />
              </TabsContent>

              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 CryptoHub. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
