import { API_ENDPOINTS, ApiResponse, ApiService } from "../api";

export interface Notification {
  _id: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  owner: string;
  creator: string;
  price?: number;
  isForSale: boolean;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export class NotificationService {
  static async getMyNotifications(): Promise<ApiResponse<Notification[]>> {
    return ApiService.get(API_ENDPOINTS.NOTIFICATION.GET_MY_NOTIFICATIONS);
  }
  static async readAllNotifications(userId: string): Promise<ApiResponse<any>> {
    return ApiService.patch(API_ENDPOINTS.NOTIFICATION.READ_ALL_NOTIFICATIONS, {
      userId,
    });
  }
  static async readNotification(id: string): Promise<ApiResponse<any>> {
    return ApiService.patch(API_ENDPOINTS.NOTIFICATION.READ_NOTIFICATION(id));
  }
}
