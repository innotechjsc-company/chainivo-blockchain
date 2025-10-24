"use client";
import {
  FooterBrand,
  FooterSection,
  SocialLink,
  FooterBottom,
} from "@/types/footer";

/**
 * Custom hook để quản lý dữ liệu footer
 * Copy y hệt logic từ Footer.tsx gốc
 */
export const useFooterData = () => {
  // Copy y hệt brand data từ component gốc
  const brand: FooterBrand = {
    logo: "₿",
    name: "CryptoHub",
    description:
      "Nền tảng blockchain thế hệ mới, mang đến cơ hội đầu tư và giao dịch NFT an toàn, minh bạch.",
  };

  // Copy y hệt sections data từ component gốc
  const sections: FooterSection[] = [
    {
      title: "Liên kết",
      links: [
        { label: "Đầu tư", href: "#invest" },
        { label: "Hạng thành viên", href: "#membership" },
        { label: "NFT Market", href: "#nft" },
        { label: "Nhiệm vụ", href: "#missions" },
      ],
    },
    {
      title: "Tài nguyên",
      links: [
        { label: "Whitepaper", href: "#" },
        { label: "Tài liệu", href: "#" },
        { label: "API", href: "#" },
        { label: "Hỗ trợ", href: "#" },
      ],
    },
  ];

  // Copy y hệt social links từ component gốc
  const socialLinks: SocialLink[] = [
    { name: "Twitter", href: "#", icon: "Twitter" },
    { name: "MessageCircle", href: "#", icon: "MessageCircle" },
    { name: "Github", href: "#", icon: "Github" },
    { name: "Mail", href: "#", icon: "Mail" },
  ];

  // Copy y hệt bottom data từ component gốc
  const bottom: FooterBottom = {
    copyright: "© 2025 CryptoHub. All rights reserved.",
    legalLinks: [
      { label: "Điều khoản", href: "#" },
      { label: "Chính sách", href: "#" },
      { label: "Cookie", href: "#" },
    ],
  };

  return {
    brand,
    sections,
    socialLinks,
    bottom,
  };
};
