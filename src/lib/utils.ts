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
    case "investment":
      return "NFT đầu tư";
    default:
      return "—";
  }
}

export const formatAmount = (valueInput: unknown) => {
  const value = Number(valueInput || 0);
  const decimals = 0;
  // Xu ly gia tri null/undefined
  if (value === null || value === undefined) return "0";
  if (isNaN(value)) return "0";

  const absValue = Math.abs(value);
  const isNegative = value < 0;

  // Neu >= 1 billion: rut gon thanh B
  if (absValue >= 1_000_000_000) {
    const billions = absValue / 1_000_000_000;
    // Format phan so truoc, roi them 'B'
    const numberPart =
      billions >= 10
        ? Math.floor(billions)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : billions.toFixed(1);
    return isNegative ? `-${numberPart}B` : `${numberPart}B`;
  }

  // Neu >= 1 million: rut gon thanh M
  if (absValue >= 1_000_000) {
    const millions = absValue / 1_000_000;
    // Format phan so truoc, roi them 'M'
    const numberPart =
      millions >= 10
        ? Math.floor(millions)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : millions.toFixed(1);
    return isNegative ? `-${numberPart}M` : `${numberPart}M`;
  }

  // Neu >= 10,000: rut gon thanh K
  if (absValue >= 10_000) {
    const thousands = absValue / 1_000;
    // Format phan so truoc, roi them 'K'
    const numberPart =
      thousands >= 10
        ? Math.floor(thousands)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : thousands.toFixed(1);
    return isNegative ? `-${numberPart}K` : `${numberPart}K`;
  }

  // Neu < 10,000: format day du voi dau phan cach
  const fixedValue =
    decimals > 0 ? absValue.toFixed(decimals) : Math.round(absValue);
  const [integerPart, decimalPart] = fixedValue.toString().split(".");

  // Them dau phan cach hang nghin (,) cho phan nguyen
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Neu co phan thap phan, them dau cham (.)
  let result = decimalPart
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;

  return isNegative ? `-${result}` : result;
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
