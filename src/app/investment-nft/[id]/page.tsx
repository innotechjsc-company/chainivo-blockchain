"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, ArrowLeft } from "lucide-react";
import NFTService from "@/api/services/nft-service";
import { config, TOKEN_DEAULT_CURRENCY } from "@/api/config";
import { getLevelBadge, getNFTType } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import TransferService from "@/services/TransferService";
import { useAppSelector } from "@/stores";
import { Spinner } from "@/components/ui/spinner";
import { LoadingSpinner } from "@/lib/loadingSpinner";
import { LocalStorageService } from "@/services";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function InvestmentNFTDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [buyLoading, setBuyLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] =
    useState<boolean>(false);
  const user = useAppSelector((state) => state.auth.user);
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);
  const [connectingWallet, setConnectingWallet] = useState<boolean>(false);
  const [shareDetail, setShareDetail] = useState<any>(null);
  const [shareDetailLoading, setShareDetailLoading] = useState<boolean>(false);
  const [showAllShareDetail, setShowAllShareDetail] = useState<boolean>(false);

  const formatAmount = (value: unknown) => {
    const num = Number(value || 0);
    if (Number.isNaN(num)) return String(value ?? "-");
    return num.toLocaleString("en-US");
  };

  const formatAddress = (address?: string) => {
    if (!address) return "";
    const start = address.slice(0, 6);
    const end = address.slice(-4);
    return `${start}...${end}`;
  };

  const getImageUrl = (imageData: any): string | null => {
    if (!imageData) return null;
    let imageUrl: string | undefined;
    if (typeof imageData === "string") imageUrl = imageData;
    else if (imageData?.url) imageUrl = imageData.url;
    else if (imageData?.image)
      imageUrl =
        typeof imageData.image === "string"
          ? imageData.image
          : imageData.image?.url;
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))
      return imageUrl;
    const base = config.API_BASE_URL.endsWith("/")
      ? config.API_BASE_URL.slice(0, -1)
      : config.API_BASE_URL;
    const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    return `${base}${path}`;
  };

  const imageSrc = useMemo(() => {
    return (
      getImageUrl(data?.image || data?.imageUrl || data?.image_url) ||
      (data?.type === "tier" ? "/tier-gold.jpg" : "/nft-box.jpg")
    );
  }, [data]);

  const handleBuyNFT = async () => {
    if (!data || buyLoading) return;
    setBuyLoading(true);

    try {
      const response = await TransferService.sendCanTransfer({
        fromAddress: user?.walletAddress ?? "",
        amountCan: Number(data?.pricePerShare * Number(quantity)) ?? 0,
      });

      if (response?.transactionHash) {
        let result = await NFTService.buyNFTInvestmentList({
          nftId: data?.id,
          transactionHash: response?.transactionHash,
          shares: Number(quantity),
        });
        if (result.success) {
          setBuyLoading(false);
          toast.success("Mua cổ phần NFT thành công!");
          router.push("/nft-investment");
        } else {
          setBuyLoading(false);
          toast.error(
            "Mua cổ phần NFT thất bại , vui lòng liên hệ admin để được hỗ trợ: " +
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

  const fetchTransactionHistory = async () => {
    try {
      setTransactionsLoading(true);
      const response = await NFTService.investmentNFTHistoryTransaction(
        String(params?.id || "")
      );
      if (response && Array.isArray(response.docs)) {
        setTransactions(response.docs);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      setTransactions([]);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const fetchShareDetail = async () => {
    const nftId = String(params?.id || "");
    if (!nftId || !user) return;

    try {
      setShareDetailLoading(true);
      const response = await NFTService.getShareDetail({ nftId });
      if (response.success && response.data) {
        setShareDetail(response.data?.dataDetail);
      } else {
        setShareDetail(null);
      }
    } catch (error) {
      console.error("Error fetching share detail:", error);
      setShareDetail(null);
    } finally {
      setShareDetailLoading(false);
    }
  };
  const sharesSold: number = Number(data?.soldShares ?? data?.sharesSold ?? 0);
  const availableShares: number = Number(data?.availableShares ?? 0);
  const totalShares: number = Number(data?.availableShares + data?.soldShares);
  const progress = totalShares > 0 ? (sharesSold / totalShares) * 100 : 0;
  const pricePerShare: number = Number(data?.pricePerShare ?? 0);
  const totalCost = Math.max(1, quantity) * (pricePerShare || 0);
  const currency = String((data?.currency || "ETH").toUpperCase());

  useEffect(() => {
    const id = String(params?.id || "");
    if (!id) return;

    let isMounted = true;

    (async () => {
      try {
        setLoading(true);

        // Fetch NFT data
        const nftResp = await NFTService.getNFTInvestmentById(id);
        if (isMounted) {
          if (nftResp?.success && nftResp.data) {
            setData((nftResp.data as any).nft);
          } else {
            setData(null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching NFT data:", error);
        if (isMounted) {
          setData(null);
          setLoading(false);
        }
      }
    })();

    // Fetch transaction history separately
    fetchTransactionHistory();

    // Fetch share detail
    fetchShareDetail();

    return () => {
      isMounted = false;
    };
  }, [params?.id, user]);

  useEffect(() => {
    fetchTransactionHistory();
    fetchShareDetail();
  }, [params?.id, user]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Loading Spinner - Initial Data Load */}
        {loading && <LoadingSpinner />}

        {/* <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button> */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">
              {data?.name || "NFT Investment"}
            </h1>
          </div>
          <div className="mb-2">
            <p> Mô tả : </p>
            <CollapsibleDescription
              html={String(data?.description || "").replace(/\n/g, "<br/>")}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Image and stats */}
          <div className="lg:col-span-7 space-y-4 flex flex-col">
            <Card className="border-0 shadow-none bg-transparent flex-1">
              <div className="relative w-full h-full min-h-[calc(100vh-8rem)] mx-auto rounded-lg overflow-hidden">
                <img
                  src={imageSrc}
                  alt={data?.name || "NFT"}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src = "/nft-box.jpg")
                  }
                />
                <button
                  className="absolute top-4 right-4 w-9 h-9 rounded-full backdrop-blur flex items-center justify-center mr-2"
                  aria-label="like"
                >
                  {data?.level && (
                    <Badge variant="secondary">
                      {getLevelBadge(data.level)}
                    </Badge>
                  )}
                </button>
              </div>
            </Card>
            <div>
              <Card className="glass">
                <CardContent className="p-6">
                  <Tabs defaultValue="documents" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 bg-background/30 rounded-xl p-1">
                      <TabsTrigger
                        value="documents"
                        className="text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-white"
                      >
                        Tài liệu và tập tin
                      </TabsTrigger>
                      <TabsTrigger
                        value="details"
                        className="text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-white"
                      >
                        Chi tiết NFT
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="documents" className="space-y-6">
                      <h2 className="text-2xl font-bold">
                        Tài liệu và tập tin
                      </h2>
                      {Array.isArray(data?.documents) &&
                      data.documents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {data.documents.map((doc: any, idx: number) => {
                            const docName =
                              doc?.name ||
                              doc?.filename ||
                              `Tài liệu ${idx + 1}`;
                            const docUrl = doc?.url || doc?.link || "";
                            const docType =
                              doc?.type || doc?.mimeType || "file";
                            const fileSize = doc?.filesize || doc?.size || 0;

                            const formatFileSize = (bytes: number) => {
                              if (!bytes) return "0 B";
                              const k = 1024;
                              const sizes = ["B", "KB", "MB", "GB"];
                              const i = Math.floor(
                                Math.log(bytes) / Math.log(k)
                              );
                              return `${
                                Math.round((bytes / Math.pow(k, i)) * 100) / 100
                              } ${sizes[i]}`;
                            };

                            const getFileIcon = (type: string) => {
                              const t = (type || "").toLowerCase();
                              if (t.includes("pdf")) return "📄";
                              if (t.includes("image")) return "🖼️";
                              if (t.includes("video")) return "🎥";
                              if (t.includes("audio")) return "🎵";
                              if (t.includes("zip") || t.includes("rar"))
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
                                    <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                                      {docName}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {formatFileSize(fileSize)}
                                    </p>
                                    {docType && (
                                      <div className="mt-2 inline-flex text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                                        {(
                                          docType.split("/")[1] || docType
                                        ).toUpperCase()}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground py-12">
                          <p>Không có tài liệu</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="details" className="space-y-4">
                      <h2 className="text-2xl font-bold">Chi tiết NFT</h2>
                      {data?.fullDescription ? (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Mô tả chi tiết:
                          </p>
                          <CollapsibleDescription
                            html={String(data.fullDescription || "").replace(
                              /\n/g,
                              "<br/>"
                            )}
                          />
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          Không có mô tả chi tiết
                        </p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right: Detail card */}
          <div className="lg:col-span-5 space-y-6 flex flex-col mt-6">
            <Card className="glass">
              <CardContent className="p-5  space-y-5">
                {/* <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Người bán
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {formatAddress(data?.walletAddress)}
                    </div>
                  </div>
                </div> */}

                {/* Pricing section */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground mb-1">
                      Tổng số cổ phần
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                      {formatAmount(data?.totalShares)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Cổ phần mở bán
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {formatAmount(data?.availableShares + data?.soldShares)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1 mr-1">
                      Đơn giá
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                      {formatAmount(data?.pricePerShare)}{" "}
                      {data?.currency?.toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Tiến trình bán
                    </span>
                    {totalShares > 0 && (
                      <span className="text-muted-foreground">
                        <span className="text-purple-400 font-semibold">
                          {progress}%
                        </span>
                      </span>
                    )}
                  </div>
                  <Progress value={progress} className="h-2.5" />
                  <div className="mt-2 text-xs text-cyan-400 font-semibold">
                    <span className="font-semibold text-cyan-400">
                      {sharesSold} CP / {totalShares} CP
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="text-xs text-muted-foreground">
                    Số cổ phần muốn mua
                  </div>
                  <Input
                    type="number"
                    min={0}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value || 0))}
                    className={`bg-background/50 border-cyan-500/30 focus:border-cyan-500/60 ${
                      quantity > totalShares
                        ? "border-red-500 focus:border-red-400"
                        : ""
                    }`}
                  />
                  {quantity > totalShares && (
                    <div className="text-xs text-red-400">
                      Cổ phần bạn muốn đầu tư hiện tại đã vượt qua cổ phần được
                      mở bán
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Tổng: {formatAmount(totalCost)} {currency}
                  </div>
                </div>

                <Button
                  onClick={() => {
                    if (!user) {
                      toast.error(
                        "Bạn vui lòng đăng nhập để tiếp tục mua cổ phần"
                      );
                      return;
                    }
                    const isConnected =
                      LocalStorageService.isConnectedToWallet();
                    if (!isConnected) {
                      setShowConnectModal(true);
                      return;
                    }
                    setShowConfirmation(true);
                  }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold gap-2 h-12 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  Mua cổ phần
                </Button>
              </CardContent>
            </Card>

            {/* Connect Wallet Modal */}
            <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Kết nối ví</DialogTitle>
                </DialogHeader>
                <div className="text-sm text-muted-foreground">
                  Vui lòng kết nối ví để thực hiện mua cổ phần.
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
                        setShowConfirmation(true);
                      } catch (_e) {
                        // user rejected or failed; just close modal silently
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

            <Card className="glass">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-4 text-white">
                  Thông tin chi tiết
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                    <div className="text-xs text-muted-foreground mb-1">
                      Loại NFT
                    </div>
                    <div className="text-sm font-semibold text-white capitalize">
                      {data?.type || "—"}
                    </div>
                  </div>
                  <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                    <div className="text-xs text-muted-foreground mb-1">
                      Độ hiếm
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {getLevelBadge(data?.level as string)}
                    </div>
                  </div>
                  {data?.isFractional && (
                    <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                      <div className="text-xs text-muted-foreground mb-1">
                        Tổng cổ phần
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {formatAmount(data?.totalShares)} phần
                      </div>
                    </div>
                  )}
                  {data?.isFractional && (
                    <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                      <div className="text-xs text-muted-foreground mb-1">
                        Cổ phần mua tối thiểu
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {formatAmount(data?.minSharesPerPurchase)} phần
                      </div>
                    </div>
                  )}
                  <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                    <div className="text-xs text-muted-foreground mb-1">
                      Đã bán
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {formatAmount(data?.soldShares)} phần
                    </div>
                  </div>
                  <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                    <div className="text-xs text-muted-foreground mb-1">
                      Còn lại
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {formatAmount(data?.availableShares)} phần
                    </div>
                  </div>

                  <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                    <div className="text-xs text-muted-foreground mb-1">
                      Trạng thái
                    </div>
                    <div className="text-sm font-semibold">
                      {data?.isActive ? (
                        <span className="text-emerald-400">✓ Hoạt động</span>
                      ) : (
                        <span className="text-red-400">✗ Tạm dừng</span>
                      )}
                    </div>
                  </div>
                  <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                    <div className="text-xs text-muted-foreground mb-1">
                      Số nhà đầu tư
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {formatAmount(data?.totalInvestors)} người
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-4 text-white">
                  Danh sách người mua cổ phần{" "}
                  <span className="text-cyan-400">
                    ({shareDetail?.length || 0})
                  </span>
                </h3>
                {shareDetailLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Spinner className="w-6 h-6 mx-auto mb-2" />
                    <p>Đang tải lịch sử mua cổ phần...</p>
                  </div>
                ) : !user ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Vui lòng đăng nhập để xem lịch sử mua cổ phần</p>
                  </div>
                ) : shareDetail ? (
                  <div className="space-y-4">
                    {/* Tổng số cổ phần đã mua */}
                    {shareDetail.shares !== undefined && (
                      <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-4">
                        <div className="text-xs text-muted-foreground mb-1">
                          Danh sách người mua cổ phần
                        </div>
                        <div className="text-2xl font-bold text-cyan-400">
                          {formatAmount(shareDetail.shares)} CP
                        </div>
                      </div>
                    )}

                    {shareDetail &&
                      Array.isArray(shareDetail) &&
                      shareDetail.length > 0 && (
                        <div className="mt-4">
                          <div
                            className="space-y-2 overflow-y-auto pr-2"
                            style={{
                              maxHeight: showAllShareDetail ? "600px" : "400px",
                              minHeight: "200px",
                            }}
                          >
                            {(showAllShareDetail
                              ? shareDetail
                              : shareDetail.slice(0, 10)
                            ).map((purchase: any, idx: number) => (
                              <div
                                key={idx}
                                className="rounded-md border border-border/50 bg-background/30 p-3 hover:bg-background/50 transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="text-xs text-muted-foreground mt-1">
                                      Người mua:{" "}
                                      {purchase.buyer?.walletAddress
                                        ? `${purchase.buyer.walletAddress.slice(
                                            0,
                                            4
                                          )}...${purchase.buyer.walletAddress.slice(
                                            -4
                                          )}`
                                        : "—"}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-semibold text-cyan-400">
                                      {formatAmount(purchase.totalShares || 0)}{" "}
                                      CP
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {shareDetail.length > 10 && (
                            <div className="mt-4 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setShowAllShareDetail(!showAllShareDetail)
                                }
                                className="text-primary hover:text-primary/80"
                              >
                                {showAllShareDetail ? "Thu gọn" : `Xem thêm `}
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Không có dữ liệu lịch sử mua cổ phần</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mt-12">
          <Card className="glass">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Lịch sử giao dịch</h2>
              {transactionsLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Đang tải lịch sử giao dịch...</p>
                </div>
              ) : Array.isArray(transactions) && transactions?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                          Người mua
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                          Số cổ phần
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                          Tổng tiền
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                          Thời gian
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                          Trạng thái
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                          Hash giao dịch
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx: any, idx: number) => {
                        // Handle buyer address/username

                        const displayBuyer = formatAddress(tx?.walletAddress);

                        // Handle shares
                        const shares = tx.shares || tx.quantity || 0;

                        // Handle total price
                        const totalPrice =
                          tx.totalPrice ||
                          tx.total_price ||
                          tx.price ||
                          tx.amount ||
                          0;
                        const txCurrency = (
                          tx.currency ||
                          currency ||
                          TOKEN_DEAULT_CURRENCY
                        ).toUpperCase();

                        // Handle timestamp
                        const timestamp =
                          tx.createdAt || tx.created_at || tx.date || "-";
                        let formattedDate = "-";
                        if (timestamp !== "-") {
                          try {
                            formattedDate = new Date(timestamp).toLocaleString(
                              "vi-VN"
                            );
                          } catch {
                            formattedDate = timestamp;
                          }
                        }

                        // Handle transaction hash
                        const txHash =
                          tx.transactionHash ||
                          tx.transaction_hash ||
                          tx.txHash ||
                          "-";

                        // Handle status
                        const status = tx.status || "success";
                        const statusColor =
                          status === "success" || status === "completed"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400";
                        const statusLabel =
                          status === "success"
                            ? "Thành công"
                            : status === "pending"
                            ? "Đang xử lý"
                            : "Thất bại";

                        return (
                          <tr
                            key={idx}
                            className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                          >
                            <td className="py-3 px-4 font-medium text-white">
                              {displayBuyer}
                            </td>
                            <td className="py-3 px-4 text-cyan-400 font-semibold">
                              {formatAmount(shares)} CP
                            </td>
                            <td className="py-3 px-4 font-semibold">
                              {formatAmount(totalPrice)} {txCurrency}
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {formattedDate}
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={`text-xs ${statusColor}`}>
                                {statusLabel}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-xs font-mono">
                              {txHash !== "-" ? (
                                <a
                                  href={`https://www.oklink.com/amoy/tx/${txHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-cyan-400 hover:text-cyan-300 hover:underline break-all"
                                >
                                  {formatAddress(txHash)}
                                </a>
                              ) : (
                                "-"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Chưa có lịch sử giao dịch</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Confirmation Modal */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent
            className="glass border-cyan-500/20"
            showCloseButton={false}
          >
            <DialogHeader>
              <DialogTitle className="text-white text-xl">
                Xác nhận mua cổ phần
              </DialogTitle>
            </DialogHeader>
            <div className="text-muted-foreground py-4">
              <p>
                Bạn có chắc chắn muốn mua{" "}
                <span className="font-semibold text-cyan-400">{quantity}</span>{" "}
                cổ phần của NFT &quot;
                <span className="font-semibold text-white">{data?.name}</span>
                &quot; với tổng giá{" "}
                <span className="font-semibold text-purple-400">
                  {formatAmount(totalCost)} {currency}
                </span>
                ?
              </p>
            </div>
            <DialogFooter className="gap-3 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="flex-1 bg-background/50 hover:bg-red-500/20 border-red-500/30 text-red-400 hover:text-red-300"
              >
                Thoát
              </Button>
              <Button
                disabled={buyLoading}
                onClick={() => {
                  // Xử lý mua cổ phần ở đây
                  setShowConfirmation(false);
                  handleBuyNFT();
                }}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed gap-2 flex items-center justify-center"
              >
                {buyLoading && (
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {buyLoading ? "Đang xử lý..." : "Đồng ý"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Loading Spinner Overlay */}
        {buyLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="glass border border-cyan-500/20 rounded-lg p-8 flex flex-col items-center gap-4 max-w-sm">
              {/* Spinner */}
              <svg
                className="animate-spin h-12 w-12 text-cyan-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>

              {/* Text */}
              <div className="text-center space-y-2">
                <h3 className="text-white font-semibold text-lg">
                  Giao dịch đang thực hiện
                </h3>
                <p className="text-muted-foreground text-sm">
                  Vui lòng không đóng trình duyệt hoặc thoát khỏi trang
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1 bg-background/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function CollapsibleDescription({ html }: { html: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const collapsedText = useMemo(() => {
    if (!html) return "";
    return html
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/p>/gi, " ")
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }, [html]);

  if (isExpanded) {
    return (
      <div className="space-y-2">
        <div
          className="text-muted-foreground leading-relaxed space-y-3"
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
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground leading-relaxed flex-1 truncate">
        {collapsedText}
      </span>
      <button
        type="button"
        className="text-primary text-sm font-medium hover:underline cursor-pointer flex-shrink-0"
        onClick={() => setIsExpanded(true)}
      >
        Xem thêm
      </button>
    </div>
  );
}
