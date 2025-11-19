import { WalletService } from "@/api/services/wallet-service";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Settings,
  LogOut,
  RefreshCw,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/screens/investments-screen/hooks/useUserProfile";
import { useEffect, useState } from "react";

interface UserMenuProps {
  userProfile: UserProfile | null;
  onSignOut: () => void;
  onReconnect: () => void;
  onDisconnect: () => void;
  isWalletConnected: boolean;
}

export const UserMenu = ({
  userProfile,
  onSignOut,
  onReconnect,
  onDisconnect,
  isWalletConnected,
}: UserMenuProps) => {
  const router = useRouter();
  const [canBalance, setCanBalance] = useState(0);
  const [isLabelVisible, setIsLabelVisible] = useState(true);
  useEffect(() => {
    const fetchCanBalance = async () => {
      try {
        if (!userProfile?.walletAddress) return;
        const response = await WalletService.getWalletCanBalances(
          userProfile.walletAddress
        );
        if (response?.success) {
          const raw = Number((response.data as any)?.can as number);
          setCanBalance(Number.isFinite(raw) ? Math.round(raw) : 0);
        }
      } catch (error) {
        console.error("Failed to fetch CAN balance:", error);
      }
    };

    fetchCanBalance();
  }, [userProfile?.walletAddress]);

  const hasWalletAddress = Boolean(userProfile?.walletAddress);
  const statusColor = hasWalletAddress
    ? isWalletConnected
      ? "bg-emerald-500"
      : "bg-red-500"
    : "bg-red-500";

  const displayLabel = hasWalletAddress
    ? `${canBalance.toLocaleString()} CAN`
    : userProfile?.email ||
      userProfile?.username ||
      userProfile?.name ||
      "Người dùng";

  const maskedLabel = hasWalletAddress ? "•••••••• CAN" : "••••••••";
  const visibleLabel = isLabelVisible ? displayLabel : maskedLabel;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        className="hidden md:flex items-center h-auto py-2 cursor-pointer relative bg-transparent hover:bg-transparent border border-border"
        onClick={(e) => {
          e.stopPropagation();
          setIsLabelVisible(!isLabelVisible);
        }}
      >
        <span
          className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-background ${statusColor}`}
        />
        <span className="text-sm font-medium text-left">{visibleLabel}</span>
        {hasWalletAddress && (
          <>
            {isLabelVisible ? (
              <Eye className="w-4 h-4 text-muted-foreground" />
            ) : (
              <EyeOff className="w-4 h-4 text-muted-foreground" />
            )}
          </>
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild className="relative cursor-pointer">
          <Button variant="ghost" className="relative">
            {userProfile?.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt={displayLabel}
                className="w-6 h-6 rounded-full mr-2 object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full mr-2 bg-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-65">
          <DropdownMenuItem
            onClick={onReconnect}
            disabled={isWalletConnected}
            className="mt-2"
          >
            <RefreshCw className="w-4 h-4 mr-2 " />
            Kết nối lại
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDisconnect}
            disabled={!isWalletConnected}
          >
            <X className="w-4 h-4 mr-2" />
            Ngắt kết nối
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/account")}>
            <User className="w-4 h-4 mr-2" />
            Quản lý tài khoản
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/account?section=my-nft")}
          >
            <User className="w-4 h-4 mr-2" />
            NFT của tôi
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/account?section=nft-co-phan")}
          >
            <User className="w-4 h-4 mr-2" />
            NFT cổ phần
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/account?section=digitizing-request")}
          >
            <User className="w-4 h-4 mr-2" />
            Yêu cầu số hóa NFT
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/missions")}>
            <Settings className="w-4 h-4 mr-2" />
            Nhiệm vụ
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
