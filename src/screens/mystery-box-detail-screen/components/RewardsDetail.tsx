"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Coins, Image } from "lucide-react";
import type {
  MysteryBoxData,
  Reward,
} from "@/screens/mystery-box-screen/hooks/useMysteryBoxData";
import { TOKEN_DEAULT_CURRENCY } from "@/api/config";

interface RewardsDetailProps {
  box: MysteryBoxData;
}

export const RewardsDetail = ({ box }: RewardsDetailProps) => {
  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          <CardTitle>Phần Thưởng Có Thể Nhận</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {box.rewards && box.rewards.length > 0 ? (
          <div className="space-y-4">
            {box.rewards.map((reward) => (
              <div
                key={reward.id}
                className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor:
                        reward.rewardType === "token"
                          ? "rgba(250, 204, 21, 0.2)"
                          : "rgba(168, 85, 247, 0.2)",
                    }}
                  >
                    {reward.rewardType === "token" ? (
                      <Coins className="w-6 h-6 text-yellow-400" />
                    ) : (
                      <Image className="w-6 h-6 text-purple-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold capitalize mb-2">
                      {reward.rewardType === "token" ? "Token" : "NFT"}
                    </h3>

                    {reward.description ? (
                      <p className="text-sm text-muted-foreground">
                        {reward.description}
                      </p>
                    ) : reward.rewardType === "token" ? (
                      <p className="text-sm text-muted-foreground">
                        Nhận được từ{" "}
                        <span className="text-foreground font-medium">
                          {reward.tokenMinQuantity?.toLocaleString()}
                        </span>{" "}
                        đến{" "}
                        <span className="text-foreground font-medium">
                          {reward.tokenMaxQuantity?.toLocaleString()}
                        </span>{" "}
                        {TOKEN_DEAULT_CURRENCY}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        NFT có giá trị từ{" "}
                        <span className="text-foreground font-medium">
                          {reward.nftPriceMin?.toLocaleString()}
                        </span>{" "}
                        đến{" "}
                        <span className="text-foreground font-medium">
                          {reward.nftPriceMax?.toLocaleString()}
                        </span>{" "}
                        {TOKEN_DEAULT_CURRENCY}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Phần thưởng sẽ được tiết lộ khi mở hộp</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
