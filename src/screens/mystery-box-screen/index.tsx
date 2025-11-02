"use client";

import {
  MysteryBoxFiltersCard,
  MysteryBoxGridCard,
} from "./components";
import {
  useMysteryBoxData,
  useMysteryBoxFilters,
} from "./hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function MysteryBoxScreen() {
  const router = useRouter();

  // 1. Fetch dữ liệu qua hooks
  const { boxes, isLoading, error } = useMysteryBoxData();
  const { filters, setFilters, filteredBoxes, resetFilters, hasActiveFilters } =
    useMysteryBoxFilters(boxes);

  // 2. Event handlers
  const handlePurchase = (boxId: string) => {
    const box = boxes.find((b) => b.id === boxId);
    if (!box) return;

    if (!box.isUnlimited && box.remainingSupply === 0) {
      toast.error("Hộp này đã hết hàng!");
      return;
    }

    // Navigate to detail page for purchase
    router.push(`/mysterybox/${boxId}`);
  };

  // 3. Loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Đang tải hộp bí ẩn...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 pt-20 pb-12">
          <div className="text-center py-20">
            <p className="text-xl text-red-400">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  // 4. Compose UI
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Filters */}
        <MysteryBoxFiltersCard
          filters={filters}
          onFiltersChange={setFilters}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={resetFilters}
        />

        {/* Mystery Boxes Grid */}
        {filteredBoxes.length > 0 ? (
          <MysteryBoxGridCard
            boxes={filteredBoxes}
            title="Hộp Bí Ẩn"
            onPurchase={handlePurchase}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              Không tìm thấy hộp bí ẩn phù hợp với bộ lọc
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
