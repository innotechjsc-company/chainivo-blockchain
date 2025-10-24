"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { ContactFormData } from "@/types/about";

interface ContactFormProps {
  formData: ContactFormData;
  onFormDataChange: (field: keyof ContactFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * ContactForm component - Copy y hệt từ AboutUs.tsx gốc
 */
export const ContactForm = ({
  formData,
  onFormDataChange,
  onSubmit,
}: ContactFormProps) => {
  return (
    <Card className="glass">
      <CardContent className="p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Họ và tên *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onFormDataChange("name", e.target.value)}
              required
              className="mt-2"
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onFormDataChange("email", e.target.value)}
              required
              className="mt-2"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => onFormDataChange("phone", e.target.value)}
              className="mt-2"
              placeholder="0901234567"
            />
          </div>
          <div>
            <Label htmlFor="message">Nội dung *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => onFormDataChange("message", e.target.value)}
              required
              className="mt-2 min-h-[120px]"
              placeholder="Nhập nội dung cần liên hệ..."
            />
          </div>
          <Button type="submit" className="w-full gap-2">
            <Send className="w-4 h-4" />
            Gửi thông tin
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
