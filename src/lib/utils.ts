import { LocalStorageService } from "@/services/LocalStorageService";
import { RootState, useAppDispatch, useAppSelector } from "@/stores";
import { setWalletBalance } from "@/stores/walletSlice";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLevelBadge(level: string) {
  switch (level) {
    case "1":
      return "Thường";
    case "2":
      return "Bạc";
    case "3":
      return "Vàng";
    case "4":
      return "Bạch kim";
    case "5":
      return "Kim cương";
    default:
      return "Không rõ";
  }
}

export function getNFTType(type: string) {
  switch (type) {
    case "normal":
      return "NFT thường";
    case "rank":
      return "NFT hạng";
    case "mysteryBox":
      return "NFT hộp bí ẩn";
  }
}

export const formatAmount = (value: unknown) => {
  const num = Number(value || 0);
  if (Number.isNaN(num)) return String(value ?? "-");
  return num.toLocaleString("en-US");
};

export const autoConnect = async () => {
  try {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state: RootState) => state.auth.user);
    if (!user?.walletAddress) return;
    const eth = (window as any)?.ethereum;
    if (!eth?.isMetaMask) return;

    // Check existing accounts
    let accounts: string[] = await eth.request({ method: "eth_accounts" });

    if (!accounts || accounts.length === 0) {
      // Prompt connect if not yet connected
      try {
        await eth.request({ method: "eth_requestAccounts" });
        debugger;
        accounts = await eth.request({ method: "eth_accounts" });
      } catch (_err) {
        return;
      }
    }

    if (
      accounts?.[0] &&
      accounts[0].toLowerCase() === user.walletAddress.toLowerCase()
    ) {
      LocalStorageService.setWalletConnectionStatus(true);
      // Optionally refresh balances
      dispatch(setWalletBalance(user.walletAddress));
    }
  } catch (_e) {
    // ignore auto-connect errors
  }
};
