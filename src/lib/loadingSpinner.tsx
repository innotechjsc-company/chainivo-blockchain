import { Spinner } from "@/components/ui/spinner";

export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex items-center gap-3 px-4 py-3 bg-background/90 rounded-lg border border-primary/20">
        <Spinner className="h-6 w-6 text-primary" />
        <span className="text-sm font-medium text-primary">
          Đang tải dữ liệu ...
        </span>
      </div>
    </div>
  );
};
