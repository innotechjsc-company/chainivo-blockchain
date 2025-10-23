"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Shield,
  TrendingUp,
  Globe,
  Award,
  Users,
} from "lucide-react";

export const CompanyInfoCard = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-background to-background/50">
      <div className="container mx-auto px-4">
        {/* Token Info */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="gradient-text text-3xl text-center">
                Về CAN TOKEN
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                CAN Token là token tiện ích được phát triển trên công nghệ
                blockchain tiên tiến, được thiết kế để tạo ra một hệ sinh thái
                đầu tư và giao dịch minh bạch, an toàn và hiệu quả. Token được
                sử dụng trong nhiều ứng dụng khác nhau từ đầu tư, staking, đến
                giao dịch NFT.
              </p>

              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 rounded-lg bg-primary/5 hover-scale">
                  <Shield className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold mb-2">Bảo mật cao</h4>
                  <p className="text-sm text-muted-foreground">
                    Smart contract đã được kiểm toán
                  </p>
                </div>

                <div className="text-center p-4 rounded-lg bg-primary/5 hover-scale">
                  <TrendingUp className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold mb-2">Tiềm năng tăng trưởng</h4>
                  <p className="text-sm text-muted-foreground">
                    Lộ trình phát triển rõ ràng
                  </p>
                </div>

                <div className="text-center p-4 rounded-lg bg-primary/5 hover-scale">
                  <Globe className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold mb-2">Cộng đồng toàn cầu</h4>
                  <p className="text-sm text-muted-foreground">
                    Hỗ trợ 24/7 đa ngôn ngữ
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Info */}
        <div className="max-w-4xl mx-auto">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="gradient-text text-3xl text-center">
                Về Công ty
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <Building2 className="w-12 h-12 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    CAN Technology Corporation
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Được thành lập vào năm 2020, CAN Technology Corporation là
                    công ty tiên phong trong lĩnh vực công nghệ blockchain và
                    tài chính phi tập trung (DeFi) tại khu vực. Chúng tôi cam
                    kết mang đến những giải pháp đầu tư an toàn, minh bạch và dễ
                    tiếp cận cho mọi người.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-border">
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Giải thưởng</h4>
                    <p className="text-sm text-muted-foreground">
                      Top 10 Blockchain Startup 2023
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Đội ngũ</h4>
                    <p className="text-sm text-muted-foreground">
                      50+ chuyên gia blockchain và fintech
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Giấy phép</h4>
                    <p className="text-sm text-muted-foreground">
                      Được cấp phép hoạt động hợp pháp
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h4 className="font-semibold mb-3">Tầm nhìn & Sứ mệnh</h4>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  <strong className="text-foreground">Tầm nhìn:</strong> Trở
                  thành nền tảng blockchain hàng đầu trong khu vực, kết nối hàng
                  triệu người với cơ hội đầu tư công nghệ cao.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Sứ mệnh:</strong> Dân chủ
                  hóa tài chính, mang đến công nghệ blockchain tiên tiến và dễ
                  tiếp cận cho mọi người, tạo ra giá trị bền vững cho cộng đồng
                  đầu tư.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
