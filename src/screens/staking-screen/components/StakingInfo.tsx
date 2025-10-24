"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Package, TrendingUp, Sparkles } from "lucide-react";

export const StakingInfo = () => {
  return (
    <Card className="mt-8 border-primary/20 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <TrendingUp className="h-6 w-6" />
          Cách thức hoạt động
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Coins className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Staking CAN Token</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• APY cố định 10% mỗi năm</li>
                  <li>• Phần thưởng tích lũy theo thời gian thực</li>
                  <li>• Nhận thưởng bất cứ lúc nào bạn muốn</li>
                  <li>
                    • Sau khi nhận thưởng, thời gian sẽ reset và tiếp tục tích
                    lũy
                  </li>
                  <li>• CAN stake vẫn giữ nguyên trong tài khoản</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Staking NFT</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• APY cao hơn 15% mỗi năm</li>
                  <li>• Phần thưởng tích lũy theo thời gian thực</li>
                  <li>• Nhận thưởng bằng CAN token</li>
                  <li>
                    • Sau khi nhận thưởng, thời gian sẽ reset và tiếp tục tích
                    lũy
                  </li>
                  <li>• NFT vẫn thuộc sở hữu của bạn</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Lưu ý quan trọng</p>
              <p className="text-sm text-muted-foreground">
                Phần thưởng được tính dựa trên thời gian stake thực tế. Bạn có
                thể nhận thưởng bất cứ lúc nào, sau đó thời gian sẽ được reset
                về 0 và tiếp tục tích lũy phần thưởng mới. Không có thời gian
                khóa tối thiểu!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
