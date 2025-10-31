import { IUser } from "@/types";
import { API_ENDPOINTS, ApiResponse, ApiService } from "../api";

export class UserService {
  static async updateWalletAddress(data: {
    walletAddress: string;
    userId: string;
  }): Promise<ApiResponse<any>> {
    return ApiService.post(API_ENDPOINTS.USER.UPDATE_WALLET_ADDRESS, data);
  }

  static async updateUserProfile(data: any): Promise<ApiResponse<any>> {
    return ApiService.put(API_ENDPOINTS.USER.UPDATE_USER_PROFILE, data);
  }
}
