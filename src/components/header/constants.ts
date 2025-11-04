export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface NavigationItem {
  href: string;
  label: string;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: "Staking thành công",
    message: "Bạn đã stake 1000 CAN thành công",
    time: "5 phút trước",
    unread: true,
  },
  {
    id: 2,
    title: "Nhận thưởng NFT",
    message: "Bạn đã nhận được NFT mới từ nhiệm vụ",
    time: "1 giờ trước",
    unread: true,
  },
  {
    id: 3,
    title: "Đầu tư hoàn tất",
    message: "Giai đoạn 1 đã hoàn tất với lợi nhuận 15%",
    time: "3 giờ trước",
    unread: false,
  },
  {
    id: 4,
    title: "Hệ thống",
    message: "Cập nhật tính năng mới đã có sẵn",
    time: "1 ngày trước",
    unread: false,
  },
];

export const LANGUAGES: Language[] = [
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

export const NAVIGATION_ITEMS: NavigationItem[] = [
  // { href: "/", label: "Trang chủ" },
  { href: "/investments", label: "Đầu tư" },
  { href: "/", label: "Đầu tư NFT" },
  { href: "/", label: "NFT Market" },
  { href: "/p2pmarket", label: "P2P Market" },
  { href: "/staking", label: "Staking" },
  { href: "/about", label: "Về chúng tôi" },
];
