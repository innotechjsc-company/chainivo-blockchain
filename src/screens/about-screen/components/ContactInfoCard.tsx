"use client";
import { Card, CardContent } from "@/components/ui/card";
import { ContactInfo } from "@/types/about";
import { Mail, Phone, MapPin } from "lucide-react";

interface ContactInfoCardProps {
  contact: ContactInfo;
}

/**
 * ContactInfoCard component - Copy y hệt từ AboutUs.tsx gốc
 */
export const ContactInfoCard = ({ contact }: ContactInfoCardProps) => {
  const getColorClass = (type: string) => {
    switch (type) {
      case "email":
        return "bg-primary/20 text-primary";
      case "phone":
        return "bg-secondary/20 text-secondary";
      case "address":
        return "bg-accent/20 text-accent";
      default:
        return "bg-primary/20 text-primary";
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Mail":
        return <Mail className="w-6 h-6" />;
      case "Phone":
        return <Phone className="w-6 h-6" />;
      case "MapPin":
        return <MapPin className="w-6 h-6" />;
      default:
        return <Mail className="w-6 h-6" />;
    }
  };

  return (
    <Card className="glass">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getColorClass(
              contact.type
            )}`}
          >
            {getIcon(contact.icon)}
          </div>
          <div>
            <h3 className="font-semibold mb-1">{contact.title}</h3>
            {contact.details.map((detail, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                {detail}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
