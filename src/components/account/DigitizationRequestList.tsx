"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { SendRequestService, type DigitizationRequest } from "@/api/services";
import { RefreshCw, MapPin, Calendar, DollarSign, Plus } from "lucide-react";
import { DigitizationRequestModal } from "@/screens/digitizing-nft-screen/components";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  const handleConfirmRequest = (request: DigitizationRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

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
                            ? `${request.price.toLocaleString("vi-VN")} VNĐ`
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

                  {shouldShowConfirmButton(request.status) && (
                    <div className="pt-2">
                      <Button
                        type="button"
                        className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-cyan-600 hover:to-purple-700 transition"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleConfirmRequest(request);
                        }}
                      >
                        Xác nhận
                      </Button>
                    </div>
                  )}
                </div>

                {/* Created Date - Fixed at bottom */}
                <div className="flex items-center gap-3 border-t pt-3 mt-auto min-h-[56px]">
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
                        {selectedRequest.price.toLocaleString("vi-VN")} VNĐ
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
