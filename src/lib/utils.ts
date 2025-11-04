import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLevelBadge(level: string) {
  switch (level) {
    case "1":
      return "Thường";
    case "2":
      return "Bạc";
    case "3":
      return "Vàng";
    case "4":
      return "Bạch kim";
    case "5":
      return "Kim cương";
  }
}
