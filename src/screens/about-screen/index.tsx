"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useAppSelector } from "@/stores";
import { useAboutData } from "./hooks/useAboutData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Target,
  Award,
  Loader2,
  Building2,
  Code2,
  Cog,
  Briefcase,
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
    leadersLoading,
    leadersError,
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
        <section className="py-16 bg-gradient-to-b from-background via-background to-background/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                  Sơ đồ tổ chức doanh nghiệp
                </h2>
                <p className="text-muted-foreground text-lg">Cấu trúc tổ chức chuyên nghiệp và hiệu quả</p>
              </div>

              {/* Organization Structure */}
              <Card className="glass space-y-8 p-6">
                {/* CEO/Director Level */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="px-8 py-4 rounded-xl bg-gradient-to-br from-primary to-secondary text-white font-bold text-lg shadow-lg flex items-center gap-3">
                      <Building2 size={24} />
                      Ban Giám Đốc
                    </div>
                    {/* Connector line */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-primary/50 to-transparent"></div>
                  </div>
                </div>

                {/* Departments Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  {/* Department 1: Technology */}
                  <div className="group">
                    {/* Connector line from director */}
                    {/* <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-primary/50 to-transparent -top-8"></div> */}

                    <Card className="relative p-6 border border-primary/30 hover:border-primary/60 transition-all duration-300 shadow-lg hover:shadow-xl bg-card/50 backdrop-blur-sm">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative z-10">
                        <div className="flex justify-center mb-4">
                          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                            <Code2 size={28} className="text-primary" />
                          </div>
                        </div>
                        <h3 className="text-center font-bold text-foreground text-lg mb-3">Phòng Công nghệ</h3>
                        <p className="text-center text-sm text-muted-foreground leading-relaxed">
                          Blockchain Dev, Smart Contracts, Security
                        </p>
                      </div>
                    </Card>
                  </div>

                  {/* Department 2: Business */}
                  <div className="group">
                    <Card className="relative p-6 border border-secondary/30 hover:border-secondary/60 transition-all duration-300 shadow-lg hover:shadow-xl bg-card/50 backdrop-blur-sm">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative z-10">
                        <div className="flex justify-center mb-4">
                          <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                            <Briefcase size={28} className="text-secondary" />
                          </div>
                        </div>
                        <h3 className="text-center font-bold text-foreground text-lg mb-3">Phòng Kinh doanh</h3>
                        <p className="text-center text-sm text-muted-foreground leading-relaxed">
                          Sales, Marketing, Partnership
                        </p>
                      </div>
                    </Card>
                  </div>

                  {/* Department 3: Operations */}
                  <div className="group">
                    <Card className="relative p-6 border border-accent/30 hover:border-accent/60 transition-all duration-300 shadow-lg hover:shadow-xl bg-card/50 backdrop-blur-sm">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative z-10">
                        <div className="flex justify-center mb-4">
                          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                            <Cog size={28} className="text-accent" />
                          </div>
                        </div>
                        <h3 className="text-center font-bold text-foreground text-lg mb-3">Phòng Vận hành</h3>
                        <p className="text-center text-sm text-muted-foreground leading-relaxed">
                          Operations, Support, Compliance
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>
              </Card>
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
                {leadersLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : leadersError ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">{leadersError}</p>
                  </div>
                ) : leaders.map((leader, index) => (
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
