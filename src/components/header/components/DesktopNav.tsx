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

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {NAVIGATION_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={(e) => {}}
          className="text-foreground/80 hover:text-primary transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
