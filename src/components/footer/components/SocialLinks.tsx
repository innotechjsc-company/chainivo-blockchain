"use client";
import { SocialLink } from "@/types/footer";
import { Twitter, MessageCircle, Github, Mail } from "lucide-react";

interface SocialLinksProps {
  socialLinks: SocialLink[];
}

/**
 * SocialLinks component - Copy y hệt từ Footer.tsx gốc
 */
export const SocialLinks = ({ socialLinks }: SocialLinksProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Twitter":
        return <Twitter className="w-5 h-5" />;
      case "MessageCircle":
        return <MessageCircle className="w-5 h-5" />;
      case "Github":
        return <Github className="w-5 h-5" />;
      case "Mail":
        return <Mail className="w-5 h-5" />;
      default:
        return <Twitter className="w-5 h-5" />;
    }
  };

  return (
    <div>
      <h3 className="font-bold mb-4">Cộng đồng</h3>
      <div className="flex space-x-4">
        {socialLinks.map((social, index) => (
          <a
            key={index}
            href={social.href}
            className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-primary/20 transition-colors"
          >
            {getIcon(social.icon)}
          </a>
        ))}
      </div>
    </div>
  );
};
