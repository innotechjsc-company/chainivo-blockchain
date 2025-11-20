"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Heart, ArrowLeft, FileDown, Copy, MapPin } from "lucide-react";
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
  const [shareDetail, setShareDetail] = useState<any[]>([]);
  const [shareDetailLoading, setShareDetailLoading] = useState<boolean>(false);
  const [showAllShareDetail, setShowAllShareDetail] = useState<boolean>(false);
  const [certificateModalOpen, setCertificateModalOpen] =
    useState<boolean>(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [certificateScale, setCertificateScale] = useState(1);
  const infoCardRef = useRef<HTMLDivElement>(null);
  const shareListCardRef = useRef<HTMLDivElement>(null);
  const [totalCardsHeight, setTotalCardsHeight] = useState<number>(0);
  const [ownership, setOwnership] = useState<any>(null);
  const DETAIL_PANEL_MAX_HEIGHT = 645;
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [showLocationConfirmDialog, setShowLocationConfirmDialog] =
    useState<boolean>(false);
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false);
  const [mapSelectMode, setMapSelectMode] = useState<boolean>(false);
  const [selectingLocation, setSelectingLocation] = useState<boolean>(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

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

  const handleCopyValue = async (value?: string, label?: string) => {
    if (!value) {
      toast.error("Không có dữ liệu để sao chép");
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label || "Giá trị"} đã được sao chép`);
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Không thể sao chép nội dung");
    }
  };

  const imageSrc = useMemo(() => {
    return (
      getImageUrl(data?.image || data?.imageUrl || data?.image_url) ||
      (data?.type === "tier" ? "/tier-gold.jpg" : "/nft-box.jpg")
    );
  }, [data]);

  const fullDescriptionHtml = useMemo(() => {
    const fullDesc = data?.fullDescription ?? data?.description ?? "";

    if (typeof fullDesc === "string") {
      return fullDesc.replace(/\n/g, "<br/>");
    }

    if (typeof fullDesc === "object" && fullDesc !== null) {
      if (typeof fullDesc.html === "string") {
        return fullDesc.html.replace(/\n/g, "<br/>");
      }

      if (typeof fullDesc.content === "string") {
        return fullDesc.content.replace(/\n/g, "<br/>");
      }

      if (typeof fullDesc.text === "string") {
        return fullDesc.text.replace(/\n/g, "<br/>");
      }

      if (typeof fullDesc.json === "string") {
        try {
          const parsed = JSON.parse(fullDesc.json);
          if (typeof parsed === "string") {
            return parsed.replace(/\n/g, "<br/>");
          }
        } catch {
          // ignore parse error
        }
      }
    }

    return "";
  }, [data?.fullDescription, data?.description]);

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
        setShareDetail([]);
      }
    } catch (error) {
      console.error("Error fetching share detail:", error);
      setShareDetail([]);
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
  const userWalletLowerCase = user?.walletAddress?.toLowerCase() ?? null;

  const userTransactions = useMemo(() => {
    if (!userWalletLowerCase || !Array.isArray(transactions)) {
      return [];
    }

    return transactions.filter(
      (tx) =>
        String(tx?.walletAddress || "")
          .toLowerCase()
          .trim() === userWalletLowerCase
    );
  }, [transactions, userWalletLowerCase]);

  const currentDateTime = useMemo(() => {
    if (userTransactions.length) {
      const parseDate = (tx: any) => {
        const raw =
          tx?.createdAt ||
          tx?.created_at ||
          tx?.date ||
          tx?.updatedAt ||
          tx?.timestamp;
        const parsed = raw ? new Date(raw) : null;
        return parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
      };

      const latestTx = userTransactions.reduce(
        (latest: Date | null, tx: any) => {
          const txDate = parseDate(tx);
          if (!txDate) return latest;
          if (!latest || txDate > latest) return txDate;
          return latest;
        },
        null
      );

      if (latestTx) {
        try {
          return new Intl.DateTimeFormat("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }).format(latestTx);
        } catch {
          return latestTx.toLocaleString("vi-VN");
        }
      }
    }

    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());
  }, [userTransactions]);

  const averageUserInvestment = useMemo(() => {
    if (!userTransactions.length) return 0;

    const totalValue = userTransactions.reduce((sum: number, tx: any) => {
      const nftItem = tx?.nft;
      const shares = Number(nftItem?.soldShares ?? 0);
      const sharePrice = Number(nftItem?.pricePerShare ?? 0);

      return sum + shares * sharePrice;
    }, 0);

    return totalValue / userTransactions.length;
  }, [userTransactions]);

  const handleOpenCertificateModal = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để xem chứng chỉ NFT");
      return;
    }
    if (ownership?.shares === 0) {
      toast.error("Bạn chưa có chứng chỉ NFT nào");
      return;
    }
    setCertificateModalOpen(true);
  };

  // Handle click on map to select location
  const handleMapClick = async (e?: React.MouseEvent<HTMLDivElement>) => {
    // Nếu không có data.address, không cho phép chọn vị trí
    if (!data?.address) {
      return;
    }

    // Nếu không có event (click từ button), mở location picker dialog
    if (!e) {
      setShowLocationConfirmDialog(true);
      return;
    }

    // Nếu không ở chế độ chọn, mở location picker dialog
    if (!mapSelectMode) {
      setShowLocationConfirmDialog(true);
      return;
    }

    const mapContainer = mapContainerRef.current;
    if (!mapContainer) return;

    setSelectingLocation(true);

    // Lấy bounds của bản đồ dựa trên selectedLocation hoặc bounds mặc định Việt Nam
    let minLat = 20.9;
    let maxLat = 21.1;
    let minLng = 105.8;
    let maxLng = 105.9;

    // Nếu có selectedLocation, sử dụng bounds xung quanh nó
    if (selectedLocation) {
      const bbox = 0.02; // Bbox size
      minLat = selectedLocation.lat - bbox;
      maxLat = selectedLocation.lat + bbox;
      minLng = selectedLocation.lng - bbox;
      maxLng = selectedLocation.lng + bbox;
    }

    // Tính toán tọa độ từ vị trí click
    const rect = mapContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    // Chuyển đổi pixel coordinates sang lat/lng
    // Lat: từ trên xuống dưới (maxLat -> minLat)
    // Lng: từ trái sang phải (minLng -> maxLng)
    const lat = maxLat - (y / height) * (maxLat - minLat);
    const lng = minLng + (x / width) * (maxLng - minLng);

    // Reverse geocoding để lấy địa chỉ
    let addressText = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data.display_name) {
        addressText = data.display_name;
      }
    } catch (error) {
      console.error("Error getting address from coordinates:", error);
    }

    const location = {
      lat,
      lng,
      address: addressText,
    };

    setSelectedLocation(location);
    setMapSelectMode(false);
    setSelectingLocation(false);
    toast.success("Đã chọn vị trí trên bản đồ");
  };

  const handleConfirmLocationAccess = () => {
    setShowLocationConfirmDialog(false);
    setShowLocationPicker(true);
  };

  const handleLocationSelected = (location: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setSelectedLocation(location);
    setShowLocationPicker(false);
    toast.success("Vị trí đã được chọn thành công");
  };

  // Helper function để parse address từ JSON string
  const parseAddressFromData = (
    address: string | undefined | null
  ): {
    lat: number;
    lng: number;
    address: string;
  } | null => {
    if (!address) return null;

    try {
      // Thử parse JSON nếu address là JSON string
      const parsed = JSON.parse(address);
      if (parsed && typeof parsed === "object") {
        // Kiểm tra có lat và long (hoặc lng)
        const lat = parsed.lat || parsed.latitude;
        const lng = parsed.long || parsed.lng || parsed.longitude;
        const addressText = parsed.address || address;

        if (lat && lng) {
          return {
            lat: typeof lat === "number" ? lat : parseFloat(lat),
            lng: typeof lng === "number" ? lng : parseFloat(lng),
            address: addressText,
          };
        }
      }
    } catch (e) {
      // Nếu không phải JSON, trả về null
    }

    return null;
  };

  const getMapUrl = () => {
    if (selectedLocation) {
      return `https://www.openstreetmap.org/export/embed.html?bbox=${
        selectedLocation.lng - 0.01
      },${selectedLocation.lat - 0.01},${selectedLocation.lng + 0.01},${
        selectedLocation.lat + 0.01
      }&layer=mapnik&marker=${selectedLocation.lat},${selectedLocation.lng}`;
    }
    return `https://www.openstreetmap.org/export/embed.html?bbox=105.8,20.9,105.9,21.1&layer=mapnik&marker=21.0285,105.8542`;
  };

  const handleOpenGoogleMaps = () => {
    let location = selectedLocation;

    if (!location && data?.address) {
      const parsed = parseAddressFromData(data.address);
      if (parsed) {
        location = parsed;
      }
    }

    if (!location) {
      toast.error("Khong tim thay vi tri de mo ban do");
      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadCertificatePdf = async () => {
    if (!certificateRef.current) {
      toast.error("Không tìm thấy nội dung chứng chỉ để tải PDF");
      return;
    }
    const printWindow = window.open("", "", "width=900,height=1200");
    if (!printWindow) {
      toast.error("Trình duyệt đang chặn cửa sổ tải PDF");
      return;
    }
    const styles = Array.from(
      document.querySelectorAll("style, link[rel='stylesheet']")
    )
      .map((node) => node.outerHTML)
      .join("");
    const certificateHtml = certificateRef.current.outerHTML;
    printWindow.document.write(`
      <html>
        <head>
          <title>Chainivo NFT Certificate</title>
          ${styles}
          <style>
            :root {
              color-scheme: light;
            }
            body { margin: 0; padding: 24px; background: #fdfaf3; font-family: 'Inter', 'Times New Roman', serif; }
            @page { size: A4; margin: 16mm; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
            .certificate-wrapper { max-width: 940px; margin: 0 auto; }
          </style>
        </head>
        <body>
          ${certificateHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    const waitForResources = () => {
      const links = Array.from(
        printWindow.document.querySelectorAll("link[rel='stylesheet']")
      );
      if (!links.length) return Promise.resolve<void[]>([]);
      return Promise.all(
        links.map(
          (link) =>
            new Promise<void>((resolve) => {
              const stylesheet = link as HTMLLinkElement;
              if (stylesheet.sheet) {
                resolve();
              } else {
                stylesheet.addEventListener("load", () => resolve(), {
                  once: true,
                });
                stylesheet.addEventListener("error", () => resolve(), {
                  once: true,
                });
              }
            })
        )
      );
    };
    try {
      await waitForResources();
      if (printWindow.document.fonts && printWindow.document.fonts.ready) {
        await printWindow.document.fonts.ready;
      }
    } catch (error) {
      console.warn("Không thể tải đầy đủ stylesheet trong cửa sổ in", error);
    }
    requestAnimationFrame(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    });
  };

  const renderCertificate = (options?: { attachRef?: boolean }) => (
    <div
      ref={options?.attachRef ? certificateRef : undefined}
      className="certificate-wrapper"
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-amber-50/90 to-amber-100/50 border-0 shadow-2xl">
        <CardContent className="p-8 md:p-12 relative">
          <div className="absolute inset-4 border-2 border-yellow-500/60 rounded-sm pointer-events-none"></div>
          <div className="absolute inset-6 border border-yellow-400/40 rounded-sm pointer-events-none"></div>

          <div className="absolute top-6 left-6 text-yellow-600/40 text-2xl">
            ❋
          </div>
          <div className="absolute top-6 right-6 text-yellow-600/40 text-2xl">
            ❋
          </div>
          <div className="absolute bottom-6 left-6 text-yellow-600/40 text-2xl">
            ❋
          </div>
          <div className="absolute bottom-6 right-6 text-yellow-600/40 text-2xl">
            ❋
          </div>

          <div className="flex gap-1 items-center justify-center mb-6 space-y-2">
            <div className="w-20 h-20 flex items-center justify-center mt-2 ">
              <img
                src="/logo hinh.png"
                alt="Chainivo logo"
                className="w-12 h-12 object-contain select-none"
                draggable={false}
              />
            </div>
            <div className="flex flex-col items-center justify-center flex-col">
              <div className="text-center uppercase tracking-[0.4em] text-amber-900 font-black text-sm">
                chainivo
              </div>
              <div className="text-center uppercase tracking-[0.6em] text-amber-700 text-[10px] font-semibold">
                blockchain
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-sm md:text-base text-amber-900/70 font-semibold tracking-wider uppercase">
              Xác nhận quyền sở hữu cổ phần NFT
            </p>
          </div>

          <div className="text-center mb-8 space-y-6">
            <div className="relative">
              <div className="absolute left-0 top-1/2 w-1/4 border-t-2 border-dashed border-amber-800/40"></div>
              <div className="absolute right-0 top-1/2 w-1/4 border-t-2 border-dashed border-amber-800/40"></div>
              <div className="text-base md:text-xl font-mono text-blue-700 font-semibold tracking-wide whitespace-nowrap overflow-x-auto no-scrollbar">
                {user?.walletAddress || "Người sở hữu"}
              </div>
            </div>

            <div className="text-xs md:text-sm text-gray-500/80 leading-relaxed max-w-2xl mx-auto space-y-2">
              <p>
                Đã được xác nhận là chủ sở hữu hợp pháp của cổ phần NFT với các
                thông tin chi tiết như sau:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-3xl mx-auto">
            <div className="bg-white/60 rounded-lg border border-amber-200/50 p-4 shadow-sm">
              <div className="text-xs text-amber-900/60 mb-1 font-semibold uppercase tracking-wide">
                ID NFT trên blockchain
              </div>
              <div className="text-sm font-bold text-amber-900 font-mono">
                Token ID: {data?.tokenId || "—"}
              </div>
            </div>

            <div className="bg-white/60 rounded-lg border border-amber-200/50 p-4 shadow-sm">
              <div className="text-xs text-amber-900/60 mb-1 font-semibold uppercase tracking-wide">
                Tên NFT
              </div>
              <div className="text-base font-bold text-amber-900">
                {data?.name || "—"}
              </div>
            </div>

            <div className="bg-white/60 rounded-lg border border-amber-200/50 p-4 shadow-sm">
              <div className="text-xs text-amber-900/60 mb-1 font-semibold uppercase tracking-wide">
                Tổng số cổ phần NFT
              </div>
              <div className="text-lg font-bold text-amber-900">
                {formatAmount(data?.totalShares)} cổ phần
              </div>
            </div>

            <div className="bg-white/60 rounded-lg border border-amber-200/50 p-4 shadow-sm">
              <div className="text-xs text-amber-900/60 mb-1 font-semibold uppercase tracking-wide">
                Tổng số cổ phần sở hữu
              </div>
              <div className="text-lg font-bold text-amber-900">
                {(() => {
                  return `${formatAmount(ownership?.shares || 0)} cổ phần`;
                })()}
              </div>
            </div>

            <div className="bg-white/60 rounded-lg border border-amber-200/50 p-4 shadow-sm md:col-span-2">
              <div className="text-xs text-amber-900/60 mb-1 font-semibold uppercase tracking-wide">
                Đơn giá trung bình
              </div>
              <div className="text-lg font-bold text-amber-900">
                {formatAmount(averageUserInvestment)}{" "}
                {data?.currency?.toUpperCase() || TOKEN_DEAULT_CURRENCY}
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <span className="text-sm md:text-base  text-amber-900/70 font-semibold leading-relaxed text-center flex items-center gap-2">
              HÀ NỘI, {currentDateTime} -
              <Link
                href={config.API_BASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-amber-900 cursor-pointer"
              >
                {config.API_BASE_URL.toUpperCase()}
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

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
            setOwnership((nftResp.data as any)?.userOwnership);
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

  // Parse và set selectedLocation từ data.address khi data được load
  useEffect(() => {
    if (data?.address) {
      const parsedLocation = parseAddressFromData(data.address);
      if (parsedLocation) {
        setSelectedLocation(parsedLocation);
      } else {
        // Nếu không parse được, reset selectedLocation
        setSelectedLocation(null);
      }
    } else {
      // Nếu không có address, reset selectedLocation
      setSelectedLocation(null);
    }
  }, [data?.address]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const updateTotalCardsHeight = () => {
      if (infoCardRef.current && shareListCardRef.current) {
        const infoHeight = infoCardRef.current.offsetHeight;
        const shareListHeight = shareListCardRef.current.offsetHeight;
        const totalHeight = infoHeight + shareListHeight;
        setTotalCardsHeight(totalHeight);
      }
    };

    // Delay to ensure DOM is rendered
    const timer = setTimeout(updateTotalCardsHeight, 100);
    window.addEventListener("resize", updateTotalCardsHeight);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateTotalCardsHeight);
    };
  }, [data, shareDetail, shareDetailLoading, showAllShareDetail]);

  useEffect(() => {
    if (!certificateModalOpen) {
      setCertificateScale(1);
      return;
    }
    const updateScale = () => {
      const el = certificateRef.current;
      if (!el) return;
      const contentHeight = el.offsetHeight;
      const viewport = window.innerHeight * 0.9 - 150;
      if (contentHeight > viewport && viewport > 0) {
        const scaleValue = Math.max(viewport / contentHeight, 0.5);
        setCertificateScale(scaleValue);
      } else {
        setCertificateScale(1);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [certificateModalOpen, data, shareDetail, averageUserInvestment]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Loading Spinner - Initial Data Load */}
        {loading && <LoadingSpinner />}
        <div className="mb-2">
          <h1 className="text-4xl font-bold mb-2">
            {data?.name || "Không rõ"}
          </h1>
          <div>
            <CollapsibleDescription
              html={String(data?.description || "").replace(/\n/g, "<br/>")}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 relative z-10">
          {/* Image section */}
          <div className="space-y-6 mb-12 lg:mb-0 lg:pb-8">
            <div className="relative rounded-2xl overflow-hidden glass flex items-center justify-center">
              <img
                src={imageSrc}
                alt={data?.name || "NFT"}
                className="object-cover w-[800px] relative overflow-hidden  flex items-center justify-center"
                style={{ height: `${DETAIL_PANEL_MAX_HEIGHT}px` }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/nft-box.jpg";
                }}
              />
              {data?.level && (
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary">{getLevelBadge(data.level)}</Badge>
                </div>
              )}
            </div>

            {/* Tabs section */}
            <Card className="glass">
              <CardContent className="p-4">
                <Tabs defaultValue="details" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2 bg-background/30 rounded-xl p-1">
                    <TabsTrigger
                      value="details"
                      className="text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-white"
                    >
                      Chi tiết NFT
                    </TabsTrigger>
                    <TabsTrigger
                      value="documents"
                      className="text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-white"
                    >
                      Tài liệu và tập tin
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="space-y-4 h-[500px]">
                    <h2 className="text-2xl font-bold">Chi tiết NFT</h2>
                    {data?.fullDescription ? (
                      <div className="space-y-2">
                        <CollapsibleDescription
                          html={fullDescriptionHtml}
                          maxHeight={totalCardsHeight}
                        />
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        Không có mô tả chi tiết
                      </p>
                    )}
                  </TabsContent>
                  <TabsContent value="documents" className="space-y-6">
                    <h2 className="text-2xl font-bold">Tài liệu và tập tin</h2>
                    {Array.isArray(data?.documents) &&
                    data.documents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.documents.map((doc: any, idx: number) => {
                          const docName =
                            doc?.name || doc?.filename || `Tài liệu ${idx + 1}`;
                          const docUrl = doc?.url || doc?.link || "";
                          const docType = doc?.type || doc?.mimeType || "file";
                          const fileSize = doc?.filesize || doc?.size || 0;

                          const formatFileSize = (bytes: number) => {
                            if (!bytes) return "0 B";
                            const k = 1024;
                            const sizes = ["B", "KB", "MB", "GB"];
                            const i = Math.floor(Math.log(bytes) / Math.log(k));
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
                </Tabs>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card ref={infoCardRef} className="glass">
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
                        {getNFTType(data?.type) || "—"}
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
                          {formatAmount(data?.totalShares)} cổ phần
                        </div>
                      </div>
                    )}
                    {data?.isFractional && (
                      <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                        <div className="text-xs text-muted-foreground mb-1">
                          Cổ phần mua tối thiểu
                        </div>
                        <div className="text-sm font-semibold text-white">
                          {formatAmount(data?.minSharesPerPurchase ?? 1)} cổ
                          phần
                        </div>
                      </div>
                    )}
                    <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                      <div className="text-xs text-muted-foreground mb-1">
                        Đã bán
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {formatAmount(data?.soldShares)} cổ phần
                      </div>
                    </div>
                    <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                      <div className="text-xs text-muted-foreground mb-1">
                        Còn lại
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {formatAmount(data?.availableShares)} cổ phần
                      </div>
                    </div>

                    <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                      <div className="text-xs text-muted-foreground mb-1">
                        Cho phép stake
                      </div>
                      <div className="text-sm font-semibold">
                        {(data as any)?.allowStakingOfShares ? (
                          <span className="text-emerald-400">✓ Có</span>
                        ) : (
                          <span className="text-red-400">✗ Không </span>
                        )}
                      </div>
                    </div>
                    <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                      <div className="text-xs text-muted-foreground mb-1">
                        Số nhà đầu tư
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {formatAmount(data?.totalInvestors)} nhà đầu tư
                      </div>
                    </div>
                    <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                      <div className="text-xs text-muted-foreground mb-1">
                        TokendID
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {data?.tokenId || "—"}
                      </div>
                    </div>
                    <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 p-3 hover:border-cyan-500/40 transition-colors">
                      <div className="text-xs text-muted-foreground mb-1 ">
                        <span className="font-semibol mr-2">SmartContract</span>
                        <span>
                          {config.WALLET_ADDRESSES.NFT_CONTRACT_ADDRESS && (
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyValue(
                                  config.WALLET_ADDRESSES.NFT_CONTRACT_ADDRESS,
                                  "SmartContract"
                                )
                              }
                              className=" rounded-md border border-cyan-500/30 hover:border-cyan-500/60 hover:bg-cyan-500/10 transition-colors cursor-pointer"
                              aria-label="Sao chép địa chỉ SmartContract"
                            >
                              <Copy className="w-4 h-4 text-cyan-300" />
                            </button>
                          )}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-white leading-snug flex items-center gap-2">
                        <span className="flex-1 break-words whitespace-normal overflow-hidden text-ellipsis">
                          {config.WALLET_ADDRESSES.NFT_CONTRACT_ADDRESS || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card ref={shareListCardRef} className="glass">
                <CardContent className="p-4">
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
                      {shareDetail &&
                        Array.isArray(shareDetail) &&
                        shareDetail.length > 0 && (
                          <div className="mt-4">
                            <div
                              className="space-y-2 overflow-y-auto pr-2"
                              style={{
                                maxHeight: showAllShareDetail
                                  ? "600px"
                                  : "400px",
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
                                        {formatAmount(
                                          purchase.totalShares || 0
                                        )}{" "}
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

          {/* Details section */}
          <div
            className="space-y-6 lg:pr-3 lg:sticky lg:top-24 lg:self-start"
            style={{
              maxHeight: `calc(100vh - 120px)`,
              overflowY: "auto",
            }}
          >
            {/* Price */}
            <div className="glass rounded-xl p-2">
              <div className="text-sm text-muted-foreground mb-1">
                Giá/cổ phần
              </div>
              <div className="text-3xl font-bold gradient-text">
                {formatAmount(data?.pricePerShare || 0)}{" "}
                {data?.currency?.toUpperCase() || TOKEN_DEAULT_CURRENCY}
              </div>
              <div className="pt-3">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Tiến trình bán</span>
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
                    {sharesSold} CP /{" "}
                    {Number(totalShares).toLocaleString("us-EN")} CP
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-3">
                <div className="text-xs text-muted-foreground">
                  Số cổ phần muốn mua
                </div>
                <Input
                  type="number"
                  min={0}
                  value={quantity}
                  disabled={data?.availableShares === 0}
                  onChange={(e) => setQuantity(Number(e.target.value || 0))}
                  className={`bg-background/50 border-cyan-500/30 focus:border-cyan-500/60 ${
                    quantity > totalShares
                      ? "border-red-500 focus:border-red-400"
                      : ""
                  }`}
                />
                {Number(quantity) >
                  Number(totalShares - data?.soldShares || 0) && (
                  <div className="text-xs text-red-400">
                    Cổ phần bạn muốn đầu tư hiện tại đã vượt qua cổ phần được mở
                    bán
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  Tổng: {formatAmount(totalCost)} {currency}
                </div>
              </div>

              {Number(data?.availableShares || 0) > 0 ? (
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
                  disabled={
                    Number(quantity) >
                    Number(totalShares - data?.soldShares || 0)
                  }
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold gap-2 h-12 cursor-pointer mt-4"
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
              ) : (
                <Button
                  disabled
                  className="w-full bg-gray-500/40 text-gray-300 font-semibold gap-2 h-12 cursor-not-allowed mt-4"
                >
                  Đã hết cổ phần bán
                </Button>
              )}
            </div>

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
            {Number(ownership?.shares || 0) > 0 ? (
              <Card
                className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-cyan-500/30 via-purple-500/30 to-indigo-600/30 cursor-pointer transition-transform hover:scale-[1.01] shadow-lg shadow-purple-900/20"
                role="button"
                tabIndex={0}
                onClick={handleOpenCertificateModal}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleOpenCertificateModal();
                  }
                }}
              >
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent)] pointer-events-none" />
                <CardContent className="relative p-4 space-y-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">
                        Chứng nhận cổ phần của tôi
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-white/80 ">
                      Xem chi tiết
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-white/10 p-3 border border-white/20 backdrop-blur-sm">
                      <p className="text-[10px] uppercase tracking-wide text-white/70 mb-1">
                        ID NFT trên blockchain
                      </p>
                      <p className="text-sm font-semibold font-mono">
                        {data?.tokenId || "—"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/10 p-3 border border-white/20 backdrop-blur-sm">
                      <p className="text-[10px] uppercase tracking-wide text-white/70 mb-1">
                        Tổng số cổ phần sở hữu
                      </p>
                      <p className="text-sm font-semibold">
                        {(() => {
                          return `${formatAmount(
                            ownership?.shares || 0
                          )} cổ phần`;
                        })()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card
                className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-cyan-500/30 via-purple-500/30 to-indigo-600/30 cursor-pointer transition-transform hover:scale-[1.01] shadow-lg shadow-purple-900/20"
                role="banner"
                tabIndex={0}
              >
                <CardContent className="relative p-4 space-y-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">
                        Chứng nhận cổ phần của tôi
                      </h3>
                    </div>
                  </div>
                  <div className="rounded-lg">
                    <p className="text-[10px] uppercase tracking-wide text-white/70 mb-1">
                      Sau khi mua cổ phần, bạn sẽ nhận được chứng chỉ NFT
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bản đồ */}
            <Card className="glass">
              <CardContent>
                <div>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleOpenGoogleMaps}
                      className="text-xs text-cyan-400 hover:text-cyan-300  cursor-pointer pb-1"
                    >
                      Xem chi tiết trên Google Maps
                    </button>
                  </div>
                  <div
                    ref={mapContainerRef}
                    className={`relative w-full rounded-lg overflow-hidden border border-cyan-500/20 transition-colors ${
                      data?.address
                        ? "cursor-pointer hover:border-cyan-500/40"
                        : "cursor-default"
                    }`}
                    style={{ height: "125px", minHeight: "125px" }}
                    onClick={data?.address ? handleMapClick : undefined}
                  >
                    <iframe
                      width="100%"
                      height="100%"
                      style={{
                        border: 0,
                        display: "block",
                        pointerEvents:
                          data?.address && mapSelectMode ? "none" : "auto",
                      }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={getMapUrl()}
                    />

                    {/* Overlay cho chế độ chọn vị trí - chỉ hiển thị nếu có data.address */}
                    {data?.address && mapSelectMode && (
                      <div className="absolute inset-0 bg-transparent cursor-crosshair z-20">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="bg-cyan-500/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-cyan-500/50">
                            <p className="text-sm font-medium text-cyan-400 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Nhấn vào bản đồ để chọn vị trí
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Overlay click để mở dialog chọn vị trí - chỉ hiển thị nếu có data.address */}
                    {data?.address && !selectedLocation && !mapSelectMode && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors pointer-events-none z-10">
                        <div className="text-center text-white">
                          <MapPin className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                          <p className="text-sm font-medium">
                            Nhấn để chọn vị trí
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Loading overlay khi đang chọn vị trí */}
                    {selectingLocation && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-30">
                        <div className="bg-background rounded-lg px-4 py-2 flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-sm text-muted-foreground">
                            Đang lấy thông tin vị trí...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {selectedLocation && (
                    <div className="text-sm text-muted-foreground pt-2">
                      <p className="font-semibold text-white mb-1">Địa chỉ:</p>
                      <p>{selectedLocation.address}</p>
                      <p className="text-xs mt-1">
                        Tọa độ: {selectedLocation.lat.toFixed(6)},{" "}
                        {selectedLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12  clear-both">
          <Card className="glass">
            <CardContent className="p-4">
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
                          Stake
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

        {isClient &&
          certificateModalOpen &&
          createPortal(
            <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="relative w-full max-w-5xl bg-background/95 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="sticky top-0 z-10 flex flex-col gap-2 bg-background/95 px-6 pt-6 pb-2 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="mt-[20%]">
                      <h2 className="text-2xl font-bold text-white">
                        Chứng chỉ xác nhận NFT
                      </h2>
                    </div>
                    <div className="flex gap-2 mt-[20%]">
                      <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => setCertificateModalOpen(false)}
                      >
                        Đóng
                      </Button>
                      <Button
                        className="gap-2 cursor-pointer"
                        onClick={handleDownloadCertificatePdf}
                      >
                        <FileDown className="w-4 h-4" />
                        Tải PDF
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Toàn bộ thông tin chứng chỉ sở hữu NFT của bạn
                  </p>
                </div>
                <div className="p-6 pb-8">
                  <div
                    className="flex justify-center"
                    style={{
                      transform: `scale(${certificateScale})`,
                      transformOrigin: "top center",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    {renderCertificate({ attachRef: true })}
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}

        {/* Location Confirm Dialog */}
        <Dialog
          open={showLocationConfirmDialog}
          onOpenChange={setShowLocationConfirmDialog}
        >
          <DialogContent className="glass border-cyan-500/20">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">
                Xác nhận truy cập vị trí
              </DialogTitle>
            </DialogHeader>
            <div className="text-muted-foreground py-4">
              <p>
                Bạn có muốn chọn vị trí trên bản đồ không? Chúng tôi sẽ mở
                Google Maps để bạn có thể chọn vị trí.
              </p>
            </div>
            <DialogFooter className="gap-3 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setShowLocationConfirmDialog(false)}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                onClick={handleConfirmLocationAccess}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold"
              >
                Cho phép
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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

function LocationPickerForm({
  onLocationSelected,
  onCancel,
}: {
  onLocationSelected: (location: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
  onCancel: () => void;
}) {
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt của bạn không hỗ trợ định vị");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude.toString());
        setLng(longitude.toString());

        // Reverse geocoding để lấy địa chỉ
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data.display_name) {
            setAddress(data.display_name);
          }
        } catch (error) {
          console.error("Error getting address:", error);
        }

        setLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Không thể lấy vị trí hiện tại");
        setLoading(false);
      }
    );
  };

  const handleSubmit = () => {
    if (!lat || !lng) {
      toast.error("Vui lòng nhập tọa độ hoặc sử dụng vị trí hiện tại");
      return;
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      toast.error("Tọa độ không hợp lệ");
      return;
    }

    if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      toast.error("Tọa độ nằm ngoài phạm vi hợp lệ");
      return;
    }

    onLocationSelected({
      lat: latNum,
      lng: lngNum,
      address: address || `${latNum}, ${lngNum}`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">
          Hoặc sử dụng vị trí hiện tại
        </label>
        <Button
          type="button"
          variant="outline"
          onClick={handleGetCurrentLocation}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Đang lấy vị trí..." : "Lấy vị trí hiện tại"}
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">
          Địa chỉ (tùy chọn)
        </label>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Nhập địa chỉ"
          className="bg-background/50 border-cyan-500/60"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Vĩ độ (Lat)</label>
          <Input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="21.0285"
            className="bg-background/50 border-cyan-500/60"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">
            Kinh độ (Lng)
          </label>
          <Input
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="105.8542"
            className="bg-background/50 border-cyan-500/60"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
        >
          Xác nhận
        </Button>
      </div>
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
