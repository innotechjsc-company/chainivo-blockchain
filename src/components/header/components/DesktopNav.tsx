import Link from "next/link";
import { NAVIGATION_ITEMS } from "../constants";

export const DesktopNav = () => {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      {NAVIGATION_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-foreground/80 hover:text-primary transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
