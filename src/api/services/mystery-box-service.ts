import { ApiService, API_ENDPOINTS } from "../api";
import type { ApiResponse } from "../api";

export interface MysteryBox {
  id: string;
  name: string;
  description: string;
  price: number;
  tier: string;
  image: string;
  totalSupply: number;
  remainingSupply: number;
  isActive: boolean;
  possibleRewards: Array<{
    type: string;
    value: number;
    probability: number;
  }>;
}

export interface PurchaseBoxData {
  boxId: string;
  quantity: number;
  walletAddress: string;
  paymentMethod: string;
  transactionHash?: string;
}

export interface OpenBoxData {
  boxId: string;
  walletAddress: string;
  transactionHash?: string;
}

export interface BoxReward {
  type: string;
  value: number;
  tokenId?: string;
  nftData?: any;
}

export class MysteryBoxService {
  static async getMysteryBoxes(): Promise<ApiResponse<MysteryBox[]>> {
    return ApiService.get<MysteryBox[]>(API_ENDPOINTS.MYSTERY_BOX.LIST);
  }

  static async purchaseBox(data: PurchaseBoxData): Promise<ApiResponse<any>> {
    return ApiService.post(API_ENDPOINTS.MYSTERY_BOX.PURCHASE, data);
  }

  static async openBox(data: OpenBoxData): Promise<ApiResponse<BoxReward>> {
    return ApiService.post<BoxReward>(API_ENDPOINTS.MYSTERY_BOX.OPEN, data);
  }
}

export default MysteryBoxService;
