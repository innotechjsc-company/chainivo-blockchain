import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Wallet, RefreshCw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/screens/investments-screen/hooks/useUserProfile";

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

  const hasWalletAddress = Boolean(userProfile?.walletAddress);
  const statusColor = hasWalletAddress
    ? isWalletConnected
      ? "bg-emerald-500"
      : "bg-red-500"
    : "bg-red-500";

  const displayLabel = hasWalletAddress
    ? `${userProfile?.walletAddress?.slice(
        0,
        6
      )}...${userProfile?.walletAddress?.slice(-4)}`
    : userProfile?.email ||
      userProfile?.username ||
      userProfile?.name ||
      "Người dùng";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          className="hidden md:flex items-center h-auto py-2 cursor-pointer relative"
        >
          <span
            className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-background ${statusColor}`}
          />
          <Wallet className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium text-left">{displayLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={onReconnect} disabled={isWalletConnected}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Kết nối lại
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDisconnect} disabled={!isWalletConnected}>
          <X className="w-4 h-4 mr-2" />
          Ngắt kết nối
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/account")}>
          <User className="w-4 h-4 mr-2" />
          Quản lý tài khoản
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/missions")}>
          <Settings className="w-4 h-4 mr-2" />
          Nhiệm vụ
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="w-4 h-4 mr-2" />
          Cài đặt
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
