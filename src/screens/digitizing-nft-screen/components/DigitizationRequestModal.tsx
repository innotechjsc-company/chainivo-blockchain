"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  SendRequestService,
  MediaService,
  type MediaUploadResponse,
} from "@/api/services";
import type { ApiResponse } from "@/api/api";
import { ToastService } from "@/services/ToastService";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface DigitizationRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DigitizationRequestModal({
  open,
  onOpenChange,
  onSuccess,
}: DigitizationRequestModalProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentsInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    documents: [] as string[],
    price: "",
    availablePercentage: "",
    address: "",
    senderName: "",
    senderPhoneNumber: "",
    senderEmail: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên tài sản là bắt buộc";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Mô tả tài sản là bắt buộc";
    }
    if (!imageFile) {
      newErrors.image = "Hình ảnh là bắt buộc";
    }
    if (!formData.price.trim()) {
      newErrors.price = "Giá tài sản là bắt buộc";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Giá tài sản phải là số lớn hơn 0";
    }
    if (!formData.availablePercentage.trim()) {
      newErrors.availablePercentage = "Phần trăm số cổ phần là bắt buộc";
    } else if (
      isNaN(Number(formData.availablePercentage)) ||
      Number(formData.availablePercentage) <= 0 ||
      Number(formData.availablePercentage) > 100
    ) {
      newErrors.availablePercentage =
        "Phần trăm số cổ phần phải là số từ 1 đến 100";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Vị trí đặt tài sản là bắt buộc";
    }
    if (!formData.senderName.trim()) {
      newErrors.senderName = "Tên người gửi là bắt buộc";
    }
    if (!formData.senderPhoneNumber.trim()) {
      newErrors.senderPhoneNumber = "Số điện thoại là bắt buộc";
    }
    if (!formData.senderEmail.trim()) {
      newErrors.senderEmail = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.senderEmail)) {
      newErrors.senderEmail = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Upload ảnh trước
      let imageId = "";
      if (imageFile) {
        setUploadingImage(true);
        try {
          const imageResponse = await MediaService.uploadAvatar(imageFile);
          if (imageResponse.success && imageResponse.data) {
            imageId = imageResponse.data.id;
          } else {
            const errorMessage =
              imageResponse.error ||
              "Không thể upload ảnh. Vui lòng thử lại sau.";
            ToastService.error(errorMessage);
            setLoading(false);
            setUploadingImage(false);
            return;
          }
        } catch (uploadError: any) {
          console.error("Image upload error:", uploadError);
          const errorMessage =
            uploadError?.message ||
            uploadError?.response?.data?.error ||
            "Lỗi khi upload ảnh. Vui lòng kiểm tra kết nối và thử lại.";
          ToastService.error(errorMessage);
          setLoading(false);
          setUploadingImage(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      // Upload tài liệu (nếu có)
      let documentIds: string[] = [];
      if (documentFiles.length > 0) {
        setUploadingDocuments(true);
        try {
          const uploadPromises = documentFiles.map((file) =>
            MediaService.uploadAvatar(file)
          );
          const responses = await Promise.all(uploadPromises);

          const uploadedIds: string[] = [];
          const failedFiles: string[] = [];

          responses.forEach(
            (response: ApiResponse<MediaUploadResponse>, index: number) => {
              if (response.success && response.data) {
                uploadedIds.push(response.data.id);
              } else {
                const fileName = documentFiles[index].name;
                failedFiles.push(fileName);
                const errorMessage =
                  response.error ||
                  `Không thể upload file ${fileName}. Vui lòng thử lại.`;
                console.error(`Upload failed for ${fileName}:`, response.error);
              }
            }
          );

          if (uploadedIds.length !== documentFiles.length) {
            const errorMessage =
              failedFiles.length === 1
                ? `Không thể upload file "${failedFiles[0]}". Vui lòng thử lại.`
                : `Không thể upload ${failedFiles.length} file. Vui lòng thử lại.`;
            ToastService.error(errorMessage);
            setLoading(false);
            setUploadingDocuments(false);
            return;
          }

          documentIds = uploadedIds;
        } catch (uploadError: any) {
          console.error("Documents upload error:", uploadError);
          const errorMessage =
            uploadError?.message ||
            uploadError?.response?.data?.error ||
            "Lỗi khi upload tài liệu. Vui lòng kiểm tra kết nối và thử lại.";
          ToastService.error(errorMessage);
          setLoading(false);
          setUploadingDocuments(false);
          return;
        } finally {
          setUploadingDocuments(false);
        }
      }

      // Gửi request với ID đã upload
      const response = await SendRequestService.sendRequest({
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: imageId,
        documents: documentIds.length > 0 ? documentIds : undefined,
        price: Number(formData.price),
        availablePercentage: Number(formData.availablePercentage),
        address: formData.address.trim(),
        senderName: formData.senderName.trim(),
        senderPhoneNumber: formData.senderPhoneNumber.trim(),
        senderEmail: formData.senderEmail.trim(),
      });

      if (response.success) {
        ToastService.success("Gửi yêu cầu số hóa thành công!", {
          description: "Yêu cầu của bạn đã được gửi và đang được xử lý",
        });
        handleClose();
        onSuccess?.();
      } else {
        ToastService.error(response.error || "Không thể gửi yêu cầu số hóa");
      }
    } catch (error: any) {
      ToastService.error("Đã xảy ra lỗi khi gửi yêu cầu số hóa");
      console.error("Send request error:", error);
    } finally {
      setLoading(false);
      setUploadingImage(false);
      setUploadingDocuments(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: "",
        description: "",
        image: "",
        documents: [],
        price: "",
        availablePercentage: "",
        address: "",
        senderName: "",
        senderPhoneNumber: "",
        senderEmail: "",
      });
      setErrors({});
      setImagePreview(null);
      setImageFile(null);
      setDocumentFiles([]);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      if (documentsInputRef.current) {
        documentsInputRef.current.value = "";
      }
      onOpenChange(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const abc = e.target.files;
    const file = e.target.files?.[0];
    debugger;
    if (!file) return;

    // Validate image file
    if (!file.type.startsWith("image/")) {
      ToastService.error("Vui lòng chọn file ảnh");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      ToastService.error("Kích thước ảnh phải nhỏ hơn 10MB");
      return;
    }
    setImageFile(file);
    setErrors({ ...errors, image: "" });

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDocumentsSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        ToastService.error(`File ${file.name} quá lớn (tối đa 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setDocumentFiles([...documentFiles, ...validFiles]);

    // Reset input để có thể chọn lại file giống nhau
    if (documentsInputRef.current) {
      documentsInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleRemoveDocument = (index: number) => {
    const newFiles = documentFiles.filter((_, i) => i !== index);
    setDocumentFiles(newFiles);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] pt-10 max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gửi yêu cầu số hóa NFT</DialogTitle>
          <DialogDescription>
            Điền thông tin tài sản và thông tin liên hệ để gửi yêu cầu số hóa
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên tài sản */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên tài sản <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nhập tên tài sản"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Mô tả tài sản */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Mô tả tài sản <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Nhập mô tả chi tiết về tài sản"
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Hình ảnh */}
          <div className="space-y-2">
            <Label htmlFor="image">
              Hình ảnh tài sản <span className="text-red-500">*</span>
            </Label>
            <input
              ref={imageInputRef}
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              disabled={uploadingImage}
            />
            {imagePreview ? (
              <div className="relative w-full">
                <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {imageFile?.name}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                    disabled={uploadingImage || loading}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Xóa ảnh
                  </Button>
                </div>
                {uploadingImage && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Đang upload...
                  </p>
                )}
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploadingImage || loading}
                className="w-full"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                {uploadingImage ? "Đang upload..." : "Chọn ảnh"}
              </Button>
            )}
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image}</p>
            )}
          </div>

          {/* Tài liệu */}
          <div className="space-y-2">
            <Label htmlFor="documents">
              Tài liệu <span className="text-muted-foreground">(Tùy chọn)</span>
            </Label>
            <input
              ref={documentsInputRef}
              id="documents"
              type="file"
              multiple
              onChange={handleDocumentsSelect}
              className="hidden"
              disabled={uploadingDocuments}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => documentsInputRef.current?.click()}
              disabled={uploadingDocuments || loading}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploadingDocuments
                ? "Đang upload..."
                : "Chọn tài liệu (có thể chọn nhiều)"}
            </Button>
            {uploadingDocuments && (
              <p className="text-sm text-muted-foreground">
                Đang upload tài liệu...
              </p>
            )}
            {documentFiles.length > 0 && (
              <div className="mt-2 space-y-2">
                {documentFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDocument(index)}
                      disabled={uploadingDocuments || loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Tùy chọn: Chọn một hoặc nhiều file tài liệu (PDF, DOC, DOCX, v.v.)
            </p>
          </div>

          {/* Giá tài sản */}
          <div className="space-y-2">
            <Label htmlFor="price">
              Giá tài sản <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="Nhập giá tài sản"
              min="0"
              step="0.01"
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price}</p>
            )}
          </div>

          {/* Phần trăm số cổ phần */}
          <div className="space-y-2">
            <Label htmlFor="availablePercentage">
              Phần trăm số cổ phần mở bán{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="availablePercentage"
              type="number"
              value={formData.availablePercentage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  availablePercentage: e.target.value,
                })
              }
              placeholder="Nhập phần trăm (1-100)"
              min="1"
              max="100"
              step="0.01"
              className={errors.availablePercentage ? "border-red-500" : ""}
            />
            {errors.availablePercentage && (
              <p className="text-sm text-red-500">
                {errors.availablePercentage}
              </p>
            )}
          </div>

          {/* Vị trí đặt tài sản */}
          <div className="space-y-2">
            <Label htmlFor="address">
              Vị trí đặt tài sản <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Nhập địa chỉ/vị trí tài sản"
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          {/* Tên người gửi */}
          <div className="space-y-2">
            <Label htmlFor="senderName">
              Tên người gửi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="senderName"
              value={formData.senderName}
              onChange={(e) =>
                setFormData({ ...formData, senderName: e.target.value })
              }
              placeholder="Nhập tên người gửi"
              className={errors.senderName ? "border-red-500" : ""}
            />
            {errors.senderName && (
              <p className="text-sm text-red-500">{errors.senderName}</p>
            )}
          </div>

          {/* Số điện thoại */}
          <div className="space-y-2">
            <Label htmlFor="senderPhoneNumber">
              Số điện thoại <span className="text-red-500">*</span>
            </Label>
            <Input
              id="senderPhoneNumber"
              value={formData.senderPhoneNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  senderPhoneNumber: e.target.value,
                })
              }
              placeholder="Nhập số điện thoại"
              className={errors.senderPhoneNumber ? "border-red-500" : ""}
            />
            {errors.senderPhoneNumber && (
              <p className="text-sm text-red-500">{errors.senderPhoneNumber}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="senderEmail">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="senderEmail"
              type="email"
              value={formData.senderEmail}
              onChange={(e) =>
                setFormData({ ...formData, senderEmail: e.target.value })
              }
              placeholder="Nhập email"
              className={errors.senderEmail ? "border-red-500" : ""}
            />
            {errors.senderEmail && (
              <p className="text-sm text-red-500">{errors.senderEmail}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Thoát
            </Button>
            <Button
              type="submit"
              disabled={loading || uploadingImage || uploadingDocuments}
            >
              {loading || uploadingImage || uploadingDocuments
                ? uploadingImage
                  ? "Đang upload ảnh..."
                  : uploadingDocuments
                  ? "Đang upload tài liệu..."
                  : "Đang gửi..."
                : "Gửi yêu cầu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
