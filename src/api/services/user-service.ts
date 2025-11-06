import { API_ENDPOINTS, ApiResponse, ApiService, UpdateProfileResponse, AvatarObject } from "../api";

// Interface cho response tu PayloadCMS GET /api/users/{userId}
interface PayloadUserResponse {
  id: string;
  email: string;
  name?: string;
  avatar?: AvatarObject;
  walletAddress?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

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

  static async updateProfile(
    formData: FormData
  ): Promise<ApiResponse<UpdateProfileResponse>> {
    const response = await ApiService.patchFormData<UpdateProfileResponse>(
      API_ENDPOINTS.USER.UPDATE_PROFILE,
      formData
    );

    // DEBUG: Check raw response tu backend
    console.log('[DEBUG UserService.updateProfile] Raw response:', response);
    console.log('[DEBUG UserService.updateProfile] response.success:', response.success);
    console.log('[DEBUG UserService.updateProfile] response.data:', response.data);
    console.log('[DEBUG UserService.updateProfile] response.data type:', typeof response.data);

    return response;
  }

  /**
   * Lay thong tin user hien tai tu backend voi avatar populated
   * Su dung JWT token de xac dinh user
   * @returns User profile voi avatarUrl da duoc parse tu avatar.url
   */
  static async getCurrentUserProfile(): Promise<ApiResponse<{
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
    walletAddress?: string;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
  }>> {
    try {
      console.log('[DEBUG getCurrentUserProfile] Fetching current user profile from backend');

      // Goi backend custom endpoint voi JWT auth
      const response = await ApiService.get<{
        id: string;
        email: string;
        name?: string;
        avatarUrl?: string;
        walletAddress?: string;
        role?: string;
        createdAt?: string;
        updatedAt?: string;
      }>(API_ENDPOINTS.USER.GET_PROFILE);

      console.log('[DEBUG getCurrentUserProfile] Raw response:', response);
      console.log('[DEBUG getCurrentUserProfile] response.data:', response.data);
      console.log('[DEBUG getCurrentUserProfile] response.data.avatarUrl:', response.data?.avatarUrl);

      return response;
    } catch (error: any) {
      console.error('[DEBUG getCurrentUserProfile] Error:', error);
      return {
        success: false,
        error: error?.message || 'Loi khi lay thong tin user',
      };
    }
  }

  /**
   * Lay thong tin user day du tu PayloadCMS voi avatar object
   * @deprecated Su dung getCurrentUserProfile() thay the
   * @param userId - ID cua user
   * @returns User profile voi avatarUrl da duoc parse tu avatar.url
   */
  static async getUserProfile(userId: string): Promise<ApiResponse<{
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string; // Da parse tu avatar.url
    walletAddress?: string;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
  }>> {
    try {
      console.log('[DEBUG getUserProfile] Fetching profile for userId:', userId);

      // Goi API PayloadCMS voi depth=1 de lay avatar object day du
      const response = await ApiService.get<PayloadUserResponse>(
        `/api/users/${userId}?depth=1`
      );

      console.log('[DEBUG getUserProfile] Raw response:', response);
      console.log('[DEBUG getUserProfile] response.data:', response.data);
      console.log('[DEBUG getUserProfile] response.data.avatar:', response.data?.avatar);

      if (response.success && response.data) {
        // Parse avatar.url thanh avatarUrl string de frontend su dung de dang
        const avatarUrl = response.data.avatar?.url || '';

        console.log('[DEBUG getUserProfile] Parsed avatarUrl:', avatarUrl);

        return {
          success: true,
          data: {
            id: response.data.id,
            email: response.data.email,
            name: response.data.name,
            avatarUrl, // String URL thay vi object
            walletAddress: response.data.walletAddress,
            role: response.data.role,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
          },
        };
      }

      console.warn('[DEBUG getUserProfile] Response not successful or no data');
      return response as any;
    } catch (error: any) {
      console.error('[DEBUG getUserProfile] Error:', error);
      return {
        success: false,
        error: error?.message || 'Loi khi lay thong tin user',
      };
    }
  }
}
