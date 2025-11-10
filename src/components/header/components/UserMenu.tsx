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
}

export const UserMenu = ({
  userProfile,
  onSignOut,
  onReconnect,
  onDisconnect,
}: UserMenuProps) => {
  const router = useRouter();

  const hasWalletAddress = Boolean(userProfile?.walletAddress);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          className="hidden md:flex items-center h-auto py-2 cursor-pointer relative"
        >
          <span
            className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-background ${
              hasWalletAddress ? "bg-emerald-500" : "bg-red-500"
            }`}
          />
          <Wallet className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium text-left">
            {hasWalletAddress
              ? `${userProfile?.walletAddress?.slice(
                  0,
                  6
                )}...${userProfile?.walletAddress?.slice(-4)}`
              : userProfile?.username || userProfile?.name || "Nguoi dung"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={onReconnect}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Kết nối lại
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDisconnect}>
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
