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
  static async updateTransactionStatus(data: {
    transactionHash: string;
    status: string;
    blockchainTxHash?: string;
  }): Promise<ApiResponse<TransactionStatus>> {
    return ApiService.post<TransactionStatus>(
      API_ENDPOINTS.UPDATE_TRANSACTION_STATUS,
      data
    );
  }

  static async getWalletUsdtBalances(
    address: string
  ): Promise<ApiResponse<any>> {
    return ApiService.get(
      `${API_ENDPOINTS.GET_WALLET_USDT_BALANCE}/${address}`
    );
  }
  static async getWalletPolBalances(
    address: string
  ): Promise<ApiResponse<any>> {
    return ApiService.get(`${API_ENDPOINTS.GET_WALLET_POL_BALANCE}/${address}`);
  }
  static async getWalletCanBalances(
    address: string
  ): Promise<ApiResponse<any>> {
    return ApiService.get(`${API_ENDPOINTS.GET_WALLET_CAN_BALANCE}/${address}`);
  }
}

export default WalletService;
