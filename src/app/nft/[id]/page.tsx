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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { toast, TransferService } from "@/services";
import { config, TOKEN_DEAULT_CURRENCY } from "@/api/config";
import { LoadingSkeleton } from "./components/LoadingSkeleton";

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
  const navigate = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [nftData, setNftData] = useState<any>(null);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [comments, setComments] = useState<any>(null);
  const [buyLoading, setBuyLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const id = params?.id as string;
  const type = (searchParams?.get("type") || params?.type) as
    | "tier"
    | "other"
    | undefined;
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    NFTService.getNFTById(id)
      .then((res) => {
        if (res.success && res.data) setNftData(res.data);
        else setNftData(null);
      })
      .catch(() => setNftData(null))
      .finally(() => setLoading(false));
  }, [id]);

  const getComments = async () => {
    const response = await NFTService.getComment(id);
    if (response.success) setComments(response.data.comments);
    else setComments([]);
  };

  useEffect(() => {
    getComments();
  }, [id]);

  useEffect(() => {
    getComments();
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

  const handlePostComment = async () => {
    if (!commentText.trim() || !id || commentLoading) return;

    setCommentLoading(true);
    try {
      const response = await NFTService.pushComment({
        nftId: nftData?.id,
        content: commentText,
        replyTo: null,
      });

      if (response.success) {
        // Clear input
        setCommentText("");

        // Refresh NFT data to get updated comments
        const refreshResponse = await NFTService.getNFTById(id);
        if (refreshResponse.success && refreshResponse.data) {
          setNftData(refreshResponse.data);
          await getComments();
        }
      } else {
        // Handle error - you can add toast notification here
        console.error("Failed to post comment:", response.message);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  const userAddress = user?.walletAddress
    ? formatAddress(user.walletAddress)
    : "Anonymous";

  const handleBuyNFT = async () => {
    if (!nftData || buyLoading) return;
    setBuyLoading(true);

    try {
      const response = await TransferService.sendCanTransfer({
        fromAddress: user?.walletAddress ?? "",
        // toAddressData: nftData?.creator?.address ?? "",
        amountCan: Number(nftData?.price) ?? 0,
      });

      // Nếu có transactionHash thì coi như thành công
      if (response?.transactionHash) {
        await NFTService.transferNFT({
          nftId: nftData?.id,
          transactionHash: response?.transactionHash,
        });
        setBuyLoading(false);
        toast.success("Mua NFT thành công!");
        router.push("/nftmarket");
        // TODO: Có thể thêm toast notification hoặc refresh data
      } else {
        setBuyLoading(false);
        toast.error("Mua NFT thất bại: Không có transaction hash");
        console.error("Failed to buy NFT: No transaction hash");
      }
    } catch (error: any) {
      setBuyLoading(false);
      toast.error(
        `Lỗi khi mua NFT: ${error?.message || "Đã xảy ra lỗi không xác định"}`
      );
      console.error("Error buying NFT:", error?.message || error);
    }
  };

  // Show LoadingSkeleton when buying NFT
  if (buyLoading) {
    return <LoadingSkeleton />;
  }

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
            <div className="glass rounded-xl p-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{nftData.likesCount}</div>
                <div className="text-xs text-muted-foreground">
                  Lượt yêu thích
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {nftData.commentsCount}
                </div>
                <div className="text-xs text-muted-foreground">
                  lượt bình luận
                </div>
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
                    Chủ sở hữu:{" "}
                  </span>
                  <span className="font-mono">
                    {nftData?.owner?.email ?? "Khách hàng"}
                  </span>
                </div>
              </div>
            </div>
            {/* Price */}
            <div className="glass rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-1">Giá bán</div>
              <div className="text-3xl font-bold gradient-text">
                {(() => {
                  const raw = (nftData as any)?.price;
                  const n =
                    typeof raw === "string" ? parseFloat(raw) : Number(raw);
                  const safe = Number.isFinite(n) ? n : 0;
                  return safe.toLocaleString("vi-VN");
                })()}{" "}
                {TOKEN_DEAULT_CURRENCY}
              </div>
              <div className="mt-2 text-xs">
                {nftData.isForSale ? "Đang mở bán" : "Không còn bán"}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  className="flex-1 gap-2 mt-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (type === "other") {
                      setConfirmDialogOpen(true);
                    } else {
                      toast.success("Bạn đã sở hữu NFT này");
                    }
                  }}
                  disabled={buyLoading}
                >
                  {type === "other" ? <ShoppingCart className="w-4 h-4" /> : ""}
                  {buyLoading
                    ? "Đang xử lý..."
                    : type === "other"
                    ? "Mua ngay"
                    : "Đã sở hữu"}
                </Button>
              </div>
              {buyLoading && (
                <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-sm text-blue-400 text-center">
                    Giao dịch đang xử lý...
                  </p>
                </div>
              )}
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
            {Array.isArray(comments) && comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment: any, index: number) => {
                  const commentText =
                    comment.text || comment.content || comment.message || "";
                  const commentAuthor = comment.user.email ?? "";
                  const commentDate =
                    comment.timestamp ||
                    comment.createdAt ||
                    comment.created_at ||
                    comment.date;
                  return (
                    <div
                      key={comment.id || comment._id || index}
                      className="border-b border-border/50 pb-4 last:border-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm font-mono">
                              {formatAddress(commentAuthor)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {commentDate
                                ? (() => {
                                    try {
                                      return new Date(
                                        commentDate
                                      ).toLocaleString();
                                    } catch {
                                      return commentDate;
                                    }
                                  })()
                                : ""}
                            </span>
                          </div>
                          <p className="text-sm text-foreground whitespace-pre-wrap">
                            {comment?.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
              disabled={commentLoading}
              className="min-h-[100px] resize-none border-border/50 mb-3 bg-white text-black placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* Commenting as and Post Button */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Bình luận dưới tên:{" "}
                <span className="font-mono">{user?.email}</span>
              </div>
              <Button
                onClick={handlePostComment}
                disabled={!commentText.trim() || commentLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {commentLoading ? "Đang gửi..." : "Gửi"}
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận mua NFT</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn thực hiện giao dịch mua này không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Không
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setConfirmDialogOpen(false);
                handleBuyNFT();
              }}
              disabled={buyLoading}
            >
              Đồng ý
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
