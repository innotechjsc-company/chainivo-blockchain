"use client";

import { Button, Badge, ThemeToggle } from "@/components";
import { ArrowRight, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background with Blur Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 dark:from-blue-950 dark:via-blue-900 dark:to-purple-950">
        {/* Blur circles */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header Navigation */}
        <header className="px-6 py-4 lg:px-8">
          <nav className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-white font-bold text-xl">CryptoHub</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-white hover:text-cyan-300 transition-colors"
              >
                Trang chủ
              </Link>
              <Link
                href="/investments"
                className="text-white/80 hover:text-cyan-300 transition-colors"
              >
                Đầu tư
              </Link>
              <Link
                href="/membership"
                className="text-white/80 hover:text-cyan-300 transition-colors"
              >
                Mua hạng
              </Link>
              <Link
                href="/nftmarket"
                className="text-white/80 hover:text-cyan-300 transition-colors"
              >
                NFT Market
              </Link>
              <Link
                href="/missions"
                className="text-white/80 hover:text-cyan-300 transition-colors"
              >
                Nhiệm vụ
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button
                variant="outline"
                className="bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white"
              >
                Đăng nhập
              </Button>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="px-6 py-20 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Content */}
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Nền tảng{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Blockchain
                </span>
                <br />
                Thế hệ mới
              </h1>

              <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
                Đầu tư thông minh, giao dịch NFT và nhận phần thưởng hấp dẫn dần
                mỗi ngày
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  size="lg"
                  gradient
                  shadow
                  className="text-white px-8"
                  icon={<ArrowRight className="h-5 w-5" />}
                  iconPosition="end"
                >
                  Bắt đầu đầu tư
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white px-8"
                >
                  Tìm hiểu thêm
                </Button>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
                {/* Stat 1 */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-center mb-3">
                    <Users className="h-8 w-8 text-cyan-400" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    50K+
                  </div>
                  <div className="text-white/70">Người dùng</div>
                </div>

                {/* Stat 2 */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-center mb-3">
                    <TrendingUp className="h-8 w-8 text-cyan-400" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    $2.5M+
                  </div>
                  <div className="text-white/70">Tổng vốn đầu tư</div>
                </div>

                {/* Stat 3 */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-center mb-3">
                    <Zap className="h-8 w-8 text-cyan-400" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    99.9%
                  </div>
                  <div className="text-white/70">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
