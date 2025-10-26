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
  static async getWalletBalances(address: string, network: string): Promise<ApiResponse<WalletBalances>> {
    return ApiService.get<WalletBalances>(
      `${API_ENDPOINTS.GET_WALLET_BALANCES}?address=${address}&network=${network}`
    );
  }

  static async updateTransactionStatus(data: {
    transactionHash: string;
    status: string;
    blockchainTxHash?: string;
  }): Promise<ApiResponse<TransactionStatus>> {
    return ApiService.post<TransactionStatus>(API_ENDPOINTS.UPDATE_TRANSACTION_STATUS, data);
  }

  static async executeTokenPurchase(data: TokenPurchaseData): Promise<ApiResponse<any>> {
    return ApiService.post(API_ENDPOINTS.EXECUTE_TOKEN_PURCHASE, data);
  }
}

export default WalletService;
