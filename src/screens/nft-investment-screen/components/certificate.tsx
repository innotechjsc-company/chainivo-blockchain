"use client";

import { ReactNode } from "react";
import { FileDown } from "lucide-react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";

interface CertificateDialogProps {
  open: boolean;
  onClose: () => void;
  onDownload: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
}

export function CertificateDialog({
  open,
  onClose,
  onDownload,
  title = "Chứng chỉ xác nhận NFT",
  description = "Toàn bộ thông tin chứng chỉ sở hữu NFT của bạn",
  children,
}: CertificateDialogProps) {
  if (!open || typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <div className=" flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto bg-background/95 rounded-2xl border border-white/10 shadow-2xl">
        <div className="sticky top-0 z-10 flex flex-col gap-2 bg-background/95 px-6 pt-6 pb-2 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={onClose}
              >
                Đóng
              </Button>
              <Button className="gap-2 cursor-pointer" onClick={onDownload}>
                <FileDown className="w-4 h-4" />
                Tải PDF
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="p-6 space-y-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}
