"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { NAVIGATION_ITEMS } from "../constants";
import { useAppSelector } from "@/stores";
import { toast } from "sonner";

export const DesktopNav = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: { href: string; label: string }
  ) => {
    // Check if item is "NFT Market" and user is not authenticated
    if (
      (item.href === "/nftmarket" || item.href === "/investments") &&
      (!isAuthenticated || !user)
    ) {
      e.preventDefault();
      router.push("/auth?tab=login");
      toast.info("Bạn cần đăng nhập để tiếp tính năng này");
      return;
    }
    // For other items, let Link handle navigation normally
  };

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {NAVIGATION_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={(e) => handleNavClick(e, item)}
          className="text-foreground/80 hover:text-primary transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
