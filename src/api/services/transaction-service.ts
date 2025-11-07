import { ApiService, API_ENDPOINTS } from '../api';
import type { ApiResponse } from '../api';
import type {
  TransactionHistoryResponse,
  TransactionType,
  Currency,
} from '@/types/TransactionHistory';

// Query params cho API
export interface GetTransactionHistoryParams {
  page?: number;
  limit?: number;
  transactionType?: TransactionType;
  walletAddress?: string;
}

export class TransactionService {
  /**
   * Lay danh sach lich su giao dich
   * @param params - Query parameters (page, limit, transactionType, walletAddress)
   * @returns Promise<ApiResponse<TransactionHistoryResponse>>
   */
  static async getTransactionHistory(
    params?: GetTransactionHistoryParams
  ): Promise<ApiResponse<TransactionHistoryResponse>> {
    return ApiService.get<TransactionHistoryResponse>(
      API_ENDPOINTS.TRANSACTION.LIST,
      params
    );
  }
}
