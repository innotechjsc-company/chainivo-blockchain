"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { NAVIGATION_ITEMS } from "../constants";

export const DesktopNav = () => {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {NAVIGATION_ITEMS.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`transition-colors ${
              isActive
                ? "text-primary font-semibold"
                : "text-foreground/80 hover:text-primary"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
