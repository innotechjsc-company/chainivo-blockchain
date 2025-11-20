"use client";

import { useState, useRef, useEffect } from "react";
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
  FeeService,
  type MediaUploadResponse,
} from "@/api/services";
import type { ApiResponse } from "@/api/api";
import { ToastService } from "@/services/ToastService";
import { TransferService } from "@/services";
import { useAppSelector } from "@/stores";
import { TOKEN_DEAULT_CURRENCY } from "@/api/config";
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  DollarSign,
  Bold,
  Italic,
  Underline,
  List,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { LoadingSpinner } from "@/lib/loadingSpinner";

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
  const descriptionEditorRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fullDescription: "",
    image: "",
    documents: [] as string[],
    price: "",
    availablePercentage: "",
    address: "",
    senderName: "",
    senderPhoneNumber: "",
    senderEmail: "",
  });

  // State cho location picker
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false);
  const [gettingLocation, setGettingLocation] = useState<boolean>(false);

  // State cho address autocomplete
  const [addressSuggestions, setAddressSuggestions] = useState<
    Array<{
      display_name: string;
      lat: string;
      lon: string;
    }>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);
  const addressInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);

  // State cho modal thanh toán phí
  const [feeModalOpen, setFeeModalOpen] = useState(false);
  const [appraisalFee, setAppraisalFee] = useState(0);
  const [calculatedFee, setCalculatedFee] = useState(0);
  const [payingFee, setPayingFee] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [typeFee, setTypeFee] = useState<string>("");

  // Lấy wallet address từ Redux store
  const walletAddress = useAppSelector(
    (state) => state.auth.user?.walletAddress
  );

  // Helper function để format số với dấu phẩy
  const formatNumberWithCommas = (value: string): string => {
    // Loại bỏ tất cả ký tự không phải số và dấu chấm
    let numericValue = value.replace(/[^\d.]/g, "");
    if (!numericValue) return "";

    // Xử lý trường hợp có nhiều dấu chấm (chỉ giữ lại dấu chấm đầu tiên)
    const dotIndex = numericValue.indexOf(".");
    if (dotIndex !== -1) {
      const integerPart = numericValue.substring(0, dotIndex);
      const decimalPart = numericValue
        .substring(dotIndex + 1)
        .replace(/\./g, "");
      numericValue = `${integerPart}.${decimalPart}`;
    }

    // Tách phần nguyên và phần thập phân
    const parts = numericValue.split(".");
    const integerPart = parts[0] || "";
    const decimalPart = parts[1];

    // Format phần nguyên với dấu phẩy
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Kết hợp lại
    return decimalPart !== undefined
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;
  };

  // Helper function để parse số từ string có dấu phẩy
  const parseNumberFromFormatted = (value: string): string => {
    return value.replace(/,/g, "");
  };

  // Hàm format HTML editor
  const formatText = (command: string, value?: string) => {
    if (descriptionEditorRef.current) {
      descriptionEditorRef.current.focus();
      document.execCommand(command, false, value);
      const html = descriptionEditorRef.current.innerHTML;
      setFormData({ ...formData, description: html });
    }
  };

  // Hàm xử lý khi thay đổi nội dung HTML editor
  const handleDescriptionChange = () => {
    if (descriptionEditorRef.current) {
      const html = descriptionEditorRef.current.innerHTML;
      setFormData({ ...formData, description: html });
    }
  };

  // Sync HTML khi formData.description thay đổi từ bên ngoài (như reset form)
  useEffect(() => {
    if (
      descriptionEditorRef.current &&
      formData.description !== descriptionEditorRef.current.innerHTML
    ) {
      descriptionEditorRef.current.innerHTML = formData.description || "";
    }
  }, [formData.description]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên tài sản là bắt buộc";
    }
    // Kiểm tra description HTML: loại bỏ HTML tags để kiểm tra nội dung thực tế
    const descriptionText = formData.description.replace(/<[^>]*>/g, "").trim();
    if (!descriptionText) {
      newErrors.description = "Mô tả tài sản là bắt buộc";
    }
    if (!imageFile) {
      newErrors.image = "Hình ảnh là bắt buộc";
    }
    if (!formData.price.trim()) {
      newErrors.price = "Giá tài sản là bắt buộc";
    } else {
      const numericPrice = parseNumberFromFormatted(formData.price);
      if (isNaN(Number(numericPrice)) || Number(numericPrice) <= 0) {
        newErrors.price = "Giá tài sản phải là số lớn hơn 0";
      }
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
    if (!selectedLocation && !formData.address.trim()) {
      newErrors.address =
        "Vị trí đặt tài sản là bắt buộc. Vui lòng chọn vị trí trên bản đồ.";
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
    await checkAppraisalFee();

    setFeeModalOpen(true);
  };

  // Hàm kiểm tra và hiển thị modal phí số hóa
  const checkAppraisalFee = async () => {
    try {
      setLoading(true);

      // Gọi API lấy phí hệ thống
      const feeResponse = await FeeService.getSystemFees();

      if (feeResponse.success && feeResponse.data) {
        // Tìm appraisalFee trong response
        let appraisalFeeValue = 0;
        let calculatedFeeAmount = 0;
        const appraisalFee = (feeResponse.data as any).appraisalFee;

        if (appraisalFee && Number(appraisalFee?.value) > 0) {
          const feeType = appraisalFee?.type || "percentage";
          const feeValue = Number(appraisalFee.value);

          if (feeType === "percentage") {
            // Phí theo phần trăm: tính theo giá trị
            appraisalFeeValue = feeValue;
            const priceValue = Number(parseNumberFromFormatted(formData.price));
            calculatedFeeAmount = (priceValue * appraisalFeeValue) / 100;
          } else if (feeType === "fixed") {
            // Phí cố định: set giá trị trực tiếp
            appraisalFeeValue = feeValue;
            calculatedFeeAmount = feeValue;
          }
        }

        if (appraisalFeeValue > 0) {
          setTypeFee(appraisalFee?.type || "");
          setAppraisalFee(appraisalFeeValue);
          setCalculatedFee(calculatedFeeAmount);
        }
      }
    } catch (error) {
      console.error("Error checking appraisal fee:", error);
      toast.error("Không thể kiểm tra phí số hóa. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  // Hàm xử lý thanh toán phí
  const handlePayFee = async () => {
    if (!walletAddress) {
      toast.error("Vui lòng kết nối ví MetaMask");
      return;
    }

    try {
      setPayingFee(true);

      toast.info("Đang chờ xác nhận giao dịch từ MetaMask...");

      // Gọi MetaMask để chuyển tiền
      const result = await TransferService.sendCanTransfer({
        fromAddress: walletAddress,
        amountCan: calculatedFee,
        gasLimit: 200000,
        gasBoostPercent: 100,
      });

      if (result.transactionHash) {
        setTransactionHash(result.transactionHash);
        toast.success("Thanh toán phí thành công!");
        setFeeModalOpen(false);

        // Tiếp tục submit request với transactionHash
        await proceedWithSubmit(result.transactionHash);
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error("Không nhận được xác nhận giao dịch");
        setPayingFee(false);
      }
    } catch (error: any) {
      console.error("Payment error:", error);

      if (error?.message?.includes("User denied") || error?.code === 4001) {
        toast.error("Bạn đã từ chối giao dịch");
      } else if (error?.message?.includes("insufficient funds")) {
        toast.error("Số dư không đủ để thanh toán phí");
      } else {
        toast.error("Lỗi khi thanh toán phí. Vui lòng thử lại.");
      }

      setPayingFee(false);
    }
  };

  // Hàm xử lý submit chính
  const proceedWithSubmit = async (paymentTransactionHash?: string) => {
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

      // Gửi request với ID đã upload và transactionHash (nếu có)
      // Gửi description dưới dạng JSON string
      const descriptionJson = JSON.stringify(formData.description.trim());

      // Tạo address JSON string nếu đã chọn vị trí trên bản đồ
      let addressValue: string;
      if (selectedLocation) {
        // Gửi address dưới dạng JSON string chứa address, lat, long
        addressValue = JSON.stringify({
          address: selectedLocation.address || formData.address.trim(),
          lat: selectedLocation.lat,
          long: selectedLocation.lng,
        });
      } else {
        // Fallback: nếu không có selectedLocation, dùng formData.address
        addressValue = formData.address.trim();
      }

      const requestPayload: any = {
        name: formData.name.trim(),
        description: formData.fullDescription.trim(),
        fullDescription: descriptionJson,
        image: imageId,
        documents: documentIds.length > 0 ? documentIds : undefined,
        price: Number(parseNumberFromFormatted(formData.price)),
        availablePercentage: Number(formData.availablePercentage),
        address: addressValue,
        senderName: formData.senderName.trim(),
        senderPhoneNumber: formData.senderPhoneNumber.trim(),
        senderEmail: formData.senderEmail.trim(),
      };

      // Thêm transactionHash nếu có thanh toán phí
      if (paymentTransactionHash) {
        requestPayload.transactionHash = paymentTransactionHash;
      }

      const response = await SendRequestService.sendRequest(requestPayload);

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
        fullDescription: "",
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
      setSelectedLocation(null);
      setAddressSuggestions([]);
      setShowSuggestions(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      if (documentsInputRef.current) {
        documentsInputRef.current.value = "";
      }
      onOpenChange(false);
    }
  };

  const handleMapClick = () => {
    setShowLocationPicker(true);
  };

  const handleLocationSelected = (location: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setSelectedLocation(location);
    setFormData({ ...formData, address: location.address });
    setShowLocationPicker(false);
    toast.success("Vị trí đã được chọn thành công");
  };

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt của bạn không hỗ trợ định vị");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse geocoding để lấy địa chỉ
        let addressText = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data.display_name) {
            addressText = data.display_name;
          }
        } catch (error) {
          console.error("Error getting address:", error);
        }

        const location = {
          lat: latitude,
          lng: longitude,
          address: addressText,
        };

        setSelectedLocation(location);
        setFormData({ ...formData, address: addressText });
        setGettingLocation(false);
        toast.success("Đã lấy vị trí hiện tại thành công");
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error(
          "Không thể lấy vị trí hiện tại. Vui lòng cho phép truy cập vị trí."
        );
        setGettingLocation(false);
      }
    );
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

  // Hàm fetch address suggestions từ Nominatim API
  const fetchAddressSuggestions = async (query: string) => {
    if (!query || query.trim().length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setLoadingSuggestions(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&addressdetails=1&countrycodes=vn`
      );
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setAddressSuggestions(data);
        setShowSuggestions(true);
      } else {
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setAddressSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Debounced fetch suggestions
  const debouncedFetchSuggestionsRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFetchSuggestions = (query: string) => {
    if (debouncedFetchSuggestionsRef.current) {
      clearTimeout(debouncedFetchSuggestionsRef.current);
    }
    debouncedFetchSuggestionsRef.current = setTimeout(() => {
      fetchAddressSuggestions(query);
    }, 500);
  };

  // Handle address input change
  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, address: value });

    // Fetch suggestions nếu có đủ ký tự
    if (value.trim().length >= 3) {
      debouncedFetchSuggestions(value.trim());
    } else {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      if (debouncedFetchSuggestionsRef.current) {
        clearTimeout(debouncedFetchSuggestionsRef.current);
      }
    }
  };

  // Handle select suggestion
  const handleSelectSuggestion = (suggestion: {
    display_name: string;
    lat: string;
    lon: string;
  }) => {
    const location = {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
      address: suggestion.display_name,
    };

    setSelectedLocation(location);
    setFormData({ ...formData, address: suggestion.display_name });
    setAddressSuggestions([]);
    setShowSuggestions(false);
    toast.success("Đã chọn vị trí từ gợi ý");
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
    <>
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
            {/* Mô tả chi tiết */}
            <div className="space-y-2">
              <Label htmlFor="fullDescription">
                Mô tả tài sản <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="fullDescription"
                value={formData.fullDescription}
                onChange={(e) =>
                  setFormData({ ...formData, fullDescription: e.target.value })
                }
                placeholder="Nhập mô tả chi tiết bổ sung về tài sản"
                rows={6}
              />
            </div>
            {/* Mô tả tài sản - HTML Editor */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Mô tả chi tiết
                <span className="text-muted-foreground">(Tùy chọn)</span>
              </Label>

              {/* Toolbar */}
              <div className="flex gap-1 p-2 border border-input rounded-t-md bg-muted/50">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText("bold")}
                  className="h-8 w-8 p-0"
                  title="Bold"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText("italic")}
                  className="h-8 w-8 p-0"
                  title="Italic"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText("underline")}
                  className="h-8 w-8 p-0"
                  title="Underline"
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <div className="w-px bg-border mx-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText("insertUnorderedList")}
                  className="h-8 w-8 p-0"
                  title="Bullet List"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText("insertOrderedList")}
                  className="h-8 w-8 p-0"
                  title="Numbered List"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* HTML Editor */}
              <div className="relative">
                <div
                  ref={descriptionEditorRef}
                  contentEditable
                  onInput={handleDescriptionChange}
                  onBlur={handleDescriptionChange}
                  className={`min-h-[100px] p-3 border border-t-0 border-input rounded-b-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    errors.description ? "border-red-500" : ""
                  }`}
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                />
                {(!formData.description ||
                  formData.description.replace(/<[^>]*>/g, "").trim() ===
                    "") && (
                  <div className="absolute top-3 left-3 text-muted-foreground pointer-events-none">
                    Nhập mô tả chi tiết về tài sản
                  </div>
                )}
              </div>

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
                Tài liệu{" "}
                <span className="text-muted-foreground">(Tùy chọn)</span>
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
                Tùy chọn: Chọn một hoặc nhiều file tài liệu (PDF, DOC, DOCX,
                v.v.)
              </p>
            </div>

            {/* Giá tài sản */}
            <div className="space-y-2">
              <Label htmlFor="price">
                Giá tài sản <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="text"
                value={formData.price}
                onChange={(e) => {
                  const formatted = formatNumberWithCommas(e.target.value);
                  setFormData({ ...formData, price: formatted });
                }}
                placeholder="Nhập giá tài sản (ví dụ: 1,000,000)"
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

              {/* Bản đồ nhỏ */}
              <div
                className="relative w-full rounded-lg overflow-hidden border border-input hover:border-primary transition-colors"
                style={{ height: "200px" }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={getMapUrl()}
                />

                {/* Nút chọn vị trí hiện tại */}
                <div className="absolute top-2 right-2 z-10">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGetCurrentLocation();
                    }}
                    disabled={gettingLocation}
                    className="bg-white/90 hover:bg-white text-primary shadow-md"
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    {gettingLocation ? "Đang lấy..." : "Vị trí hiện tại"}
                  </Button>
                </div>

                {/* Overlay click để mở dialog chọn vị trí */}
                {!selectedLocation && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/5 transition-colors cursor-pointer"
                    onClick={handleMapClick}
                  >
                    <div className="text-center pointer-events-none">
                      <MapPin className="w-6 h-6 mx-auto mb-1 text-primary" />
                      <p className="text-xs font-medium text-muted-foreground">
                        Nhấn để chọn vị trí khác
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Input địa chỉ cụ thể với autocomplete */}
              <div className="relative">
                <Input
                  ref={addressInputRef}
                  id="address"
                  value={formData.address}
                  onChange={handleAddressInputChange}
                  onFocus={() => {
                    if (addressSuggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay để cho phép click vào suggestion
                    setTimeout(() => {
                      setShowSuggestions(false);
                    }, 200);
                  }}
                  placeholder="Nhập địa chỉ cụ thể (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                  className={errors.address ? "border-red-500" : ""}
                />

                {/* Suggestions Dropdown */}
                {showSuggestions && addressSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {loadingSuggestions ? (
                      <div className="p-3 text-sm text-muted-foreground text-center">
                        Đang tìm kiếm...
                      </div>
                    ) : (
                      addressSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-b-0"
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium line-clamp-1">
                                {suggestion.display_name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {parseFloat(suggestion.lat).toFixed(6)},{" "}
                                {parseFloat(suggestion.lon).toFixed(6)}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Hiển thị tọa độ nếu đã chọn */}
              {selectedLocation && (
                <div className="text-xs text-muted-foreground">
                  <p>
                    Tọa độ: {selectedLocation.lat.toFixed(6)},{" "}
                    {selectedLocation.lng.toFixed(6)}
                  </p>
                </div>
              )}

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
                <p className="text-sm text-red-500">
                  {errors.senderPhoneNumber}
                </p>
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

      {/* Modal thanh toán phí số hóa */}
      <Dialog
        open={feeModalOpen}
        onOpenChange={(isOpen) => {
          if (!payingFee) {
            setFeeModalOpen(isOpen);
            if (!isOpen) {
              setLoading(false);
            }
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Thanh toán phí số hóa
            </DialogTitle>
            <DialogDescription>
              Để tiếp tục số hóa tài sản, bạn cần thanh toán phí thẩm định
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Thông tin phí */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Giá trị tài sản:
                </span>
                <span className="font-semibold">
                  {Number(
                    parseNumberFromFormatted(formData.price)
                  ).toLocaleString()}{" "}
                  {TOKEN_DEAULT_CURRENCY}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Phí thẩm định:
                </span>
                <span className="font-semibold text-primary">
                  {appraisalFee}{" "}
                  {typeFee === "percentage" ? "%" : TOKEN_DEAULT_CURRENCY}
                </span>
              </div>

              <div className="border-t border-primary/20 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Tổng phí cần thanh toán:</span>
                  <span className="text-lg font-bold text-primary">
                    {calculatedFee.toLocaleString()} {TOKEN_DEAULT_CURRENCY}
                  </span>
                </div>
              </div>
            </div>

            {/* Thông báo */}
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-3">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 Phí sẽ được chuyển qua ví MetaMask của bạn. Vui lòng đảm bảo
                bạn có đủ số dư để thanh toán.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFeeModalOpen(false);
                setLoading(false);
              }}
              disabled={payingFee}
            >
              Thoát
            </Button>
            <Button type="button" onClick={handlePayFee} disabled={payingFee}>
              {payingFee ? "Đang xử lý..." : "Đồng ý thanh toán"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading Spinner khi đang thanh toán phí */}
      {payingFee && <LoadingSpinner />}
    </>
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
