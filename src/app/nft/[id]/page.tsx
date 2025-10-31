"use client";

import { useEffect, useState, use } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/stores";
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  TrendingUp,
  Clock,
  User,
  ShoppingBag,
  DollarSign,
  TrendingDown,
  Eye,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { NFT, NFTService } from "@/api/services/nft-service";

const rarityColors = {
  Common: "bg-gray-500/20 text-gray-300",
  Rare: "bg-blue-500/20 text-blue-300",
  Epic: "bg-purple-500/20 text-purple-300",
  Legendary: "bg-yellow-500/20 text-yellow-300",
  Mythic: "bg-pink-500/20 text-pink-300",
  Divine: "bg-red-500/20 text-red-300",
};

// Chart configuration for shadcn/ui

export default function NFTDetailPage() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [nftData, setNftData] = useState<any>(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const id = params?.id as string;
  const type = params?.type as "tier" | "other";
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    NFTService.getNFTById(id)
      .then((res) => {
        debugger;

        if (res.success && res.data) setNftData(res.data);
        else setNftData(null);
      })
      .catch(() => setNftData(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!nftData) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Không tìm thấy NFT</h1>
            <Button onClick={() => router.push("/nftmarket")}>Quay lại</Button>
          </div>
        </main>
      </div>
    );
  }

  // Helper function to format address with truncation
  const formatAddress = (address: any) => {
    if (!address) return "-";
    let addr: string = "";
    if (
      typeof address === "object" &&
      address !== null &&
      "address" in address
    ) {
      addr = String(address.address || "");
    } else if (typeof address === "string") {
      addr = address;
    } else {
      return "-";
    }
    if (!addr || addr.length <= 10) return addr || "-";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      author: user?.walletAddress || "Anonymous",
      timestamp: new Date().toISOString(),
    };

    setComments([...comments, newComment]);
    setCommentText("");
    // TODO: Call API to save comment
  };

  const userAddress = user?.walletAddress
    ? formatAddress(user.walletAddress)
    : "Anonymous";

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-12">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push("/nftmarket")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden glass flex items-center justify-center">
              <img
                src={nftData.image || "/nft-box.jpg"}
                alt={nftData.name ?? "NFT"}
                className="object-cover w-full h-full"
                onError={(e) => {
                  // Fallback nếu cả ảnh mặc định cũng lỗi
                  const target = e.target as HTMLImageElement;
                  target.src = "/nft-box.jpg";
                }}
              />
            </div>
            <div className="glass rounded-xl p-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {nftData.stats?.favorites
                    ? Number(nftData.stats.favorites)
                    : 0}
                </div>
                <div className="text-xs text-muted-foreground">Yêu thích</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {nftData.stats?.views ? Number(nftData.stats.views) : 0}
                </div>
                <div className="text-xs text-muted-foreground">Lượt xem</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {nftData.stats?.totalSales
                    ? Number(nftData.stats.totalSales)
                    : 0}
                </div>
                <div className="text-xs text-muted-foreground">Sở hữu</div>
              </div>
            </div>
          </div>

          {/* Details section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {nftData.name ?? "Không rõ"}
              </h1>
              <p className="text-muted-foreground mb-3">
                {nftData.description ?? "Không có mô tả"}
              </p>
              <div className="flex flex-wrap gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">
                    Người tạo:{" "}
                  </span>
                  <span className="font-mono">
                    {nftData.creator
                      ? typeof nftData.creator === "object" &&
                        nftData.creator !== null
                        ? (nftData.creator as any).address ?? "Không rõ"
                        : nftData.creator
                      : "Không rõ"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    Chủ sở hữu:{" "}
                  </span>
                  <span className="font-mono">
                    {nftData.owner
                      ? typeof nftData.owner === "object" &&
                        nftData.owner !== null
                        ? (nftData.owner as any).address ?? "Không rõ"
                        : nftData.owner
                      : "Không rõ"}
                  </span>
                </div>
              </div>
            </div>
            {/* Price */}
            <div className="glass rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-1">Giá bán</div>
              <div className="text-3xl font-bold gradient-text">
                {nftData?.currentPrice?.amount ?? 0}{" "}
                {nftData?.currentPrice?.currency ?? ""}
              </div>
              <div className="mt-2 text-xs">
                {nftData.isForSale ? "Đang mở bán" : "Không còn bán"}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  className="flex-1 gap-2 mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {type === "other" ? <ShoppingCart className="w-4 h-4" /> : ""}
                  {type === "other" ? "Mua ngay" : "Mint on Blockchain"}
                </Button>
              </div>
            </div>
            {/* Attributes */}
            {Array.isArray(nftData.attributes) &&
              nftData.attributes.length > 0 && (
                <div className="glass rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-2">Thuộc tính NFT</h3>
                  <div
                    className="grid gap-3"
                    style={{
                      gridTemplateColumns: `repeat(auto-fit, minmax(120px, 1fr))`,
                    }}
                  >
                    {nftData.attributes.map((attr: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-muted/20 rounded-lg p-3 text-center"
                      >
                        <div className="text-xs text-muted-foreground mb-1">
                          {attr.trait_type ?? "Không rõ"}
                        </div>
                        <div className="font-semibold">{attr.value ?? "-"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Lịch sử giao dịch</h3>
              <div className="space-y-3">
                {Array.isArray(nftData.transactions) &&
                nftData.transactions.length > 0 ? (
                  nftData.transactions.map((item: any, index: number) => {
                    debugger;
                    const fromAddress = formatAddress(item.from);
                    const addressDisplay = item.from
                      ? fromAddress
                      : formatAddress(item.transactionHash);

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-base">
                              {item.event || item.type || "Không rõ"}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {addressDisplay}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-semibold text-base">
                            {item.amount || ""} {item.currency || ""}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(
                              item.date || item.timestamp || "-"
                            ).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    Không có lịch sử giao dịch
                  </div>
                )}
              </div>
            </div>
            {/* Metadata (if exists) */}
            {nftData.metadata && (
              <div className="glass rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-2">Metadata</h3>
                <pre className="bg-muted text-xs rounded p-2 overflow-auto max-h-60">
                  {(() => {
                    try {
                      return JSON.stringify(nftData.metadata, null, 2);
                    } catch {
                      return "Không đọc được metadata";
                    }
                  })()}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div
          className="glass rounded-xl p-6 mt-12 flex flex-col"
          style={{ height: "600px" }}
        >
          <h2 className="text-2xl font-bold mb-6">Comments</h2>

          {/* Comments List - Scrollable */}
          <div className="flex-1 overflow-y-auto pr-2 mb-4 min-h-0">
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-b border-border/50 pb-4 last:border-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm font-mono">
                            {comment.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
          {/* Comment Input */}
          <div className="mb-4">
            <Textarea
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-h-[100px] resize-none border-border/50 mb-3 bg-white text-black placeholder:text-gray-400"
            />

            {/* Commenting as and Post Button */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Commenting as:{" "}
                <span className="font-mono">{user?.username}</span>
              </div>
              <Button
                onClick={handlePostComment}
                disabled={!commentText.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-6 py-2"
              >
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
