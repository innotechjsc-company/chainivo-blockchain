/**
 * Types cho Footer system
 * Copy y hệt từ Footer.tsx gốc
 */

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export interface FooterBrand {
  logo: string;
  name: string;
  description: string;
}

export interface FooterBottom {
  copyright: string;
  legalLinks: FooterLink[];
}
