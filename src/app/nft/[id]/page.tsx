"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppSelector } from "@/stores";
import { ArrowLeft, ShoppingCart, Clock, DollarSign } from "lucide-react";
import { NFT, NFTService } from "@/api/services/nft-service";
import { toast, TransferService, LocalStorageService } from "@/services";
import { config, TOKEN_DEAULT_CURRENCY } from "@/api/config";
import { getLevelBadge, getNFTType } from "@/lib/utils";
import { LoadingSpinner } from "@/lib/loadingSpinner";
import { Card, CardContent } from "@/components/ui/card";

function CollapsibleDescription({ html }: { html: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [halfHeight, setHalfHeight] = useState<number>(0);
  const descRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    const compute = () => {
      const full = el.scrollHeight || 0;
      setHalfHeight(Math.max(0, Math.floor(full / 2)));
    };
    const id = window.setTimeout(compute, 0);
    window.addEventListener("resize", compute);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("resize", compute);
    };
  }, [html]);

  return (
    <div>
      <div className="relative">
        <div
          ref={descRef}
          className="text-muted-foreground mb-3 leading-relaxed transition-[max-height] duration-300 ease-in-out"
          style={{
            maxHeight: isExpanded
              ? "none"
              : halfHeight
              ? `${halfHeight}px`
              : "6rem",
            overflow: "hidden",
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {!isExpanded && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent" />
        )}
      </div>
      <button
        type="button"
        className="text-primary text-sm font-medium hover:underline cursor-pointer"
        onClick={() => setIsExpanded((v) => !v)}
      >
        {isExpanded ? "Thu gọn" : "Xem thêm"}
      </button>
    </div>
  );
}

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
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const id = params?.id as string;
  const type = (searchParams?.get("type") || params?.type) as
    | "tier"
    | "other"
    | undefined;
  const user = useAppSelector((state) => state.auth.user);

  const getComments = async () => {
    try {
      const response = await NFTService.getComment(id);
      if (response.success) setComments(response.data.comments);
      else setComments([]);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      const response = await NFTService.buyP2PHistoryTransaction(id);
      if (response.success) {
        setTransactions((response.data as any)?.transactions ?? []);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      setTransactions([]);
    }
  };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    // Set loading to true when component mounts
    setLoading(true);

    // Fetch all data in parallel
    const fetchAllData = async () => {
      try {
        await Promise.all([
          // Fetch NFT data
          NFTService.getNFTById(id)
            .then((res) => {
              if (res.success && res.data) setNftData(res.data);
              else setNftData(null);
            })
            .catch(() => setNftData(null)),
          // Fetch comments
          getComments(),
          // Fetch transaction history
          fetchTransactionHistory(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // Set loading to false when all API calls are complete
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!nftData) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Không tìm thấy NFT</h1>
            <Button onClick={() => router.back()}>Quay lại</Button>
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
        amountCan:
          Number(nftData?.salePrice ? nftData?.salePrice : nftData?.price) ?? 0,
      });

      // Nếu có transactionHash thì coi như thành công
      if (response?.transactionHash) {
        let result = await NFTService.buyP2PList({
          nftId: nftData?.id,
          transactionHash: response?.transactionHash,
        });

        if (result.success) {
          setBuyLoading(false);
          toast.success("Mua NFT thành công!");
          router.push("/p2p-market");
        } else {
          setBuyLoading(false);
          toast.error(
            "Mua NFT thất bại , vui lòng liên hệ admin để được hỗ trợ: " +
              result.message
          );
          console.error("Failed to buy NFT: " + result.message);
        }
      } else {
        setBuyLoading(false);
        toast.error("Mua NFT thất bại: Không có transaction hash");
        console.error("Failed to buy NFT: No transaction hash");
      }
    } catch (error: any) {
      setBuyLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Loading Overlay when buying NFT */}
      {buyLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 px-6 py-8 bg-background/95 rounded-lg border border-primary/20 shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="text-lg font-medium text-foreground">
              Đang xử lý giao dịch...
            </span>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Vui lòng đợi trong giây lát, không đóng trình duyệt
            </p>
          </div>
        </div>
      )}
      <main className="container mx-auto px-4 pt-20 pb-12">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden glass flex items-center justify-center">
              <img
                src={getNFTImage(nftData)}
                alt={nftData.name ?? "NFT"}
                className="object-cover w-full h-full"
                onError={(e) => {
                  // Fallback nếu cả ảnh mặc định cũng lỗi
                  const target = e.target as HTMLImageElement;
                  target.src = "/nft-box.jpg";
                }}
              />
            </div>
          </div>

          {/* Details section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {nftData.name ?? "Không rõ"}
              </h1>
              <div>
                <p> Mô tả : </p>
                <CollapsibleDescription
                  html={String(nftData?.description || "").replace(
                    /\n/g,
                    "<br/>"
                  )}
                />
              </div>
              <p>
                {user?.walletAddress === nftData?.walletAddress
                  ? "NFT của bạn"
                  : ""}
              </p>
            </div>
            {/* Price */}
            <div className="glass rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-1">Giá bán</div>
              <div className="text-3xl font-bold gradient-text">
                {(() => {
                  const raw = (nftData as any)?.salePrice
                    ? nftData?.salePrice
                    : nftData?.price;
                  const n =
                    typeof raw === "string" ? parseFloat(raw) : Number(raw);
                  const safe = Number.isFinite(n) ? n : 0;
                  return safe.toLocaleString("vi-VN");
                })()}{" "}
                {TOKEN_DEAULT_CURRENCY}
              </div>

              {user?.walletAddress === nftData?.walletAddress ? (
                ""
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    className="flex-1 gap-2 mt-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) {
                        toast.error("Bạn vui lòng đăng nhập để tiếp tục");
                        return;
                      }
                      if (type !== "other") {
                        toast.success("Bạn đã sở hữu NFT này");
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
                    {type === "other" ? (
                      <ShoppingCart className="w-4 h-4" />
                    ) : (
                      ""
                    )}
                    {buyLoading
                      ? "Đang xử lý..."
                      : type === "other"
                      ? "Mua ngay"
                      : "Đã sở hữu"}
                  </Button>
                </div>
              )}

              {buyLoading && (
                <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-sm text-blue-400 text-center">
                    Giao dịch đang xử lý...
                  </p>
                </div>
              )}
            </div>
            {/* Attributes */}
            <Card className="glass">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 text-white">
                  Thông tin chi tiết
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                    <div className="text-xs text-muted-foreground mb-1">
                      Loại NFT
                    </div>
                    <div className="text-sm font-semibold text-white capitalize">
                      {getNFTType(nftData.type as string)}
                    </div>
                  </div>
                  <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                    <div className="text-xs text-muted-foreground mb-1">
                      Độ hiếm
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {getLevelBadge(nftData.level as string)}
                    </div>
                  </div>
                  {Boolean(nftData?.price) && (
                    <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                      <div className="text-xs text-muted-foreground mb-1">
                        Giá bán
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {(() => {
                          const n = Number(nftData?.price);
                          return Number.isFinite(n)
                            ? n.toLocaleString("vi-VN")
                            : String(nftData?.price);
                        })()}{" "}
                        {TOKEN_DEAULT_CURRENCY}
                      </div>
                    </div>
                  )}
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
          </div>
        </div>

        {Array.isArray(nftData.documents) && nftData.documents.length > 0 && (
          <div className="mt-8">
            <div className="glass rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Tài liệu và Tập tin</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nftData.documents.map((doc: any, idx: number) => {
                  const docName =
                    doc?.name || doc?.filename || `Tài liệu ${idx + 1}`;
                  const docUrl = doc?.url || doc?.link || "";
                  const docType = doc?.type || doc?.mimeType || "file";
                  const fileSize = doc?.filesize || doc?.size || 0;

                  // Format file size
                  const formatFileSize = (bytes: number) => {
                    if (bytes === 0) return "0 B";
                    const k = 1024;
                    const sizes = ["B", "KB", "MB", "GB"];
                    const i = Math.floor(Math.log(bytes) / Math.log(k));
                    return (
                      Math.round((bytes / Math.pow(k, i)) * 100) / 100 +
                      " " +
                      sizes[i]
                    );
                  };

                  // Get file icon based on type
                  const getFileIcon = (type: string) => {
                    if (type.includes("pdf")) return "📄";
                    if (type.includes("image")) return "🖼️";
                    if (type.includes("video")) return "🎥";
                    if (type.includes("audio")) return "🎵";
                    if (type.includes("zip") || type.includes("rar"))
                      return "📦";
                    return "📎";
                  };

                  return (
                    <a
                      key={idx}
                      href={docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group glass rounded-lg p-4 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-105 cursor-pointer border border-primary/20 hover:border-primary/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                          {getFileIcon(docType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate group-hover:text-primary transition-colors">
                            {docName}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatFileSize(fileSize)}
                          </p>
                          {docType && (
                            <Badge
                              variant="secondary"
                              className="mt-2 text-xs bg-primary/20 text-primary"
                            >
                              {docType.split("/")[1] || docType}
                            </Badge>
                          )}
                        </div>
                        <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          <DollarSign className="w-4 h-4" />
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Transaction History Section */}
        <div className="mt-8">
          <div className="glass rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Lịch sử giao dịch</h2>
            {Array.isArray(transactions) && transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                        Loại
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                        Từ
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                        Đến
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                        Giá trị
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                        Ngày giao dịch
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx: any, idx: number) => {
                      const txType =
                        tx.type || tx.transaction_type || "transfer";
                      // Handle from address (could be object or string)
                      let fromAddr = "-";
                      if (tx.from) {
                        fromAddr =
                          typeof tx.from === "object" && tx.from?.address
                            ? tx.from.address
                            : typeof tx.from === "string"
                            ? tx.from
                            : "-";
                      } else if (tx.fromAddress) {
                        fromAddr =
                          typeof tx.fromAddress === "object" &&
                          tx.fromAddress?.address
                            ? tx.fromAddress.address
                            : typeof tx.fromAddress === "string"
                            ? tx.fromAddress
                            : "-";
                      } else if (tx.seller?.walletAddress) {
                        fromAddr = tx.seller.walletAddress;
                      } else if (tx.seller?.address) {
                        fromAddr = tx.seller.address;
                      }

                      // Handle to address (could be object or string)
                      let toAddr = "-";
                      if (tx.to) {
                        toAddr =
                          typeof tx.to === "object" && tx.to?.address
                            ? tx.to.address
                            : typeof tx.to === "string"
                            ? tx.to
                            : "-";
                      } else if (tx.toAddress) {
                        toAddr =
                          typeof tx.toAddress === "object" &&
                          tx.toAddress?.address
                            ? tx.toAddress.address
                            : typeof tx.toAddress === "string"
                            ? tx.toAddress
                            : "-";
                      } else if (tx.buyer?.walletAddress) {
                        toAddr = tx.buyer.walletAddress;
                      } else if (tx.buyer?.address) {
                        toAddr = tx.buyer.address;
                      }

                      const amount =
                        tx.amount ||
                        tx.salePrice ||
                        tx.price ||
                        tx.value ||
                        tx.total_value ||
                        0;
                      const currency = tx.currency || TOKEN_DEAULT_CURRENCY;

                      const timestamp =
                        tx.timestamp ||
                        tx.createdAt ||
                        tx.created_at ||
                        tx.date ||
                        "-";

                      return (
                        <tr
                          key={idx}
                          className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                txType === "buy" || txType === "purchase"
                                  ? "default"
                                  : txType === "sell"
                                  ? "destructive"
                                  : "outline"
                              }
                              className="text-xs"
                            >
                              {txType === "buy" || txType === "purchase"
                                ? "Mua"
                                : txType === "sell"
                                ? "Bán"
                                : "Chuyển"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm font-mono">
                            {formatAddress(fromAddr)}
                          </td>
                          <td className="py-3 px-4 text-sm font-mono">
                            {formatAddress(toAddr)}
                          </td>
                          <td className="py-3 px-4 text-sm font-semibold">
                            {Number(amount).toLocaleString("vi-VN")} {currency}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {timestamp !== "-"
                              ? (() => {
                                  try {
                                    return new Date(timestamp).toLocaleString(
                                      "vi-VN"
                                    );
                                  } catch {
                                    return timestamp;
                                  }
                                })()
                              : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có lịch sử giao dịch</p>
              </div>
            )}
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
