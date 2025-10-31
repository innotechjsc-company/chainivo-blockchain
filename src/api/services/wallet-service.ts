import { ApiService, API_ENDPOINTS } from "../api";
import type { ApiResponse } from "../api";

export interface WalletBalances {
  address: string;
  network: string;
  balances: {
    native: number;
    usdt: number;
    can: number;
    pol?: number;
  };
  timestamp: string;
}

export interface TransactionStatus {
  transactionHash: string;
  status: string;
  blockchainTxHash?: string;
  confirmations?: number;
  timestamp?: string;
}

export interface TokenPurchaseData {
  phaseId: number;
  amount: number;
  walletAddress: string;
  network: string;
  usdtTransactionHash?: string;
}

export class WalletService {
  static async getWalletUsdtBalances(
    address: string
  ): Promise<ApiResponse<any>> {
    return ApiService.get(
      `${API_ENDPOINTS.BALANCE.GET_BALANCE}/${address}?token=USDT`
    );
  }
  static async getWalletPolBalances(
    address: string
  ): Promise<ApiResponse<any>> {
    return ApiService.get(
      `${API_ENDPOINTS.BALANCE.GET_BALANCE}/${address}?token=POL`
    );
  }
  static async getWalletCanBalances(
    address: string
  ): Promise<ApiResponse<any>> {
    return ApiService.get(
      `${API_ENDPOINTS.BALANCE.GET_BALANCE}/${address}?token=CAN`
    );
  }
}

export default WalletService;
