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

  // Nếu nhỏ hơn 1,000,000 (6 số 0) thì giữ nguyên format với dấu phẩy
  if (num < 1000000) {
    return num.toLocaleString("en-US");
  }

  // Nếu từ 1,000,000 (6 số 0) đến dưới 1,000,000,000 (9 số 0) → format thành "XM" hoặc "X.XM" (million)
  if (num >= 1000000 && num < 1000000000) {
    const millions = num / 1000000;
    // Làm tròn đến 1 chữ số thập phân, nhưng nếu là số nguyên thì không hiển thị .0
    const rounded = Math.round(millions * 10) / 10;
    return rounded % 1 === 0 ? `${rounded} ` : `${rounded.toFixed(1)} Triệu`;
  }

  // Nếu từ 1,000,000,000 (9 số 0) đến dưới 1,000,000,000,000 (12 số 0) → format thành "XB" hoặc "X.XB" (billion)
  if (num >= 1000000000 && num < 1000000000000) {
    const billions = num / 1000000000;
    // Làm tròn đến 1 chữ số thập phân, nhưng nếu là số nguyên thì không hiển thị .0
    const rounded = Math.round(billions * 10) / 10;
    return rounded % 1 === 0 ? `${rounded} Tỷ` : `${rounded.toFixed(1)} Tỷ`;
  }

  // Nếu từ 1,000,000,000,000 (12 số 0) đến dưới 1,000,000,000,000,000 (15 số 0) → format thành "XT" hoặc "X.XT" (trillion)
  if (num >= 1000000000000 && num < 1000000000000000) {
    const trillions = num / 1000000000000;
    // Làm tròn đến 1 chữ số thập phân, nhưng nếu là số nguyên thì không hiển thị .0
    const rounded = Math.round(trillions * 10) / 10;
    return rounded % 1 === 0
      ? `${rounded} Nghìn tỷ`
      : `${rounded.toFixed(1)} Nghìn tỷ`;
  }

  // Nếu từ 1,000,000,000,000,000 (15 số 0) trở lên → format thành "XQ" hoặc "X.XQ" (quadrillion)
  const quadrillions = num / 1000000000000000;
  const rounded = Math.round(quadrillions * 10) / 10;
  return rounded % 1 === 0
    ? `${rounded} Triệu tỷ`
    : `${rounded.toFixed(1)} Triệu tỷ`;
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
