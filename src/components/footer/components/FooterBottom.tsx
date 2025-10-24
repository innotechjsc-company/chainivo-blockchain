"use client";
import { FooterBottom as FooterBottomType } from "@/types/footer";

interface FooterBottomProps {
  bottom: FooterBottomType;
}

/**
 * FooterBottom component - Copy y hệt từ Footer.tsx gốc
 */
export const FooterBottom = ({ bottom }: FooterBottomProps) => {
  return (
    <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
      <p>{bottom.copyright}</p>
      <div className="flex space-x-6 mt-4 md:mt-0">
        {bottom.legalLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="hover:text-primary transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
};
