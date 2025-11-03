"use client";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch, addNotification } from "@/stores";
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
import AboutService from "@/api/services/about-service";

/**
 * Custom hook để quản lý dữ liệu about us
 * Copy y hệt logic từ AboutUs.tsx gốc
 */
export const useAboutData = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [leadersLoading, setLeadersLoading] = useState<boolean>(false);
  const [leadersError, setLeadersError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const fetchLeaders = async () => {
    setLeadersLoading(true);
    setLeadersError(null);

    try {
      const response = await AboutService.getLeaders();

      // Server tra ve truc tiep pagination object, khong co wrapper success/data
      if (response && (response as any).docs) {
        const leadersData = (response as any).docs || [];
        setLeaders(leadersData);
      } else if (response.success && response.data) {
        // Fallback cho truong hop co wrapper
        const leadersData = (response.data as any).docs || [];
        setLeaders(leadersData);
      } else {
        setLeadersError(
          response.error ||
            response.message ||
            "Khong lay duoc danh sach leaders"
        );
        setLeaders([]);
      }
    } catch (error) {
      setLeadersError("Loi ket noi den server");
      setLeaders([]);
      console.error("Error fetching leaders:", error);
    } finally {
      setLeadersLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  // console.log('leaders', leaders);
  // ;
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

    dispatch(
      addNotification({
        type: "success",
        title: "Đã gửi thành công",
        message: "Chúng tôi sẽ liên hệ với bạn trong thời gian sờbm nhất!",
      })
    );

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
    leadersLoading,
    leadersError,
    partners,
    ecosystem,
    contactInfo,
    statsCards,
    formData,

    // Actions
    handleSubmit,
    updateFormData,
    fetchLeaders, // expose de co the refetch neu can
  };
};
