import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, Award, Activity } from "lucide-react";
import { useUser, useWallet } from "@/stores";

export const UserDashboard = () => {
  const user = useUser();
  const wallet = useWallet();

  // Mock data for demonstration - replace with actual data from stores
  const profile = {
    username: user?.username || "User",
    can_balance: wallet?.balance || 1250,
    total_invested: 5000, // Mock investment data
    membership_tier: "gold", // Mock membership tier
  };

  if (!user) return null;

  const tierColors = {
    bronze: "text-orange-400",
    silver: "text-gray-300",
    gold: "text-yellow-400",
    platinum: "text-cyan-400",
  };

  return (
    <section className="py-12 relative">
      <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-primary/20 to-secondary/20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Xin chào, {profile.username}!
          </h2>
          <p className="text-foreground/60">Dashboard của bạn</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass border-primary/30 hover:border-primary/60 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Số dư CAN
              </CardTitle>
              <Wallet className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">
                {profile.can_balance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">CAN tokens</p>
            </CardContent>
          </Card>

          <Card className="glass border-secondary/30 hover:border-secondary/60 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Tổng đầu tư
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                ${profile.total_invested?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">USD</p>
            </CardContent>
          </Card>

          <Card className="glass border-accent/30 hover:border-accent/60 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Hạng thành viên
              </CardTitle>
              <Award className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold capitalize ${
                  tierColors[profile.membership_tier as keyof typeof tierColors]
                }`}
              >
                {profile.membership_tier}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Tier level</p>
            </CardContent>
          </Card>

          <Card className="glass border-primary/30 hover:border-primary/60 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Trạng thái
              </CardTitle>
              <Activity className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">Active</div>
              <p className="text-xs text-muted-foreground mt-1">
                Đang hoạt động
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
