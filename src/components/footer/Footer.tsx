"use client";

import { Github, Twitter, MessageCircle, Mail } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-2xl font-bold">₿</span>
              </div>
              <span className="text-xl font-bold gradient-text">CryptoHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Nền tảng blockchain thế hệ mới, mang đến cơ hội đầu tư và giao
              dịch NFT an toàn, minh bạch.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#invest"
                  className="hover:text-primary transition-colors"
                >
                  Đầu tư
                </Link>
              </li>
              <li>
                <Link
                  href="#membership"
                  className="hover:text-primary transition-colors"
                >
                  Hạng thành viên
                </Link>
              </li>
              <li>
                <Link
                  href="#nft"
                  className="hover:text-primary transition-colors"
                >
                  NFT Market
                </Link>
              </li>
              <li>
                <Link
                  href="#missions"
                  className="hover:text-primary transition-colors"
                >
                  Nhiệm vụ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold mb-4">Tài nguyên</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Whitepaper
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Tài liệu
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Hỗ trợ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold mb-4">Cộng đồng</h3>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2025 CryptoHub. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary transition-colors">
              Điều khoản
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Chính sách
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
