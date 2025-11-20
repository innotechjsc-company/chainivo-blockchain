"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X, CheckCircle2 } from "lucide-react";
import { constants } from "@/api/constants";

interface AvatarUploadProps {
  currentAvatar?: string;
  previewUrl?: string | null; // Preview from parent component
  userName: string;
  onAvatarSelect: (file: File | null, previewUrl: string | null) => void;
  disabled?: boolean;
  error?: string;
}

export function AvatarUpload({
  currentAvatar,
  previewUrl: externalPreviewUrl = null,
  userName,
  onAvatarSelect,
  disabled = false,
  error,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Use external preview URL from parent (backup system), or local preview
  const displayPreviewUrl = externalPreviewUrl || previewUrl;

  // Sync with parent's preview state
  useEffect(() => {
    if (externalPreviewUrl === null) {
      setPreviewUrl(null);
      setFileName(null);
    }
  }, [externalPreviewUrl]);

  // File validation constants
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];
  const ALLOWED_EXTENSIONS = ["jpeg", "jpg", "png", "gif", "webp", "svg"];

  const validateFile = (file: File): string | null => {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return "Kích thước ảnh phải nhỏ hơn 5MB";
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Chỉ hỗ trợ: jpeg, png, gif, webp, svg";
    }

    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError(null);

    if (!file) {
      console.log("[AVATAR-UPLOAD] No file selected");
      return;
    }

    console.log("[AVATAR-UPLOAD] File selected:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      console.error("[AVATAR-UPLOAD] Validation error:", validationError);
      setFileError(validationError);
      onAvatarSelect(null, null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      console.log("[AVATAR-UPLOAD] Preview generated:", {
        previewLength: preview.length,
        previewStart: preview.substring(0, 50) + "...",
      });
      setPreviewUrl(preview);
      setFileName(file.name);
      onAvatarSelect(file, preview);
    };
    reader.onerror = (error) => {
      console.error("[AVATAR-UPLOAD] FileReader error:", error);
      setFileError("Lỗi đọc file");
    };
    reader.readAsDataURL(file);
  };

  const handleClearAvatar = () => {
    console.log("[AVATAR-UPLOAD] Clearing avatar preview");
    setPreviewUrl(null);
    setFileName(null);
    setFileError(null);
    onAvatarSelect(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChooseAvatar = () => {
    fileInputRef.current?.click();
  };

  const initials = userName?.[0]?.toUpperCase() || "U";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Display Section */}
      <div className="flex gap-6 items-start">
        {/* Current Avatar */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-muted-foreground font-medium">
            Ảnh hiện tại
          </p>
          <Avatar className="w-24 h-24 border-2 border-muted">
            <AvatarImage
              src={currentAvatar || constants.user.DEFAULT_AVATAR}
              alt={`Current avatar of ${userName}`}
              onError={(e) => {
                console.warn(
                  "[AVATAR-UPLOAD] Current avatar failed to load:",
                  currentAvatar
                );
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <AvatarFallback className="text-2xl bg-muted">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Preview Avatar (Conditionally Show) */}
        {displayPreviewUrl && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
              <p className="text-xs text-green-600 font-medium">Ảnh mới</p>
              <CheckCircle2 className="w-3 h-3 text-green-600" />
            </div>
            <div className="relative">
              <Avatar className="w-24 h-24 border-2 border-green-500 ring-2 ring-green-100">
                <AvatarImage
                  src={displayPreviewUrl}
                  alt={`Avatar preview of ${fileName}`}
                  onError={(e) => {
                    console.error("[AVATAR-UPLOAD] Preview failed to load:", {
                      previewStart: displayPreviewUrl.substring(0, 50),
                    });
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                  onLoad={() => {
                    console.log("[AVATAR-UPLOAD] Preview loaded successfully");
                  }}
                />
                <AvatarFallback className="text-2xl bg-green-100">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            {fileName && (
              <p className="text-xs text-muted-foreground">{fileName}</p>
            )}
          </div>
        )}
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(",")}
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
        aria-label="Avatar upload"
      />

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleChooseAvatar}
          disabled={disabled}
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          {displayPreviewUrl ? "Chọn ảnh khác" : "Chọn ảnh"}
        </Button>

        {displayPreviewUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearAvatar}
            disabled={disabled}
            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
            Xoá
          </Button>
        )}
      </div>

      {/* Status Messages */}
      {fileError && (
        <p className="text-sm text-red-500 text-center">{fileError}</p>
      )}
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      {displayPreviewUrl && (
        <div className="text-center">
          <p className="text-xs text-green-600 font-medium">
            ✓ Ảnh mới sẽ được upload khi bạn click "Cập nhật"
          </p>
        </div>
      )}
    </div>
  );
}
