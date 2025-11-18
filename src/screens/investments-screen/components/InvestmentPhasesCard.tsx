"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Lock, CheckCircle2 } from "lucide-react";
import { Phase } from "@/api/services/phase-service";
import {
  TOKEN_DEAULT_CURRENCY,
  TOKEN_DEAULT_CURRENCY_INVESTMENT,
} from "@/api/config";

// investments
interface InvestmentPhasesCardProps {
  phases: Phase[];
  isLoading: boolean;
  error: string | null;
  gridColsClass?: string;
  showDetailsButton?: boolean;
  activeButtonClassName?: string;
}

export const InvestmentPhasesCard = ({
  phases: phasesProps,
  isLoading: isLoadingProps,
  error: errorProps,
  gridColsClass = "md:grid-cols-3 lg:grid-cols-4",
  showDetailsButton = true,
  activeButtonClassName = "",
}: InvestmentPhasesCardProps) => {
  const router = useRouter();

  const phases = phasesProps || [];
  const isLoading = isLoadingProps || false;
  const error = errorProps || null;
// investments

  // Handler cho card click - scroll to top khi navigate
  const handleCardClick = (phaseId: string) => {
    // Thêm query param để đánh dấu cần scroll to top
    router.push(`/phase/${phaseId}?scrollToTop=true`);
  };

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
          {isLoading && (
            <p className="text-sm text-muted-foreground mt-2">
              Đang tải dữ liệu...
            </p>
          )}
        </div>

        <div className={`grid grid-cols-1 ${gridColsClass} gap-6`}>
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <Card
                key={`skeleton-${index}`}
                className="glass rounded-2xl p-6 relative overflow-hidden"
              >
                <div className="animate-pulse space-y-6">
                  <div className="absolute top-4 right-4">
                    <div className="h-5 w-20 bg-muted/40 rounded-full" />
                  </div>

                  <div className="space-y-4 mt-8">
                    <div className="h-7 w-2/3 bg-muted/40 rounded" />

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-24 bg-muted/30 rounded" />
                        <div className="h-4 w-20 bg-muted/40 rounded" />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-24 bg-muted/30 rounded" />
                        <div className="h-4 w-16 bg-muted/40 rounded" />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-24 bg-muted/30 rounded" />
                        <div className="h-4 w-16 bg-muted/40 rounded" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="h-3 w-16 bg-muted/30 rounded" />
                        <div className="h-3 w-10 bg-muted/30 rounded" />
                      </div>
                      <div className="h-2 w-full bg-muted/30 rounded" />
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="h-10 w-full bg-muted/30 rounded-md" />
                      <div className="h-10 w-full bg-muted/30 rounded-md" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          {!isLoading &&
            phases.map((phase, index) => (
              <Card
                key={phase.id}
                onClick={() => handleCardClick(phase.id)}
                className={`glass rounded-2xl p-6 relative overflow-hidden transition-all hover:scale-105 cursor-pointer ${
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
                  {phase.status === "upcoming" && (
                    <Badge className="flex items-center space-x-1 bg-muted/20 text-muted-foreground px-3 py-1 rounded-full text-xs">
                      <Lock className="w-3 h-3" />
                      <span>Chờ</span>
                    </Badge>
                  )}
                </div>

                {/* Phase Info */}
                <div className="space-y-3 mt-8">
                  <h3 className="text-xl font-bold">{phase.name}</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Tổng cung:
                      </span>
                      <span className="text-base font-semibold gradient-text">
                        {phase.totalTokens.toLocaleString("en-US")}{" "}
                        {TOKEN_DEAULT_CURRENCY}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Giá bán:
                      </span>
                      <span className="text-base font-semibold text-primary">
                        {phase.pricePerToken} {TOKEN_DEAULT_CURRENCY_INVESTMENT}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Đã bán:
                      </span>
                      <span className="text-base font-semibold">
                        {phase.soldTokens}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Tiến độ:
                      </span>
                      <span className="text-sm font-semibold">
                        {Math.round(
                          (phase.totalTokens > 0
                            ? (phase.soldTokens / phase.totalTokens) * 100
                            : 0) as number
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Thời gian:
                      </span>
                      {phase.startDate && phase.endDate ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-white/90">
                            {(() => {
                              try {
                                return new Date(
                                  phase.startDate
                                ).toLocaleDateString("vi-VN", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                });
                              } catch {
                                return phase.startDate;
                              }
                            })()}
                          </span>
                          <span className="text-sm text-white/60">-</span>
                          <span className="text-sm text-white/90">
                            {(() => {
                              try {
                                return new Date(
                                  phase.endDate
                                ).toLocaleDateString("vi-VN", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                });
                              } catch {
                                return phase.endDate;
                              }
                            })()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-white/60">—</span>
                      )}
                    </div>
                    <Progress
                      value={
                        phase.totalTokens > 0
                          ? (phase.soldTokens / phase.totalTokens) * 100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {/* {showDetailsButton && (
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => router.push(`/phase/${phase.id}`)}
                      >
                        Xem chi tiết
                      </Button>
                    )} */}
                    <Button
                      className={`w-full ${
                        phase.status === "active" && activeButtonClassName
                          ? activeButtonClassName
                          : ""
                      }`}
                      variant={
                        phase.status === "active" ? "default" : "outline"
                      }
                      disabled={phase.status !== "active"}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Thêm query param để scroll đến phần đầu tư
                        router.push(
                          `/phase/${phase.id}?scrollToCalculator=true`
                        );
                      }}
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
