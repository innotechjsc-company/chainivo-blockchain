"use client";
import { FooterSection as FooterSectionType } from "@/types/footer";

interface FooterSectionProps {
  section: FooterSectionType;
}

/**
 * FooterSection component - Copy y hệt từ Footer.tsx gốc
 */
export const FooterSection = ({ section }: FooterSectionProps) => {
  return (
    <div>
      <h3 className="font-bold mb-4">{section.title}</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {section.links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
