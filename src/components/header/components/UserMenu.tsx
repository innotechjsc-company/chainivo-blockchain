import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/screens/investments-screen/hooks/useUserProfile";

interface UserMenuProps {
  userProfile: UserProfile | null;
  onSignOut: () => void;
}

export const UserMenu = ({ userProfile, onSignOut }: UserMenuProps) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hidden md:flex items-center space-x-2 h-auto py-2 cursor-pointer"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={userProfile?.avatar_url || ""} />
            <AvatarFallback>
              {userProfile?.name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">
            {userProfile?.name || "User"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/account")}>
          <User className="w-4 h-4 mr-2" />
          Quản lý tài khoản
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
