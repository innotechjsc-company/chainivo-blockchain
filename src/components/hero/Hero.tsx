"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Info, Rocket, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Nền tảng <span className="gradient-text text-glow">Blockchain</span>
            <br />
            Thế hệ mới
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Đầu tư thông minh, giao dịch NFT và nhận phần thưởng hấp dẫn mỗi
            ngày
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              asChild
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-gradient-to-r from-primary to-secondary text-foreground hover:opacity-90 shadow-[0_0_30px_hsl(var(--primary)/0.4)] h-12 rounded-md text-lg px-8"
            >
              <Link href="/investments">
                <Rocket className="w-4 h-4" />
                Bắt đầu đầu tư
              </Link>
            </Button>
            <Button asChild className="gap-2 h-12 text-lg px-8">
              <Link href="/about">
                <Info className="w-4 h-4" />
                Tìm hiểu thêm
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <Card className="glass rounded-xl p-6 hover:scale-105 transition-transform">
              <CardContent className="p-0">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <Users className="w-6 h-6 text-primary" />
                  <div className="text-3xl font-bold gradient-text">50K+</div>
                </div>
                <div className="text-muted-foreground">Người dùng</div>
              </CardContent>
            </Card>

            <Card className="glass rounded-xl p-6 hover:scale-105 transition-transform">
              <CardContent className="p-0">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <div className="text-3xl font-bold gradient-text">$2.5M+</div>
                </div>
                <div className="text-muted-foreground">Tổng vốn đầu tư</div>
              </CardContent>
            </Card>

            <Card className="glass rounded-xl p-6 hover:scale-105 transition-transform">
              <CardContent className="p-0">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <Zap className="w-6 h-6 text-primary" />
                  <div className="text-3xl font-bold gradient-text">99.9%</div>
                </div>
                <div className="text-muted-foreground">Uptime</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
