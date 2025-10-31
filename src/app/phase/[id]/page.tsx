"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  Clock,
  Shield,
  ChevronLeft,
  Calculator,
  CheckCircle2,
  Lock,
  ArrowRight,
  Target,
  Sparkles,
} from "lucide-react";
import { LiveTransactionFeed } from "@/screens/phase-screen/component/LiveTransactionFeed";
import PhaseService, { Phase } from "@/api/services/phase-service";

interface PhaseDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PhaseDetailPage({ params }: PhaseDetailPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [investAmount, setInvestAmount] = useState<string>("100");

  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);
  useEffect(() => {
    let isMounted = true;
    async function fetchPhase() {
      setLoading(true);
      setError(null);
      try {
        const res = await PhaseService.getPhaseById(String(resolvedParams?.id));
        if (isMounted) {
          if (res.success && res.data) {
            setPhase(res.data);
          } else {
            setError(res.error || "Không thể tải dữ liệu giai đoạn");
            setPhase(null);
          }
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e?.message || "Đã xảy ra lỗi");
          setPhase(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchPhase();
    return () => {
      isMounted = false;
    };
  }, [resolvedParams?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!phase) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Không tìm thấy giai đoạn
            </h1>
            {error && (
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
            )}
            <Button onClick={() => router.push("/investments")}>
              Quay lại
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const calculateTokens = () => {
    const amount = parseFloat(investAmount) || 0;
    const tokens = amount * phase.pricePerToken;
    return {
      baseTokens: tokens.toFixed(2),
      totalTokens: tokens.toFixed(2),
    };
  };

  const { baseTokens, totalTokens } = calculateTokens();

  const totalTokensSupply = phase.totalTokens || 0;
  const soldTokens = phase.soldTokens || 0;
  const progressPercent =
    totalTokensSupply > 0
      ? Math.min(100, Math.max(0, (soldTokens / totalTokensSupply) * 100))
      : 0;
  const remainingMillions =
    totalTokensSupply > 0
      ? ((totalTokensSupply - soldTokens) / 1_000_000).toFixed(1)
      : "0.0";
  const gradientClass =
    phase.status === "active"
      ? "from-blue-500 to-cyan-600"
      : phase.status === "completed"
      ? "from-green-500 to-emerald-600"
      : "from-purple-500 to-pink-600";

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section with Better Progress Display */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-primary/20 to-secondary/20" />
          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-90`}
          ></div>

          <div className="container mx-auto px-4 relative z-10">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 mb-8 animate-fade-in"
              onClick={() => router.push("/investments")}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Button>

            <div className="max-w-5xl mx-auto text-white">
              <div className="text-center mb-12 animate-fade-in">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Badge className="bg-white/20 text-white border-white/30 px-6 py-3 text-lg animate-pulse">
                    {phase.status === "completed" && (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2 inline" />
                        Đã hoàn thành
                      </>
                    )}
                    {phase.status === "active" && (
                      <>
                        <Sparkles className="w-5 h-5 mr-2 inline" />
                        Đang mở - Đầu tư ngay
                      </>
                    )}
                    {phase.status === "locked" && (
                      <>
                        <Lock className="w-5 h-5 mr-2 inline" />
                        Sắp mở
                      </>
                    )}
                  </Badge>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                  {phase.name}
                </h1>

                <p className="text-2xl md:text-3xl mb-4 font-semibold">
                  ${phase.pricePerToken} / CAN Token
                </p>

                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                  {phase.description}
                </p>
              </div>

              {/* Enhanced Progress Display */}
              <div
                className="glass rounded-2xl p-8 border-2 border-white/30 backdrop-blur-xl animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Target className="w-5 h-5" />
                      <span className="text-sm opacity-90">Tiến độ bán</span>
                    </div>
                    <div className="text-4xl font-bold">
                      {progressPercent.toFixed(0)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="w-5 h-5" />
                      <span className="text-sm opacity-90">Còn lại</span>
                    </div>
                    <div className="text-4xl font-bold">
                      {remainingMillions}M
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Đã bán: {soldTokens.toLocaleString()} CAN</span>
                    <span>Tổng: {totalTokensSupply.toLocaleString()} CAN</span>
                  </div>
                  <Progress value={progressPercent} className="h-3 bg-white/20">
                    <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500 animate-glow" />
                  </Progress>
                  <p className="text-xs text-center opacity-80">
                    {phase.status === "active" &&
                      `Còn ${(100 - progressPercent).toFixed(
                        0
                      )}% slot - Đầu tư ngay!`}
                    {phase.status === "completed" && "Giai đoạn đã kết thúc"}
                    {phase.status === "locked" && "Sắp mở trong thời gian tới"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto -mt-20 relative z-20">
              <Card className="glass border-primary/30 animate-fade-in">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">
                    Giá mỗi token
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold gradient-text">
                    ${phase.pricePerToken}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    USD per CAN
                  </p>
                </CardContent>
              </Card>

              <Card
                className="glass border-secondary/30 animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">
                    Tổng nhà đầu tư
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary">
                    {phase.totalInvestors?.toLocaleString?.() || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Investors
                  </p>
                </CardContent>
              </Card>

              <Card
                className="glass border-accent/30 animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">
                    Còn lại
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">
                    {remainingMillions}M
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    CAN tokens
                  </p>
                </CardContent>
              </Card>

              <Card
                className="glass border-primary/30 animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">
                    Tổng vốn huy động
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold gradient-text">
                    ${phase.totalRaised?.toLocaleString?.() || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    USD raised
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="py-20 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6 animate-fade-in">
                  Tại sao nên đầu tư {phase.name}?
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  {phase.description}
                </p>
              </div>
              <div
                className="relative rounded-2xl overflow-hidden animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">
                      Thông tin giai đoạn
                    </h3>
                    <p className="text-muted-foreground">
                      Bắt đầu: {new Date(phase.startDate).toLocaleString()} —
                      Kết thúc: {new Date(phase.endDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Calculator & Live Transactions */}
        <section className="py-16 bg-gradient-to-b from-background to-background/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Calculator */}
              <Card className="glass border-primary/40 animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Tính toán đầu tư
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Số tiền đầu tư (USD)
                    </label>
                    <Input
                      type="number"
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                      className="text-lg"
                      placeholder="100"
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Giá mỗi token: ${phase.pricePerToken} / CAN
                    </p>
                  </div>

                  <div className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Base tokens:
                      </span>
                      <span className="font-bold">{baseTokens} CAN</span>
                    </div>
                    <div className="border-t border-primary/20 pt-3 flex justify-between">
                      <span className="font-semibold">Tổng nhận được:</span>
                      <span className="text-2xl font-bold gradient-text">
                        {totalTokens} CAN
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    variant={phase.status === "active" ? "default" : "outline"}
                    disabled={phase.status !== "active"}
                    onClick={() => {
                      if (phase.status === "active") {
                        // Handle investment logic here
                        console.log(
                          `Investing ${investAmount} USD into ${phase.name}`
                        );
                      }
                    }}
                  >
                    {phase.status === "active"
                      ? "Đầu tư ngay"
                      : phase.status === "completed"
                      ? "Đã đóng"
                      : "Sắp mở"}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>Bảo mật bởi blockchain technology</span>
                  </div>
                </CardContent>
              </Card>

              {/* Live Transaction Feed */}
              <div
                className="animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <LiveTransactionFeed phaseId={phase.phaseId} limit={8} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
