import { IUser } from "@/types";
import { API_ENDPOINTS, ApiResponse, ApiService } from "../api";

export class UserService {
  static async getBalance(walletAddress: string): Promise<ApiResponse<any>> {
    return ApiService.getWalletBalance(walletAddress);
  }

  static async updateWalletAddress(data: {
    walletAddress: string;
    userId: string;
  }): Promise<ApiResponse<any>> {
    return ApiService.post(API_ENDPOINTS.USER.CONNECT_WALLET, data);
  }

  static async updateUserProfile(data: any): Promise<ApiResponse<any>> {
    return ApiService.put(API_ENDPOINTS.USER.UPDATE_USER_PROFILE, data);
  }

  static async changePassword(data: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<any>> {
    return ApiService.post(API_ENDPOINTS.USER.CHANGE_PASSWORD, data);
  }

  static async changeName(data: {
    newName: string;
  }): Promise<ApiResponse<any>> {
    return ApiService.post(API_ENDPOINTS.USER.CHANGE_NAME, data);
  }
}
