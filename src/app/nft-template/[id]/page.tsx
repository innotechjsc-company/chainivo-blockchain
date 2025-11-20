"use client";

import { useEffect, useMemo, useRef, useState, use } from "react";
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
import { toast, TransferService, LocalStorageService } from "@/services";
import { config, TOKEN_DEAULT_CURRENCY } from "@/api/config";
import { formatAmount, getLevelBadge } from "@/lib/utils";
import { LoadingSpinner } from "@/lib/loadingSpinner";

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
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState(false);
  const id = params?.id as string;
  const type = (searchParams?.get("type") || params?.type) as
    | "tier"
    | "other"
    | undefined;
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    NFTService.getNFTByTemplateId(id)
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
            <Button onClick={() => router.push("/nft-market")}>Quay lại</Button>
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

  // Function to get NFT image from API backend or fallback to default
  const getNFTImage = (nft: any): string => {
    // Helper to construct full image URL from API
    const getImageUrl = (imageData: any): string | null => {
      if (!imageData) return null;

      let imageUrl: string;

      // Handle different image data structures
      if (typeof imageData === "string") {
        imageUrl = imageData;
      } else if (imageData?.url) {
        imageUrl = imageData.url;
      } else if (imageData?.image) {
        imageUrl =
          typeof imageData.image === "string"
            ? imageData.image
            : imageData.image?.url;
      } else {
        return null;
      }

      if (!imageUrl || imageUrl.trim() === "") return null;

      // If URL is already a full URL (starts with http), use it directly
      if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        return imageUrl;
      }

      // If it's a relative path, combine with API_BASE_URL
      // Handle slashes properly to avoid double slashes
      const apiBase = config.API_BASE_URL.endsWith("/")
        ? config.API_BASE_URL.slice(0, -1)
        : config.API_BASE_URL;
      const imagePath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
      return `${apiBase}${imagePath}`;
    };

    // Try to get image from API backend first
    const apiImageUrl = getImageUrl(
      nft?.image || nft?.imageUrl || nft?.image_url
    );
    if (apiImageUrl) {
      return apiImageUrl;
    }

    // Default fallback
    return "/nft-box.jpg";
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
        const refreshResponse = await NFTService.getNFTByTemplateId(id);
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
          templateId: nftData?.id,
          transactionHash: response?.transactionHash,
        });
        setBuyLoading(false);
        toast.success("Mua NFT thành công!");
        router.push("/nft-market");
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

  // Rewards Table Component
  const RewardsTable = () => {
    if (
      nftData?.type !== "mysteryBox" ||
      !nftData?.rewards ||
      nftData.rewards.length === 0
    ) {
      return null;
    }

    return (
      <Card className="glass border-purple-500/30 bg-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-300">
            <ShoppingBag className="w-5 h-5" />
            Giải thưởng trong hộp quà ({nftData.rewards.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-purple-500/20">
                <tr className="text-muted-foreground">
                  <th className="text-left py-3 px-4 font-medium">STT</th>
                  <th className="text-left py-3 px-4 font-medium">Loại</th>
                  <th className="text-left py-3 px-4 font-medium">Chi tiết</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {nftData.rewards.map((reward: any, index: number) => (
                  <tr
                    key={reward.id || index}
                    className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors"
                  >
                    <td className="py-3 px-4 text-white font-mono">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={`
                          ${
                            reward.rewardType === "nft"
                              ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                              : "bg-green-500/20 text-green-300 border-green-500/30"
                          }
                        `}
                      >
                        {reward.rewardType === "nft" ? "NFT" : "Token"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-white">
                      {reward.rewardType === "nft" ? (
                        <span className="text-blue-300">
                          Cấp {reward.rank || "—"}
                        </span>
                      ) : (
                        <span className="text-green-300 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {formatAmount(reward.tokenMinQuantity || 0)} -{" "}
                          {formatAmount(reward.tokenMaxQuantity || 0)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={`
                          ${
                            reward.isOpenable
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                          }
                        `}
                      >
                        {reward.isOpenable ? "✓ Có thể mở" : "Chưa mở"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (buyLoading) {
    return <LoadingSpinner />;
  }
  const DETAIL_PANEL_MAX_HEIGHT = 645;
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {/* Image section */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden glass flex items-center justify-center">
              <img
                src={getNFTImage(nftData)}
                alt={nftData.name ?? "NFT"}
                className="object-cover w-full relative overflow-hidden  flex items-center justify-center"
                style={{ height: `${DETAIL_PANEL_MAX_HEIGHT}px` }}
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

            <Card className="glass">
              <CardContent>
                <h3 className="font-semibold mb-4 text-white">
                  Thông tin chi tiết
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                    <div className="text-xs text-muted-foreground mb-1">
                      Loại NFT
                    </div>
                    <div className="text-sm font-semibold text-white capitalize">
                      {nftData?.type || "—"}
                    </div>
                  </div>
                  <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                    <div className="text-xs text-muted-foreground mb-1">
                      Độ hiếm
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {getLevelBadge(nftData?.level as string)}
                    </div>
                  </div>
                  <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                    <div className="text-xs text-muted-foreground mb-1">
                      Đơn vị tiền tệ
                    </div>
                    <div className="text-sm font-semibold text-white uppercase">
                      {nftData?.currency || "CAN"}
                    </div>
                  </div>
                  <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                    <div className="text-xs text-muted-foreground mb-1">
                      Trạng thái
                    </div>
                    <div className="text-sm font-semibold">
                      {nftData?.isActive ? (
                        <span className="text-emerald-400">✓ Hoạt động</span>
                      ) : (
                        <span className="text-red-400">✗ Tạm dừng</span>
                      )}
                    </div>
                  </div>
                  {nftData?.createdAt && (
                    <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                      <div className="text-xs text-muted-foreground mb-1">
                        Ngày tạo
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {(() => {
                          try {
                            return new Date(nftData.createdAt).toLocaleString(
                              "vi-VN"
                            );
                          } catch {
                            return String(nftData.createdAt);
                          }
                        })()}
                      </div>
                    </div>
                  )}
                  {nftData?.updatedAt && (
                    <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                      <div className="text-xs text-muted-foreground mb-1">
                        Cập nhật
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {(() => {
                          try {
                            return new Date(nftData.updatedAt).toLocaleString(
                              "vi-VN"
                            );
                          } catch {
                            return String(nftData.updatedAt);
                          }
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Rewards - visible on tablet+ only */}
            <div className="hidden md:block">
              <RewardsTable />
            </div>
          </div>

          {/* Details section */}
          <div
            className="space-y-6 lg:pr-3 lg:sticky lg:top-21"
            style={{ maxHeight: `${DETAIL_PANEL_MAX_HEIGHT}px` }}
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {nftData.name ?? "Không rõ"}
              </h1>
              <div>
                <CollapsibleDescription
                  html={String(nftData?.description || "").replace(
                    /\n/g,
                    "<br/>"
                  )}
                />
              </div>
            </div>
            {/* Price */}
            <div className="glass rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-1">Giá bán</div>
              <div className="text-3xl font-bold gradient-text">
                {formatAmount((nftData as any)?.price)} {TOKEN_DEAULT_CURRENCY}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="default"
                  className="flex-1 gap-2 mt-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user) {
                      toast.error("Bạn vui lòng đăng nhập để tiếp tục mua ");
                      return;
                    }
                    const isConnected =
                      LocalStorageService.isConnectedToWallet();
                    if (!isConnected) {
                      setShowConnectModal(true);
                      return;
                    }
                    setConfirmDialogOpen(true);
                  }}
                  disabled={buyLoading}
                >
                  {type === "other" ? <ShoppingCart className="w-4 h-4" /> : ""}
                  {buyLoading ? "Đang xử lý..." : "Mua ngay"}
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

          {/* Rewards - visible on mobile only */}
          <div className="md:hidden">
            <RewardsTable />
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

      {/* Connect Wallet Modal */}
      <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kết nối ví</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            Vui lòng kết nối ví để thực hiện mua NFT.
          </div>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setShowConnectModal(false)}
              disabled={connectingWallet}
            >
              Huỷ
            </Button>
            <Button
              className="cursor-pointer"
              onClick={async () => {
                try {
                  setConnectingWallet(true);
                  const eth = (window as any)?.ethereum;
                  if (!eth?.isMetaMask) {
                    setConnectingWallet(false);
                    setShowConnectModal(false);
                    return;
                  }
                  await eth.request({ method: "eth_requestAccounts" });
                  LocalStorageService.setWalletConnectionStatus(true);
                  try {
                    window.dispatchEvent(
                      new Event("wallet:connection-changed")
                    );
                  } catch {}
                  setShowConnectModal(false);
                  setConfirmDialogOpen(true);
                } catch (_e) {
                  setShowConnectModal(false);
                } finally {
                  setConnectingWallet(false);
                }
              }}
              disabled={connectingWallet}
            >
              {connectingWallet ? "Đang kết nối..." : "Kết nối"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CollapsibleDescription({
  html,
  maxHeight,
}: {
  html: string;
  maxHeight?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMultiLine, setIsMultiLine] = useState(false);
  const measureRef = useRef<HTMLSpanElement>(null);

  const collapsedText = useMemo(() => {
    if (!html) return "";
    return html
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/p>/gi, " ")
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }, [html]);

  useEffect(() => {
    const measureEl = measureRef.current;
    if (!measureEl) return;
    const computedStyle = window.getComputedStyle(measureEl);
    const lineHeight = parseFloat(computedStyle.lineHeight || "0");
    if (!lineHeight) {
      setIsMultiLine(false);
      return;
    }
    const isOverflowing = measureEl.scrollHeight - 1 > lineHeight;
    setIsMultiLine(isOverflowing);
  }, [collapsedText]);

  if (isExpanded) {
    return (
      <div className="">
        <div
          className="text-muted-foreground leading-relaxed overflow-y-auto h-[700px]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div className="text-right">
          <button
            type="button"
            className="text-primary text-sm font-medium hover:underline cursor-pointer"
            onClick={() => setIsExpanded(false)}
          >
            Thu gọn
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2">
        <span
          className={`text-muted-foreground leading-relaxed flex-1 ${
            isMultiLine ? "truncate" : ""
          }`}
        >
          {collapsedText}
        </span>
        {isMultiLine && (
          <button
            type="button"
            className="text-primary text-sm font-medium hover:underline cursor-pointer flex-shrink-0"
            onClick={() => setIsExpanded(true)}
          >
            Xem thêm
          </button>
        )}
      </div>
      <span
        ref={measureRef}
        className="invisible absolute left-0 top-0 w-full whitespace-normal leading-relaxed pointer-events-none select-none"
        aria-hidden="true"
      >
        {collapsedText}
      </span>
    </div>
  );
}
