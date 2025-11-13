import { ApiService, API_ENDPOINTS } from "../api";
import type { ApiResponse } from "../api";

export interface DigitizingBenefit {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  image: string;
}

export interface GetBenefitsParams {
  highlightOnly?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export class BenefitsDigiService {
  static async getBenefits(
    params?: GetBenefitsParams
  ): Promise<ApiResponse<DigitizingBenefit[]>> {
    return ApiService.get<DigitizingBenefit[]>(
      API_ENDPOINTS.BENEFITS.LIST,
      params
    );
  }
  static async getMyDigitizingRequests(): Promise<ApiResponse<any>> {
    return ApiService.get<any>(API_ENDPOINTS.DIGITAL_REQUEST.DETAIL);
  }
  static async confirmDigitizingRequest(
    requestId: string,
    transactionHash: string
  ): Promise<ApiResponse<any>> {
    return ApiService.post<any>(API_ENDPOINTS.DIGITAL_REQUEST.CONFIRM, {
      requestId,
      transactionHash,
    });
  }
}

export default BenefitsDigiService;
