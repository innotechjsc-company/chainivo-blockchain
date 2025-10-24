"use client";

import { useEffect, useState } from "react";
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
  Zap,
  ChevronLeft,
  ChevronRight,
  Calculator,
  CheckCircle2,
  Lock,
  ArrowRight,
  Target,
  Sparkles,
  Award,
  BarChart3,
  Rocket,
} from "lucide-react";
import { LiveTransactionFeed } from "@/components/live-transaction-feed/LiveTransactionFeed";

const phasesData = [
  {
    id: 1,
    name: "Giai đoạn 1",
    status: "completed",
    price: 0.05,
    totalCoins: 10000000,
    soldCoins: 10000000,
    progress: 100,
    bonus: 20,
    color: "from-green-500 to-emerald-600",
    description:
      "Giai đoạn đầu tiên với giá ưu đãi nhất cho những nhà đầu tư tiên phong. Đây là cơ hội vàng để sở hữu CAN token với mức giá thấp nhất và bonus cao nhất.",
    highlights: [
      "ROI tiềm năng lên đến 300%",
      "Vesting 6 tháng với unlock hàng tháng",
      "Staking APY đặc biệt 50%",
    ],
    benefits: [
      "Giá thấp nhất trong toàn bộ dự án",
      "Bonus cao nhất 20%",
      "Ưu tiên whitelist cho NFT drops",
      "Early bird rewards",
    ],
  },
  {
    id: 2,
    name: "Giai đoạn 2",
    status: "active",
    price: 0.08,
    totalCoins: 15000000,
    soldCoins: 8750000,
    progress: 58,
    bonus: 15,
    color: "from-blue-500 to-cyan-600",
    description:
      "Giai đoạn hiện tại đang mở với mức giá hấp dẫn. Vẫn còn bonus 15% và nhiều quyền lợi đặc biệt cho nhà đầu tư. Đừng bỏ lỡ cơ hội này!",
    highlights: ["ROI tiềm năng 200%+", "Vesting 5 tháng", "Staking APY 40%"],
    benefits: [
      "Giá ưu đãi so với các phase sau",
      "Bonus 15% tokens",
      "Access vào các sự kiện VIP",
      "Voting rights trong governance",
    ],
  },
  {
    id: 3,
    name: "Giai đoạn 3",
    status: "locked",
    price: 0.12,
    totalCoins: 20000000,
    soldCoins: 0,
    progress: 0,
    bonus: 10,
    color: "from-purple-500 to-pink-600",
    description:
      "Giai đoạn 3 sắp mở với pool lớn hơn và vẫn có bonus hấp dẫn. Thích hợp cho những ai muốn đầu tư với quy mô lớn hơn.",
    highlights: ["ROI tiềm năng 150%", "Vesting 4 tháng", "Staking APY 35%"],
    benefits: [
      "Vẫn còn bonus 10%",
      "Staking rewards cao hơn",
      "Partner benefits",
      "Premium support",
    ],
  },
  {
    id: 4,
    name: "Giai đoạn 4",
    status: "locked",
    price: 0.15,
    totalCoins: 25000000,
    soldCoins: 0,
    progress: 0,
    bonus: 5,
    color: "from-orange-500 to-red-600",
    description:
      "Giai đoạn cuối cùng trước khi listing, với giá gần bằng giá niêm yết. Vẫn còn bonus 5% cho những nhà đầu tư muốn tham gia trước khi token ra thị trường.",
    highlights: ["ROI tiềm năng 100%", "Vesting 3 tháng", "Staking APY 30%"],
    benefits: [
      "Bonus cuối cùng 5%",
      "Giá gần listing",
      "Liquidity provider rewards",
      "Exclusive merchandise",
    ],
  },
];

interface PhaseDetailPageProps {
  params: {
    id: string;
  };
}

export default function PhaseDetailPage({ params }: PhaseDetailPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [investAmount, setInvestAmount] = useState<string>("100");

  const phase = phasesData.find((p) => p.id === Number(params.id));

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
    const tokens = amount / phase.price;
    const bonusTokens = (tokens * phase.bonus) / 100;
    return {
      baseTokens: tokens.toFixed(2),
      bonusTokens: bonusTokens.toFixed(2),
      totalTokens: (tokens + bonusTokens).toFixed(2),
    };
  };

  const { baseTokens, bonusTokens, totalTokens } = calculateTokens();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section with Better Progress Display */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-primary/20 to-secondary/20" />
          <div
            className={`absolute inset-0 bg-gradient-to-br ${phase.color} opacity-90`}
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
                  ${phase.price} / CAN Token
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
                    <div className="text-4xl font-bold">{phase.progress}%</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-sm opacity-90">Bonus</span>
                    </div>
                    <div className="text-4xl font-bold text-green-300">
                      +{phase.bonus}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="w-5 h-5" />
                      <span className="text-sm opacity-90">Còn lại</span>
                    </div>
                    <div className="text-4xl font-bold">
                      {((phase.totalCoins - phase.soldCoins) / 1000000).toFixed(
                        1
                      )}
                      M
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Đã bán: {phase.soldCoins.toLocaleString()} CAN</span>
                    <span>Tổng: {phase.totalCoins.toLocaleString()} CAN</span>
                  </div>
                  <Progress value={phase.progress} className="h-3 bg-white/20">
                    <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500 animate-glow" />
                  </Progress>
                  <p className="text-xs text-center opacity-80">
                    {phase.status === "active" &&
                      `Còn ${(100 - phase.progress).toFixed(
                        0
                      )}% slot - Đầu tư ngay!`}
                    {phase.status === "completed" && "Giai đoạn đã kết thúc"}
                    {phase.status === "locked" && "Sắp mở trong thời gian tới"}
                  </p>
                </div>
              </div>

              {/* Comparison with Previous Phase */}
              {phase.id > 1 && (
                <div
                  className="mt-8 glass rounded-xl p-6 border border-white/20 backdrop-blur-lg animate-fade-in"
                  style={{ animationDelay: "0.3s" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-6 h-6 text-yellow-300" />
                      <div>
                        <p className="text-sm opacity-80">
                          So với Giai đoạn {phase.id - 1}
                        </p>
                        <p className="text-lg font-semibold">
                          Giá tăng $
                          {(
                            phase.price - phasesData[phase.id - 2].price
                          ).toFixed(3)}
                          <span className="text-red-300 ml-2">
                            (+
                            {(
                              ((phase.price - phasesData[phase.id - 2].price) /
                                phasesData[phase.id - 2].price) *
                              100
                            ).toFixed(0)}
                            %)
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-80">Bonus giảm</p>
                      <p className="text-lg font-semibold text-orange-300">
                        -{phasesData[phase.id - 2].bonus - phase.bonus}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
                    ${phase.price}
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
                    Bonus tokens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary">
                    +{phase.bonus}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Extra tokens
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
                    {((phase.totalCoins - phase.soldCoins) / 1000000).toFixed(
                      1
                    )}
                    M
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
                    ROI tiềm năng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold gradient-text">
                    {100 + phase.bonus + (5 - phase.id) * 20}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Estimated
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Landing Page Style Description */}
        <section className="py-20 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6 animate-fade-in">
                  Tại sao nên đầu tư {phase.name}?
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Khám phá những lợi ích vượt trội và cơ hội sinh lời cao từ
                  giai đoạn này
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {phase.highlights.map((highlight, index) => (
                  <Card
                    key={index}
                    className="glass border-primary/30 hover:scale-105 transition-all animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                        {index === 0 && (
                          <Rocket className="w-6 h-6 text-white" />
                        )}
                        {index === 1 && (
                          <Clock className="w-6 h-6 text-white" />
                        )}
                        {index === 2 && (
                          <Award className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <p className="font-semibold text-lg">{highlight}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Visual Investment Growth */}
              <div
                className="relative rounded-2xl overflow-hidden animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">
                      Tăng trưởng vượt bậc
                    </h3>
                    <p className="text-muted-foreground">
                      Dự án với roadmap rõ ràng và tiềm năng phát triển mạnh mẽ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Calculator & Benefits & Live Transactions */}
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
                  </div>

                  <div className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Base tokens:
                      </span>
                      <span className="font-bold">{baseTokens} CAN</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Bonus +{phase.bonus}%:
                      </span>
                      <span className="font-bold text-secondary">
                        +{bonusTokens} CAN
                      </span>
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

              {/* Benefits */}
              <Card
                className="glass border-secondary/40 animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Lợi ích của {phase.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {phase.benefits.map((benefit, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/5 transition-colors animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/90">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Bảo vệ 100%</h4>
                        <p className="text-sm text-muted-foreground">
                          Mọi giao dịch được bảo vệ bởi smart contracts và có
                          thể kiểm chứng trên blockchain
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Live Transaction Feed */}
              <div
                className="animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <LiveTransactionFeed phaseId={phase.id} limit={8} />
              </div>
            </div>
          </div>
        </section>

        {/* All Phases Timeline */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                Các giai đoạn khác
              </h2>
              <p className="text-muted-foreground">
                Khám phá tất cả các phase và chọn thời điểm đầu tư phù hợp
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {phasesData.map((p, index) => (
                <Card
                  key={p.id}
                  className={`glass hover:scale-105 transition-all cursor-pointer ${
                    p.id === phase.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => router.push(`/phase/${p.id}`)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{p.name}</CardTitle>
                      {p.status === "completed" && (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      )}
                      {p.status === "active" && (
                        <Clock className="w-5 h-5 text-primary animate-pulse" />
                      )}
                      {p.status === "locked" && (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <Badge
                      variant={p.id === phase.id ? "default" : "outline"}
                      className="w-fit"
                    >
                      {p.status === "completed" && "Đã đóng"}
                      {p.status === "active" && "Đang mở"}
                      {p.status === "locked" && "Sắp mở"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Giá:</span>
                      <span className="font-bold">${p.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bonus:</span>
                      <span className="font-bold text-secondary">
                        +{p.bonus}%
                      </span>
                    </div>
                    <Progress value={p.progress} className="h-2" />
                    <Button
                      variant={p.id === phase.id ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/phase/${p.id}`);
                      }}
                    >
                      {p.id === phase.id ? "Đang xem" : "Xem chi tiết"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/investments")}
              >
                Xem tất cả thông tin đầu tư
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-8 bg-background border-t border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center max-w-6xl mx-auto">
              <Button
                variant="ghost"
                onClick={() => {
                  const prevPhase = phasesData[phase.id - 2];
                  if (prevPhase) router.push(`/phase/${prevPhase.id}`);
                }}
                disabled={phase.id === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Giai đoạn trước
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  const nextPhase = phasesData[phase.id];
                  if (nextPhase) router.push(`/phase/${nextPhase.id}`);
                }}
                disabled={phase.id === 4}
              >
                Giai đoạn tiếp theo
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
