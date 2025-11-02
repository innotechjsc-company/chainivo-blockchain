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
  mysteryBoxId: string;
  // transactionHash?: string;
}

export interface NFTImage {
  id: string;
  url: string;
  alt: string;
  filename: string;
  width: number;
  height: number;
  thumbnailURL: string | null;
}

export interface NFTReward {
  id: string;
  name: string;
  description: string;
  type: string;
  level: string;
  price: number;
  status: string;
  isActive: boolean;
  isFeatured: boolean;
  image: NFTImage;
  metadata: any;
}

export interface TokenReward {
  rewardType: "token";
  tokenQuantity: number;
}

export interface NFTRewardData {
  rewardType: "nft";
  nft: NFTReward;
}

export type BoxReward = TokenReward | NFTRewardData;

export interface OpenBoxResponse {
  mysteryBox: {
    id: string;
    name: string;
    price: number;
  };
  reward: BoxReward;
  message: string;
}

export class MysteryBoxService {
  static async getMysteryBoxes(): Promise<ApiResponse<MysteryBox[]>> {
    return ApiService.get<MysteryBox[]>(API_ENDPOINTS.MYSTERY_BOX.LIST);
  }

  static async getBoxDetail(id: string): Promise<ApiResponse<MysteryBox>> {
    return ApiService.get<MysteryBox>(API_ENDPOINTS.MYSTERY_BOX.DETAIL(id));
  }

  static async purchaseBox(data: PurchaseBoxData): Promise<ApiResponse<any>> {
    return ApiService.post(API_ENDPOINTS.MYSTERY_BOX.PURCHASE, data);
  }

  static async openBox(data: OpenBoxData): Promise<ApiResponse<OpenBoxResponse>> {
    return ApiService.post<OpenBoxResponse>(API_ENDPOINTS.MYSTERY_BOX.BUY, data);
  }
}

export default MysteryBoxService;
