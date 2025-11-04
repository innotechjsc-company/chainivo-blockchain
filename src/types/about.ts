/**
 * Types cho About Us system
 * Copy y hệt từ AboutUs.tsx gốc
 */

export interface Leader {
  id: string;
  fullName: string;
  position: string;
  email: string;
  phone: string;
  biography: string;
  image: {
    id: string;
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  isActive: boolean;
}

export interface Partner {
  name: string;
  type: string;
}

export interface EcosystemItem {
  icon: string;
  title: string;
  description: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export interface ContactInfo {
  type: "email" | "phone" | "address";
  title: string;
  details: string[];
  icon: string;
}

export interface StatsCard {
  icon: string;
  value: string;
  label: string;
  color: "primary" | "secondary" | "accent";
}
