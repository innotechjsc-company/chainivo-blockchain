import { ApiService, API_ENDPOINTS } from "../api";
import type { ApiResponse } from "../api";

export interface SystemFeeConfig {
  id?: string;
  _id?: string;
  name?: string;
  key?: string;
  value?: number;
  percentage?: number;
  currency?: string;
  description?: string;
  [key: string]: unknown;
}

export type GetSystemFeeResponse = SystemFeeConfig | SystemFeeConfig[];

export class FeeService {
  static async getSystemFees(): Promise<ApiResponse<GetSystemFeeResponse>> {
    return ApiService.get<GetSystemFeeResponse>(API_ENDPOINTS.FEE.GET_FEE);
  }
}

export default FeeService;
