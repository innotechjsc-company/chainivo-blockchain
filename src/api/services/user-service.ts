import { IUser } from "@/types";
import { API_ENDPOINTS, ApiResponse, ApiService } from "../api";

export class UserService {
  static async updateWalletAddress(data: {
    walletAddress: string;
  }): Promise<ApiResponse<any>> {
    return ApiService.post(API_ENDPOINTS.USER.UPDATE_WALLET_ADDRESS, data);
  }
}
