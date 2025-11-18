import { ApiService, API_ENDPOINTS } from '../api';
import type { ApiResponse } from '../api';
import type {
  Rank,
  RankListResponse,
  BuyRankData,
  BuyRankResponse,
  GetRanksParams,
} from '@/types/Rank';

/**
 * RankService
 * Service để quản lý các API calls liên quan đến Rank/Membership tiers
 */
export class RankService {
  /**
   * Lấy danh sách các rank
   * GET /api/rank/list
   */
  static async getRanks(
    params?: GetRanksParams
  ): Promise<ApiResponse<RankListResponse>> {
    return ApiService.get<RankListResponse>(API_ENDPOINTS.RANK.LIST, params);
  }

  /**
   * Mua rank cho user
   * POST /api/rank/buy
   */
  static async buyRank(
    data: BuyRankData
  ): Promise<ApiResponse<BuyRankResponse>> {
    return ApiService.post<BuyRankResponse>(API_ENDPOINTS.RANK.BUY, data);
  }
}

export default RankService;

// Export types để dễ sử dụng
export type { Rank, BuyRankData, BuyRankResponse, GetRanksParams };
