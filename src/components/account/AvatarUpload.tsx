'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X } from 'lucide-react';
import { constants } from '@/api/constants';

interface AvatarUploadProps {
  currentAvatar?: string;
  userName: string;
  onAvatarSelect: (file: File | null, previewUrl: string | null) => void;
  disabled?: boolean;
  error?: string;
}

export function AvatarUpload({
  currentAvatar,
  userName,
  onAvatarSelect,
  disabled = false,
  error,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // DEBUG: Log props khi component render
  console.log('[DEBUG AvatarUpload] Props received:', {
    currentAvatar,
    userName,
    disabled,
    error,
  });

  // Clear preview khi currentAvatar thay đổi (sau khi upload thành công)
  useEffect(() => {
    if (currentAvatar && previewUrl) {
      console.log('[DEBUG AvatarUpload] Clearing preview because currentAvatar changed');
      setPreviewUrl(null);
    }
  }, [currentAvatar, previewUrl]);

  // File validation constants
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  const ALLOWED_EXTENSIONS = ['jpeg', 'jpg', 'png', 'gif', 'webp', 'svg'];

  const validateFile = (file: File): string | null => {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return 'Kich thuoc anh phai nho hon 5MB';
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Chi ho tro: jpeg, png, gif, webp, svg';
    }

    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError(null);

    if (!file) {
      return;
    }

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setFileError(validationError);
      onAvatarSelect(null, null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      setPreviewUrl(preview);
      onAvatarSelect(file, preview);
    };
    reader.readAsDataURL(file);
  };

  const handleClearAvatar = () => {
    setPreviewUrl(null);
    setFileError(null);
    onAvatarSelect(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChooseAvatar = () => {
    fileInputRef.current?.click();
  };

  const displayAvatar = previewUrl || currentAvatar || constants.user.DEFAULT_AVATAR;
  const initials = userName?.[0]?.toUpperCase() || 'U';

  // DEBUG: Log avatar display logic
  console.log('[DEBUG AvatarUpload] Avatar display logic:', {
    previewUrl,
    currentAvatar,
    defaultAvatar: constants.user.DEFAULT_AVATAR,
    displayAvatar,
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src={displayAvatar} alt={userName} />
        <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
      </Avatar>

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(',')}
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
        aria-label="Avatar upload"
      />

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
          Chọn ảnh 
        </Button>

        {previewUrl && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearAvatar}
            disabled={disabled}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Xoá
          </Button>
        )}
      </div>

      {fileError && <p className="text-sm text-red-500">{fileError}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {previewUrl && (
        <p className="text-xs text-green-500">Anh moi se duoc upload khi cap nhat</p>
      )}
    </div>
  );
}
