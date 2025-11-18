import {
  API_ENDPOINTS,
  ApiResponse,
  ApiService,
  UpdateProfileResponse,
  AvatarObject,
  UserMeResponse,
  UserProfile,
  RankObject,
} from "../api";
import { config } from "../config";

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

  static async getMe(): Promise<ApiResponse<any>> {
    return ApiService.get(API_ENDPOINTS.USER.GET_ME);
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

  static async updateProfile(data: {
    name?: string;
    avatar?: string; // Media ID from MediaService.uploadAvatar()
  }): Promise<ApiResponse<UpdateProfileResponse>> {
    const response = await ApiService.patch<UpdateProfileResponse>(
      API_ENDPOINTS.USER.UPDATE_PROFILE,
      data
    );

    return response;
  }

  /**
   * Lay thong tin user hien tai tu backend voi avatar va rank populated
   * Su dung JWT token de xac dinh user
   * Call toi /api/users/me voi depth=2 de populate avatar va rank
   * @returns User profile voi avatarUrl va rank da duoc parse
   */
  static async getCurrentUserProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      // Call /api/users/me voi depth=2 de populate avatar va rank relationships
      const response = await ApiService.get<UserMeResponse>(
        `${API_ENDPOINTS.USER.GET_ME}?depth=2`
      );

      // PayloadCMS /api/users/me tra ve truc tiep object, KHONG wrap trong {success, data}
      // Check neu co .user (PayloadCMS format) hoac .success (wrapped format)
      const hasData = (response as any).user || (response.success && response.data);

      if (hasData) {
        // PayloadCMS co the tra ve { user: {...} } hoac { success, data: {...} }
        const userData = (response as any).user || (response.data as any)?.user || response.data;

        // Parse avatarUrl tu avatar object hoac string
        let avatarUrl = "";

        if (userData.avatar) {
          if (typeof userData.avatar === "string") {
            // Neu la string ID, khong co URL
            avatarUrl = "";
          } else {
            // Neu la object, lay URL
            const rawUrl = userData.avatar.url || "";

            // Construct full URL neu la relative path
            if (rawUrl) {
              if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
                // Da la absolute URL
                avatarUrl = rawUrl;
              } else {
                // La relative path, them base URL
                avatarUrl = `${config.API_BASE_URL}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;
              }
            }
          }
        }

        // Parse rank object neu co
        let rank: RankObject | undefined;
        let rankId: string | undefined;
        if (userData.rank) {
          if (typeof userData.rank === "string") {
            // Neu la string ID (chua populate)
            rankId = userData.rank;
          } else {
            // Neu la object (da populate)
            rank = userData.rank;
          }
        }

        // Tra ve UserProfile da parse
        const userProfile: UserProfile = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatarUrl,
          bio: userData.bio,
          walletAddress: userData.walletAddress,
          role: userData.role,
          isEmailVerified: userData.isEmailVerified,
          isKYCVerified: userData.isKYCVerified,
          isWalletVerified: userData.isWalletVerified,
          isActive: userData.isActive,
          isSuspended: userData.isSuspended,
          suspensionReason: userData.suspensionReason,
          lastLogin: userData.lastLogin,
          refCode: userData.refCode,
          rank,
          rankId,
          points: userData.points,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        };

        return {
          success: true,
          data: userProfile,
        };
      }

      return response as any;
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      return {
        success: false,
        error: error?.message || "Loi khi lay thong tin user",
      };
    }
  }

  /**
   * Lay thong tin user day du tu PayloadCMS voi avatar object
   * @deprecated Su dung getCurrentUserProfile() thay the
   * @param userId - ID cua user
   * @returns User profile voi avatarUrl da duoc parse tu avatar.url
   */
  static async getUserProfile(userId: string): Promise<
    ApiResponse<{
      id: string;
      email: string;
      name?: string;
      avatarUrl?: string; // Da parse tu avatar.url
      walletAddress?: string;
      role?: string;
      createdAt?: string;
      updatedAt?: string;
    }>
  > {
    try {
      const response = await ApiService.get<PayloadUserResponse>(
        `/api/users/${userId}?depth=1`
      );

      if (response.success && response.data) {
        // Parse avatarUrl voi full URL
        const rawUrl = response.data.avatar?.url || "";
        let avatarUrl = "";

        if (rawUrl) {
          if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
            avatarUrl = rawUrl;
          } else {
            avatarUrl = `${config.API_BASE_URL}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;
          }
        }

        return {
          success: true,
          data: {
            id: response.data.id,
            email: response.data.email,
            name: response.data.name,
            avatarUrl,
            walletAddress: response.data.walletAddress,
            role: response.data.role,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
          },
        };
      }

      return response as any;
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      return {
        success: false,
        error: error?.message || "Loi khi lay thong tin user",
      };
    }
  }
}
