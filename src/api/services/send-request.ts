import { ApiService, API_ENDPOINTS } from "../api";
import type { ApiResponse } from "../api";

export interface SendDigitizationRequestData {
  name: string; // Tên tài sản (required)
  description: string; // Mô tả tài sản (required)
  image: string; // ID của media (hình ảnh) (required)
  documents?: string[]; // Mảng ID của media (tài liệu) (optional)
  price: number; // Giá tài sản (required)
  availablePercentage: number; // Phần trăm số cổ phần mở bán (required)
  address: string; // Vị trí đặt tài sản (required)
  senderName: string; // Tên người gửi (required)
  senderPhoneNumber: string; // Số điện thoại người gửi (required)
  senderEmail: string; // Email người gửi (required)
}

export interface DigitizationRequestResponse {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
}

export class SendRequestService {
  static async sendRequest(
    data: SendDigitizationRequestData
  ): Promise<ApiResponse<DigitizationRequestResponse>> {
    return ApiService.post<DigitizationRequestResponse>(
      API_ENDPOINTS.DIGITAL_REQUEST.LIST,
      data
    );
  }
}

export default SendRequestService;
