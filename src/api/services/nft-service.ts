import { ApiService, API_ENDPOINTS } from "../api";
import type { ApiResponse } from "../api";

export interface NFT {
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

export interface MintNFTData {
  toAddress: string;
  tokenURI: string;
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
  walletAddress: string;
  collection: {
    name: string;
  };
  mysteryBoxId?: string;
  mintOnBlockchain: boolean;
  fromMysteryBox: boolean;
}

export interface TransferNFTData {
  tokenId: string;
  fromAddress: string;
  toAddress: string;
  transactionHash?: string;
}

export class NFTService {
  static async getNFTs(): Promise<ApiResponse<NFT[]>> {
    return ApiService.get<NFT[]>(API_ENDPOINTS.NFT.LIST);
  }
  static async getNFTsByOwner(address: string): Promise<ApiResponse<NFT[]>> {
    return ApiService.get<NFT[]>(API_ENDPOINTS.NFT.OWNER(address));
  }

  static async getNFTById(id: string): Promise<ApiResponse<NFT>> {
    return ApiService.get<NFT>(API_ENDPOINTS.NFT.DETAIL(id));
  }

  static async allNFTInMarketplace(data: any): Promise<ApiResponse<NFT>> {
    return ApiService.get<NFT>(API_ENDPOINTS.NFT.ALL, data);
  }

  static async transferNFT(data: TransferNFTData): Promise<ApiResponse<any>> {
    return ApiService.post(API_ENDPOINTS.NFT.TRANSFER, data);
  }
}

export default NFTService;
