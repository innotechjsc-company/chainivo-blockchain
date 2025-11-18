import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, RefreshCw, X } from "lucide-react";
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
          variant="ghost"
          className="hidden md:flex items-center h-auto py-2 cursor-pointer relative bg-transparent hover:bg-transparent border border-border"
        >
          <span
            className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-background ${statusColor}`}
          />
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
          <span className="text-sm font-medium text-left">{displayLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={onReconnect}
          disabled={isWalletConnected}
          className="mt-2"
        >
          <RefreshCw className="w-4 h-4 mr-2 " />
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

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
