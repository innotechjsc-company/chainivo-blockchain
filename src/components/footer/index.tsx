"use client";
import { useFooterData } from "./hooks/useFooterData";

// Components
import { FooterBrand } from "./components/FooterBrand";
import { FooterSection } from "./components/FooterSection";
import { SocialLinks } from "./components/SocialLinks";
import { FooterBottom } from "./components/FooterBottom";
import "./footer.css";

/**
 * Footer - Copy y hệt từ Footer.tsx gốc
 * Component footer chính của ứng dụng
 */
export const Footer = () => {
  // Custom hooks
  const { brand, sections, socialLinks, bottom } = useFooterData();

  return (
    <footer className="border-t border-border/50 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand - Copy y hệt từ component gốc */}
          <FooterBrand brand={brand} />

          {/* Sections - Copy y hệt từ component gốc */}
          {sections.map((section, index) => (
            <FooterSection key={index} section={section} />
          ))}

          {/* Social Links - Copy y hệt từ component gốc */}
          <SocialLinks socialLinks={socialLinks} />
        </div>

        {/* Bottom - Copy y hệt từ component gốc */}
        <FooterBottom bottom={bottom} />
      </div>
    </footer>
  );
};
