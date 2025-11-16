"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  SendRequestService,
  FeeService,
  type DigitizationRequest,
  type GetSystemFeeResponse,
  BenefitsDigiService,
} from "@/api/services";
import { config } from "@/api/config";
import { RefreshCw, MapPin, Calendar, DollarSign, Plus } from "lucide-react";
import { DigitizationRequestModal } from "@/screens/digitizing-nft-screen/components";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TransferService from "@/services/TransferService";
import { useAppSelector } from "@/stores";
import { toast } from "sonner";

interface DigitizationRequestListProps {
  onRefresh?: () => void;
}

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    pending: {
      label: "Chờ xử lý",
      className: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
    },
    approved: {
      label: "Đã duyệt",
      className: "bg-green-500/20 text-green-600 border-green-500/30",
    },
    rejected: {
      label: "Từ chối",
      className: "bg-red-500/20 text-red-600 border-red-500/30",
    },
    processing: {
      label: "Đang xử lý",
      className: "bg-blue-500/20 text-blue-600 border-blue-500/30",
    },
    completed: {
      label: "Hoàn thành",
      className: "bg-purple-500/20 text-purple-600 border-purple-500/30",
    },
  };

  const statusInfo = statusMap[status.toLowerCase()] || {
    label: status,
    className: "bg-gray-500/20 text-gray-600 border-gray-500/30",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.className}`}
    >
      {statusInfo.label}
    </span>
  );
};

export function DigitizationRequestList({
  onRefresh,
}: DigitizationRequestListProps) {
  const [requests, setRequests] = useState<DigitizationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<DigitizationRequest | null>(null);
  const [feeLoading, setFeeLoading] = useState<boolean>(false);
  const [systemFees, setSystemFees] = useState<GetSystemFeeResponse | null>(
    null
  );
  const walletAddress = useAppSelector(
    (state) => state.wallet.wallet?.address || ""
  );
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(
    null
  );
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false);
  const [pendingRequestData, setPendingRequestData] = useState<{
    request: DigitizationRequest;
    totalFeePercent: number;
    paidAmount: number;
  } | null>(null);
  const [successData, setSuccessData] = useState<{
    transactionHash: string;
    tokenId?: string | number;
    nftId?: string;
  } | null>(null);
  const [globalLoading, setGlobalLoading] = useState<boolean>(false);

  const formatNumber = (value: number, options?: Intl.NumberFormatOptions) => {
    if (!Number.isFinite(value)) return "0";
    return value.toLocaleString("vi-VN", {
      maximumFractionDigits: 6,
      minimumFractionDigits: 0,
      ...options,
    });
  };

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching digitization requests...");
      const response = await SendRequestService.getMyRequests();
      console.log("API Response:", response);

      if (response.success && response.data) {
        // Handle different response formats
        let data: DigitizationRequest[] = [];

        data = (response.data as any).requests || [];

        setRequests(data);
      } else {
        const errorMessage =
          response.error ||
          response.message ||
          "Không thể tải danh sách yêu cầu";
        console.error("API Error:", errorMessage);
        setError(errorMessage);
        setRequests([]);
      }
    } catch (err: any) {
      console.error("Fetch requests error:", err);
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Đã xảy ra lỗi khi tải danh sách yêu cầu";
      setError(errorMessage);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRefresh = () => {
    fetchRequests();
    onRefresh?.();
  };

  const shouldShowConfirmButton = (status?: string) => {
    if (!status) return false;
    const normalizedStatus = status.toLowerCase();
    return normalizedStatus !== "completed" && normalizedStatus !== "rejected";
  };

  const handleCardClick = (request: DigitizationRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const handleConfirmClick = async (request: DigitizationRequest) => {
    try {
      setFeeLoading(true);
      setGlobalLoading(true);
      setProcessingRequestId(request.id);

      const feeResponse = await FeeService.getSystemFees();
      if (!feeResponse.success || !feeResponse.data) {
        console.error("Failed to fetch system fees:", feeResponse.error);
        toast.error("Không thể lấy thông tin phí hệ thống.");
        return;
      }

      setSystemFees(feeResponse.data);

      const { digitizationFee } = feeResponse.data as Record<string, any>;

      let totalFeePercent = 0;

      if (digitizationFee?.isActive && Number(digitizationFee.value) > 0) {
        totalFeePercent += Number(digitizationFee.value);
      }

      if (totalFeePercent <= 0) {
        toast.info("Không có phí cần thanh toán cho yêu cầu này.");
        return;
      }

      const basePrice = Number(request.price || 0);
      const paidAmount = (basePrice * totalFeePercent) / 100;
      const normalizedAmount = Number(paidAmount.toFixed(6));

      if (normalizedAmount <= 0) {
        toast.info("Giá trị phí không hợp lệ.");
        return;
      }

      setPendingRequestData({
        request,
        totalFeePercent,
        paidAmount: normalizedAmount,
      });
      setConfirmModalOpen(true);
    } catch (err) {
      console.error("Error while preparing confirmation:", err);
      toast.error("Có lỗi xảy ra khi xử lý yêu cầu.");
    } finally {
      setFeeLoading(false);
      setProcessingRequestId(null);
    }
  };

  const handleConfirmRequest = async () => {
    if (!pendingRequestData) return;

    const { request, paidAmount } = pendingRequestData;

    try {
      setFeeLoading(true);
      setProcessingRequestId(request.id);

      if (!walletAddress) {
        toast.error("Vui lòng kết nối ví của bạn trước khi xác nhận yêu cầu.");
        throw new Error("WALLET_NOT_CONNECTED");
      }

      setConfirmModalOpen(false);

      const transferResult = await TransferService.sendCanTransfer({
        fromAddress: walletAddress,
        amountCan: paidAmount,
      });

      if (!transferResult.transactionHash) {
        toast.error("Không thể thực hiện giao dịch phí số hóa.");
        return;
      }

      const confirmResponse =
        await BenefitsDigiService.confirmDigitizingRequest(
          request.id,
          transferResult.transactionHash
        );

      if (confirmResponse.success) {
        const responseData = confirmResponse?.data as any;
        const nftInfo = responseData?.nft || responseData;
        setSuccessData({
          transactionHash: transferResult.transactionHash,
          tokenId:
            nftInfo?.tokenId || nftInfo?.token_id || responseData?.tokenId,
          nftId: nftInfo?.id || nftInfo?._id || nftInfo?.nftId || request.id,
        });
        setSuccessModalOpen(true);
      } else {
        toast.error(
          confirmResponse.error ||
            confirmResponse.message ||
            "Không thể xác nhận yêu cầu số hóa."
        );
      }
    } catch (err) {
      console.error("Error while confirming request:", err);
      if (!(err instanceof Error && err.message === "WALLET_NOT_CONNECTED")) {
        toast.error("Có lỗi xảy ra khi thực hiện giao dịch phí.");
      }
    } finally {
      setFeeLoading(false);
      setGlobalLoading(false);
      setProcessingRequestId(null);
      setPendingRequestData(null);
    }
  };

  const handleConfirmModalOpenChange = (open: boolean) => {
    setConfirmModalOpen(open);
    if (!open) {
      setPendingRequestData(null);
      setFeeLoading(false);
      setProcessingRequestId(null);
      setGlobalLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModalOpen(false);
    if (successData) {
      fetchRequests();
      onRefresh?.();
    }
    setSuccessData(null);
    setGlobalLoading(false);
  };

  const nftTargetId = successData?.nftId || "";
  const explorerLink = successData
    ? `https://amoy.polygonscan.com/token/${
        config.BLOCKCHAIN.CAN_TOKEN_ADDRESS
      }?a=${successData.tokenId ?? successData.transactionHash}`
    : "#";
  const myNftLink = nftTargetId ? `/nft/${nftTargetId}` : "#";
  const investmentNftLink = nftTargetId
    ? `/investment-nft/${nftTargetId}`
    : "#";

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedRequest(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="w-8 h-8 mr-2" />
        <span className="text-muted-foreground">Đang tải yêu cầu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button variant="outline" onClick={handleRefresh}>
          Thử lại
        </Button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Bạn chưa có yêu cầu số hóa nào
          </p>
          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo yêu cầu
          </Button>
        </div>
        <DigitizationRequestModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSuccess={() => {
            fetchRequests();
            onRefresh?.();
          }}
        />
      </>
    );
  }

  return (
    <>
      {globalLoading && (
        <div className="fixed inset-0 z-[999] bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="w-8 h-8 text-primary" />
            <p className="text-sm text-muted-foreground">
              Đang xử lý giao dịch...
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Danh sách yêu cầu số hóa</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Làm mới
            </Button>
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo yêu cầu
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <Card
              key={request.id}
              className="glass overflow-hidden transition hover:shadow-lg p-0 cursor-pointer flex flex-col"
              onClick={() => handleCardClick(request)}
            >
              {/* Image */}
              <div className="relative h-48 w-full bg-muted">
                {request.image?.url ? (
                  <Image
                    src={
                      request.image.url.startsWith("http")
                        ? request.image.url
                        : `${process.env.NEXT_PUBLIC_API_BASE_URL}${request.image.url}`
                    }
                    alt={request.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const placeholder = target.parentElement?.querySelector(
                        ".image-placeholder"
                      ) as HTMLElement;
                      if (placeholder) {
                        placeholder.style.display = "flex";
                      }
                    }}
                  />
                ) : null}
                {/* Placeholder when no image or image fails */}
                <div
                  className={`image-placeholder flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 ${
                    request.image?.url ? "hidden" : ""
                  }`}
                >
                  <span className="text-4xl">📄</span>
                </div>
                {/* Status Badge */}
                <div className="absolute top-2 right-2 z-10">
                  {getStatusBadge(request.status)}
                </div>
              </div>

              {/* Content */}
              <div className="px-4 py-4 flex flex-col flex-1">
                <div className="flex-1 space-y-3">
                  {/* Title */}
                  <div className="flex items-center gap-3 min-h-[28px]">
                    <h4 className="font-semibold text-lg line-clamp-1 flex-1">
                      {request.name || "—"}
                    </h4>
                  </div>

                  {/* Description */}
                  <div className="min-h-[60px]">
                    <div className="text-xs text-muted-foreground mb-1">
                      Mô tả
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {request.description || "—"}
                    </p>
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-3 min-h-[56px]">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground">
                        Địa chỉ
                      </div>
                      <div className="text-sm line-clamp-1">
                        {request.address || "—"}
                      </div>
                    </div>
                  </div>

                  {/* Price and Percentage */}
                  <div className="flex items-center gap-3 min-h-[64px]">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground">
                          Giá tài sản
                        </div>
                        <div className="text-xl font-bold gradient-text">
                          {request.price
                            ? `${formatNumber(request.price ?? 0, {
                                maximumFractionDigits: 0,
                              })} VNĐ`
                            : "—"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground">
                          Cổ phần mở bán
                        </div>
                        <div className="text-xl font-bold">
                          {request.availablePercentage
                            ? `${request.availablePercentage}%`
                            : "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {request.status === "pendingConfirmation" && (
                    <div className="pt-2">
                      <Button
                        type="button"
                        className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-cyan-600 hover:to-purple-700 transition"
                        disabled={
                          feeLoading && processingRequestId === request.id
                        }
                        onClick={(event) => {
                          event.stopPropagation();
                          handleConfirmClick(request);
                        }}
                      >
                        {feeLoading && processingRequestId === request.id ? (
                          <span className="flex items-center justify-center gap-2">
                            <Spinner className="w-4 h-4" />
                            Đang lấy phí...
                          </span>
                        ) : (
                          "Xác nhận "
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Created Date - Fixed at bottom */}
                <div className="flex items-center gap-3  pt-3 mt-auto min-h-[56px]">
                  <div className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">
                      Ngày tạo
                    </div>
                    <div className="text-sm">
                      {request.createdAt
                        ? new Date(request.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "—"}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <DigitizationRequestModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={() => {
          fetchRequests();
          onRefresh?.();
        }}
      />

      {/* Confirm Digitization Modal */}
      <Dialog
        open={confirmModalOpen}
        onOpenChange={handleConfirmModalOpenChange}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Xác nhận số hóa</DialogTitle>
            <DialogDescription>
              {pendingRequestData
                ? `Bạn muốn số hóa ${
                    pendingRequestData.request.name || "tài sản"
                  }?`
                : "Xác nhận số hóa tài sản này."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Nếu đồng ý, bạn sẽ bị trừ phí{" "}
              <span className="font-semibold text-cyan-400">
                {formatNumber(pendingRequestData?.totalFeePercent ?? 0, {
                  maximumFractionDigits: 2,
                })}
                %
              </span>
              , tương đương với{" "}
              <span className="font-semibold text-white">
                {formatNumber(pendingRequestData?.paidAmount ?? 0, {
                  maximumFractionDigits: 2,
                })}{" "}
                CAN
              </span>
              .
            </p>
            <p>
              Phí sẽ được trừ ngay lập tức khỏi ví của bạn và không thể hoàn
              tác.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => handleConfirmModalOpenChange(false)}
              disabled={feeLoading}
            >
              Thoát
            </Button>
            <Button onClick={handleConfirmRequest} disabled={feeLoading}>
              {feeLoading ? (
                <span className="flex items-center gap-2">
                  <Spinner className="w-4 h-4" />
                  Đang xử lý...
                </span>
              ) : (
                "Đồng ý"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog
        open={successModalOpen}
        onOpenChange={(open) => {
          if (!open) handleSuccessModalClose();
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Chúc mừng!</DialogTitle>
            <DialogDescription>
              Bạn đã số hóa thành công tài sản của mình.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Hệ thống đã hoàn tất xử lý. Bạn có thể theo dõi giao dịch và xem
              lại thông tin tài sản qua các liên kết bên dưới.
            </p>
            <div className="space-y-2">
              <a
                href={explorerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline block"
              >
                Kiểm tra giao dịch
              </a>
              <a
                href={myNftLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline block"
              >
                Xem cổ phần
              </a>
              <a
                href={investmentNftLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline block"
              >
                Xem chi tiết NFT
              </a>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={handleSuccessModalClose}>Thoát</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={handleCloseDetailModal}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto mt-[20px]">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu số hóa</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về yêu cầu số hóa NFT
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Image */}
              <div className="relative h-64 w-full rounded-lg overflow-hidden bg-muted">
                {selectedRequest.image?.url ? (
                  <Image
                    src={
                      selectedRequest.image.url.startsWith("http")
                        ? selectedRequest.image.url
                        : `${process.env.NEXT_PUBLIC_API_BASE_URL}${selectedRequest.image.url}`
                    }
                    alt={selectedRequest.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                    <span className="text-6xl">📄</span>
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  {getStatusBadge(selectedRequest.status)}
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Name */}
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    Tên tài sản
                  </div>
                  <div className="text-lg font-semibold">
                    {selectedRequest.name}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    Trạng thái
                  </div>
                  <div>{getStatusBadge(selectedRequest.status)}</div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Mô tả</div>
                <div className="text-sm text-muted-foreground">
                  {selectedRequest.description}
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3 p-4 glass rounded-lg">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">
                    Địa chỉ
                  </div>
                  <div className="text-sm">{selectedRequest.address}</div>
                </div>
              </div>

              {/* Price and Percentage */}
              <div className="grid gap-4 md:grid-cols-2">
                {selectedRequest.price && (
                  <div className="flex items-center gap-3 p-4 glass rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground mb-1">
                        Giá tài sản
                      </div>
                      <div className="text-xl font-bold gradient-text">
                        {formatNumber(selectedRequest.price ?? 0, {
                          maximumFractionDigits: 0,
                        })}{" "}
                        VNĐ
                      </div>
                    </div>
                  </div>
                )}

                {selectedRequest.availablePercentage && (
                  <div className="flex items-center gap-3 p-4 glass rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground mb-1">
                        Cổ phần mở bán
                      </div>
                      <div className="text-xl font-bold">
                        {selectedRequest.availablePercentage}%
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">
                      Ngày tạo
                    </div>
                    <div className="text-sm">
                      {new Date(selectedRequest.createdAt).toLocaleDateString(
                        "vi-VN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  </div>
                </div>

                {selectedRequest.updatedAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground mb-1">
                        Ngày cập nhật
                      </div>
                      <div className="text-sm">
                        {new Date(selectedRequest.updatedAt).toLocaleDateString(
                          "vi-VN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
