"use client";
import { useEffect } from "react";
import { useAppSelector } from "@/stores";
import { useAboutData } from "./hooks/useAboutData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Target,
  Users,
  Globe,
  TrendingUp,
  Shield,
  Zap,
  Rocket,
  Award,
} from "lucide-react";

// Components
import { TeamCard } from "./components/TeamCard";
import { PartnerCard } from "./components/PartnerCard";
import { EcosystemCard } from "./components/EcosystemCard";
import { StatsCard } from "./components/StatsCard";
import { ContactForm } from "./components/ContactForm";
import { ContactInfoCard } from "./components/ContactInfoCard";
import "./about-screen.css";

/**
 * AboutUsScreen - Copy y hệt từ AboutUs.tsx gốc
 * Màn hình giới thiệu về công ty
 */
export const AboutUsScreen = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.user);

  // Custom hooks
  const {
    leaders,
    partners,
    ecosystem,
    contactInfo,
    statsCards,
    formData,
    handleSubmit,
    updateFormData,
  } = useAboutData();

  // Copy y hệt logic từ component gốc
  useEffect(() => {
    if (!isAuthenticated) {
      // TODO: Redirect to auth page
      console.log("User not authenticated, redirecting to auth...");
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20">
        {/* Hero Section - Copy y hệt từ component gốc */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">Về CAN Network</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Xây dựng tương lai tài chính phi tập trung với công nghệ
                blockchain tiên tiến
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {statsCards.map((stats, index) => (
                  <StatsCard key={index} stats={stats} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Introduction - Copy y hệt từ component gốc */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="animate-fade-in">
                  <h2 className="text-3xl font-bold mb-4 gradient-text">
                    Giới thiệu chung
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    CAN Network là nền tảng blockchain tiên tiến, cung cấp giải
                    pháp tài chính phi tập trung toàn diện. Chúng tôi kết hợp
                    công nghệ blockchain với các mô hình kinh doanh thực tế để
                    tạo ra giá trị bền vững.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Với đội ngũ chuyên gia giàu kinh nghiệm và công nghệ tiên
                    tiến, chúng tôi cam kết mang đến trải nghiệm đầu tư an toàn,
                    minh bạch và sinh lời cao cho người dùng.
                  </p>
                  <div className="flex gap-4 mt-6">
                    <Button className="gap-2">
                      <Rocket className="w-4 h-4" />
                      Bắt đầu đầu tư
                    </Button>
                    <Button variant="outline">Tìm hiểu thêm</Button>
                  </div>
                </div>
                <div
                  className="animate-fade-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  <Card className="glass p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-6 h-6 text-primary flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-1">
                            An toàn & Minh bạch
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Mọi giao dịch được bảo mật bởi blockchain và có thể
                            kiểm chứng công khai
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-6 h-6 text-secondary flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-1">Sinh lời cao</h3>
                          <p className="text-sm text-muted-foreground">
                            Mô hình kinh doanh đa dạng với tiềm năng lợi nhuận
                            hấp dẫn
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="w-6 h-6 text-accent flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-1">Cộng đồng mạnh</h3>
                          <p className="text-sm text-muted-foreground">
                            Hơn 50,000 nhà đầu tư trên toàn thế giới tin tưởng
                            và sử dụng
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Team - Copy y hệt từ component gốc */}
        <section className="py-16 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 gradient-text">
                  Đội ngũ lãnh đạo
                </h2>
                <p className="text-muted-foreground">
                  Những chuyên gia hàng đầu với kinh nghiệm dày dặn trong lĩnh
                  vực công nghệ và tài chính
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {leaders.map((leader, index) => (
                  <TeamCard key={index} leader={leader} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission - Copy y hệt từ component gốc */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="glass border-primary/30 animate-fade-in">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold">Tầm nhìn</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Trở thành nền tảng blockchain hàng đầu khu vực Đông Nam Á,
                      kết nối hàng triệu người dùng với hệ sinh thái tài chính
                      phi tập trung.
                    </p>
                    <p className="text-muted-foreground">
                      Chúng tôi hướng tới một tương lai nơi mọi người đều có thể
                      tiếp cận các dịch vụ tài chính một cách dễ dàng, minh bạch
                      và công bằng thông qua công nghệ blockchain.
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className="glass border-secondary/30 animate-fade-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold">Sứ mệnh</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Cung cấp giải pháp tài chính phi tập trung an toàn, hiệu
                      quả và dễ sử dụng cho tất cả mọi người.
                    </p>
                    <p className="text-muted-foreground">
                      Xây dựng cộng đồng blockchain mạnh mẽ, nơi mọi thành viên
                      đều có quyền tham gia quản trị và chia sẻ lợi nhuận một
                      cách công bằng và minh bạch.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Partners - Copy y hệt từ component gốc */}
        <section className="py-16 bg-gradient-to-b from-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 gradient-text">
                  Đối tác chiến lược
                </h2>
                <p className="text-muted-foreground">
                  Hợp tác với các tổ chức hàng đầu trong ngành blockchain và tài
                  chính
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {partners.map((partner, index) => (
                  <PartnerCard key={index} partner={partner} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Business Ecosystem - Copy y hệt từ component gốc */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 gradient-text">
                  Hệ sinh thái kinh doanh
                </h2>
                <p className="text-muted-foreground">
                  Hệ sinh thái đa dạng với nhiều sản phẩm và dịch vụ blockchain
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ecosystem.map((item, index) => (
                  <EcosystemCard key={index} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Organizational Structure - Copy y hệt từ component gốc */}
        <section className="py-16 bg-gradient-to-b from-background to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 gradient-text">
                  Sơ đồ tổ chức doanh nghiệp
                </h2>
                <p className="text-muted-foreground">
                  Cấu trúc tổ chức chuyên nghiệp và hiệu quả
                </p>
              </div>
              <Card className="glass p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-block px-6 py-3 rounded-lg bg-gradient-to-br from-primary to-secondary text-white font-bold">
                      Ban Giám Đốc
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="inline-block px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 font-semibold">
                        Phòng Công nghệ
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Blockchain Dev, Smart Contracts, Security
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="inline-block px-4 py-2 rounded-lg bg-secondary/20 border border-secondary/30 font-semibold">
                        Phòng Kinh doanh
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Sales, Marketing, Partnership
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="inline-block px-4 py-2 rounded-lg bg-accent/20 border border-accent/30 font-semibold">
                        Phòng Vận hành
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Operations, Support, Compliance
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form - Copy y hệt từ component gốc */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 gradient-text">
                  Liên hệ với chúng tôi
                </h2>
                <p className="text-muted-foreground">
                  Gửi thông tin của bạn, chúng tôi sẽ liên hệ lại trong thời
                  gian sớm nhất
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ContactForm
                  formData={formData}
                  onFormDataChange={updateFormData}
                  onSubmit={handleSubmit}
                />

                <div className="space-y-6">
                  {contactInfo.map((contact, index) => (
                    <ContactInfoCard key={index} contact={contact} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
