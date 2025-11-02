"use client";
import { Logo } from "@/components/header/components/Logo";
import { FooterBrand as FooterBrandType } from "@/types/footer";

interface FooterBrandProps {
  brand: FooterBrandType;
}

/**
 * FooterBrand component - Copy y hệt từ Footer.tsx gốc
 */
export const FooterBrand = ({ brand }: FooterBrandProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Logo />
      </div>
      <p className="text-sm text-muted-foreground">{brand.description}</p>
    </div>
  );
};
