"use client";
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <span className="text-2xl font-bold">{brand.logo}</span>
        </div>
        <span className="text-xl font-bold gradient-text">{brand.name}</span>
      </div>
      <p className="text-sm text-muted-foreground">{brand.description}</p>
    </div>
  );
};
