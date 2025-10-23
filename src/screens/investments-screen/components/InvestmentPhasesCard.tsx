"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Lock, CheckCircle2 } from "lucide-react";

interface InvestmentPhase {
  id: number;
  name: string;
  status: "completed" | "active" | "locked";
  price: string;
  totalCoins: string;
  soldCoins: string;
  progress: number;
  bonus: string;
}

interface InvestmentPhasesCardProps {
  phases: InvestmentPhase[];
}

export const InvestmentPhasesCard = ({ phases }: InvestmentPhasesCardProps) => {
  const router = useRouter();

  return (
    <section id="invest" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Giai đoạn đầu tư</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tham gia đầu tư sớm để nhận được lợi nhuận tốt nhất
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {phases.map((phase, index) => (
            <Card
              key={phase.id}
              className={`glass rounded-2xl p-6 relative overflow-hidden transition-all hover:scale-105 ${
                phase.status === "active"
                  ? "border-2 border-primary animate-glow"
                  : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {phase.status === "completed" && (
                  <Badge className="flex items-center space-x-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Hoàn thành</span>
                  </Badge>
                )}
                {phase.status === "active" && (
                  <Badge className="flex items-center space-x-1 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs animate-pulse">
                    <Clock className="w-3 h-3" />
                    <span>Đang mở</span>
                  </Badge>
                )}
                {phase.status === "locked" && (
                  <Badge className="flex items-center space-x-1 bg-muted/20 text-muted-foreground px-3 py-1 rounded-full text-xs">
                    <Lock className="w-3 h-3" />
                    <span>Chờ</span>
                  </Badge>
                )}
              </div>

              {/* Phase Info */}
              <div className="space-y-4 mt-8">
                <h3 className="text-2xl font-bold">{phase.name}</h3>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Giá bán:</span>
                    <span className="font-bold text-primary">
                      {phase.price}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tổng coin:</span>
                    <span className="font-semibold">{phase.totalCoins}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Đã bán:</span>
                    <span className="font-semibold">{phase.soldCoins}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Tiến độ</span>
                    <span>{phase.progress}%</span>
                  </div>
                  <Progress value={phase.progress} className="h-2" />
                </div>

                {/* Bonus Badge */}
                <div className="flex items-center justify-center space-x-2 bg-secondary/20 text-secondary px-4 py-2 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold">{phase.bonus}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => router.push(`/phase/${phase.id}`)}
                  >
                    Xem chi tiết
                  </Button>
                  <Button
                    className="w-full"
                    variant={phase.status === "active" ? "default" : "outline"}
                    disabled={phase.status !== "active"}
                  >
                    {phase.status === "active"
                      ? "Đầu tư ngay"
                      : phase.status === "completed"
                      ? "Đã đóng"
                      : "Sắp mở"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12">
          <Card className="glass rounded-2xl p-8 text-center max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-4">
                🎯 Đầu tư thông minh, nhận lợi nhuận cao
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground mb-6">
                Các giai đoạn sớm có giá thấp hơn và bonus cao hơn. Hãy tham gia
                ngay để tối đa hóa lợi nhuận của bạn!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>Thanh toán an toàn</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>Minh bạch 100%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
