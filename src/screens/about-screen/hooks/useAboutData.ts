"use client";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch, addNotification } from "@/stores";
import {
  Leader,
  Partner,
  EcosystemItem,
  ContactFormData,
  ContactFormErrors,
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

  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});

  // Validation helper: Sanitize HTML entities de chong XSS
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .trim();
  };

  // Validation function
  const validateForm = (data: ContactFormData): ContactFormErrors => {
    const errors: ContactFormErrors = {};

    // Name validation: required, min 2, max 50, khong chua script tags
    if (!data.name || data.name.trim().length < 2) {
      errors.name = "Họ và tên phải có ít nhất 2 ký tự";
    } else if (data.name.length > 50) {
      errors.name = "Họ và tên không được quá 50 ký tự";
    } else if (/<script|<\/script|javascript:|onerror=/i.test(data.name)) {
      errors.name = "Họ và tên chứa ký tự không hợp lệ";
    }

    // Email validation: required, format hop le, max 100
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!data.email) {
      errors.email = "Email là bắt buộc";
    } else if (!emailRegex.test(data.email.trim())) {
      errors.email = "Email không hợp lệ";
    } else if (data.email.length > 100) {
      errors.email = "Email không được quá 100 ký tự";
    } else {
      const normalizedEmail = data.email.trim();
      const parts = normalizedEmail.split("@");

      if (parts.length !== 2) {
        errors.email = "Email không hợp lệ";
      } else {
        const [local, domain] = parts;

        // Kiểm tra local part
        if (
          local.length === 0 ||
          local.length > 64 ||
          /^\.|\.$|\.\./.test(local)
        ) {
          errors.email = "Email không hợp lệ (phần trước @ không hợp lệ)";
        }

        if (
          !errors.email &&
          (domain.length === 0 ||
            domain.length > 255 ||
            /^\.|\.$|\.\./.test(domain))
        ) {
          errors.email = "Email không hợp lệ (domain không hợp lệ)";
        }


        if (!errors.email) {
          const lastDotIndex = domain.lastIndexOf(".");
          if (lastDotIndex === -1 || domain.length - lastDotIndex - 1 < 2) {
            errors.email = "Email không hợp lệ (TLD phải có ít nhất 2 ký tự)";
          }
        }
      }
    }

    // Phone validation: optional nhung neu co thi phai dung format VN
    // if (data.phone && data.phone.trim().length > 0) {
    //   const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    //   const cleanPhone = data.phone.replace(/\s/g, '');
    //   if (!phoneRegex.test(cleanPhone)) {
    //     errors.phone = 'Số điện thoại không hợp lệ (đầu số VN: 03x, 05x, 07x, 08x, 09x)';
    //   }
    // }

    // Message validation: required, min 20, max 1000
    if (!data.message || data.message.trim().length < 20) {
      errors.message = "Nội dung phải có ít nhất 20 ký tự";
    } else if (data.message.length > 5000) {
      errors.message = "Nội dung không được quá 5000 ký tự";
    } else if (/<script|<\/script|javascript:|onerror=/i.test(data.message)) {
      errors.message = "Nội dung chứa ký tự không hợp lệ";
    }

    return errors;
  };

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
            "Không lấy được danh sách leaders"
        );
        setLeadersError(
          response.error ||
            response.message ||
            "Khong lay duoc danh sach leaders"
        );
        setLeaders([]);
      }
    } catch (error) {
      setLeadersError("Lỗi kết nối đến server");
      setLeaders([]);
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

  // Submit form voi validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form truoc khi submit
    const errors = validateForm(formData);
    setFormErrors(errors);

    // Neu co loi thi khong submit
    if (Object.keys(errors).length > 0) {
      dispatch(
        addNotification({
          type: "error",
          title: "Lỗi nhập liệu",
          message: "Vui lòng kiểm tra lại thông tin",
        })
      );
      return;
    }

    // Sanitize data truoc khi gui len server
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.replace(/\D/g, ""), // Chi giu so
      message: sanitizeInput(formData.message),
    };

    // TODO: Gui data len server qua API
    console.log("Sanitized data:", sanitizedData);

    dispatch(
      addNotification({
        type: "success",
        title: "Đã gửi thành công",
        message: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất!",
      })
    );

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
    setFormErrors({});
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
    formErrors,

    // Actions
    handleSubmit,
    updateFormData,
    fetchLeaders, // expose de co the refetch neu can
  };
};
