"use client";
import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { useNotificationStore } from "@/stores/notificationStore";
import {
  Leader,
  Partner,
  EcosystemItem,
  ContactFormData,
  ContactInfo,
  StatsCard,
} from "@/types/about";
import {
  Target,
  Users,
  Globe,
  TrendingUp,
  Shield,
  Zap,
  Mail,
  Phone,
  MapPin,
  Award,
  Building2,
} from "lucide-react";

/**
 * Custom hook để quản lý dữ liệu about us
 * Copy y hệt logic từ AboutUs.tsx gốc
 */
export const useAboutData = () => {
  const { user, isAuthenticated } = useUserStore();
  const { addNotification } = useNotificationStore();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Copy y hệt data từ component gốc
  const leaders: Leader[] = [
    {
      name: "Nguyễn Văn A",
      position: "CEO & Founder",
      description: "15+ năm kinh nghiệm trong lĩnh vực blockchain và fintech",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    },
    {
      name: "Trần Thị B",
      position: "CTO",
      description: "Chuyên gia công nghệ blockchain với nhiều dự án thành công",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    },
    {
      name: "Lê Văn C",
      position: "CFO",
      description: "Chuyên gia tài chính với kinh nghiệm tại các tập đoàn lớn",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    },
    {
      name: "Phạm Thị D",
      position: "CMO",
      description: "Chuyên gia marketing với track record ấn tượng",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    },
  ];

  const partners: Partner[] = [
    { name: "Binance", type: "Exchange Partner" },
    { name: "Coinbase", type: "Investment Partner" },
    { name: "Polygon", type: "Technology Partner" },
    { name: "Chainlink", type: "Oracle Partner" },
    { name: "Uniswap", type: "DeFi Partner" },
    { name: "AAVE", type: "Lending Partner" },
  ];

  const ecosystem: EcosystemItem[] = [
    {
      icon: "Zap",
      title: "DeFi Platform",
      description: "Nền tảng tài chính phi tập trung với APY cao",
    },
    {
      icon: "Shield",
      title: "NFT Marketplace",
      description: "Thị trường NFT với tài sản thực được token hóa",
    },
    {
      icon: "TrendingUp",
      title: "Staking Pool",
      description: "Hệ thống staking đa tầng với phần thưởng hấp dẫn",
    },
    {
      icon: "Globe",
      title: "DAO Governance",
      description: "Hệ thống quản trị phi tập trung do cộng đồng điều hành",
    },
  ];

  const contactInfo: ContactInfo[] = [
    {
      type: "email",
      title: "Email",
      details: ["contact@cannetwork.io", "support@cannetwork.io"],
      icon: "Mail",
    },
    {
      type: "phone",
      title: "Điện thoại",
      details: ["+84 901 234 567", "+84 901 234 568 (24/7 Support)"],
      icon: "Phone",
    },
    {
      type: "address",
      title: "Địa chỉ",
      details: [
        "Tầng 15, Tòa nhà FPT, 10 Phạm Văn Bạch",
        "Cầu Giấy, Hà Nội, Việt Nam",
      ],
      icon: "MapPin",
    },
  ];

  const statsCards: StatsCard[] = [
    {
      icon: "Users",
      value: "50K+",
      label: "Người dùng",
      color: "primary",
    },
    {
      icon: "TrendingUp",
      value: "$100M+",
      label: "TVL",
      color: "secondary",
    },
    {
      icon: "Globe",
      value: "150+",
      label: "Quốc gia",
      color: "accent",
    },
  ];

  // Copy y hệt logic handleSubmit từ component gốc
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    addNotification({
      type: "success",
      title: "Đã gửi thành công",
      message: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất!",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  const updateFormData = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    // Data
    leaders,
    partners,
    ecosystem,
    contactInfo,
    statsCards,
    formData,

    // Actions
    handleSubmit,
    updateFormData,
  };
};
