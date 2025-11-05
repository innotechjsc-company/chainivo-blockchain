import { ApiService, API_ENDPOINTS } from "../api";
import type { ApiResponse, ApiTransactionHistoryResponse } from "../api";

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
    return ApiService.get<NFT[]>(API_ENDPOINTS.NFT.MY_NFT);
  }

  static async getNFTById(id: string): Promise<ApiResponse<NFT>> {
    return ApiService.get<NFT>(API_ENDPOINTS.NFT.DETAIL(id));
  }

  static async getNFTByTemplateId(id: string): Promise<ApiResponse<NFT>> {
    return ApiService.get<NFT>(API_ENDPOINTS.NFT.DETAIL_TEMPLATE(id));
  }

  static async getNFTInvestmentById(id: string): Promise<ApiResponse<NFT>> {
    return ApiService.get<NFT>(API_ENDPOINTS.NFT.DETAIL_INVESTMENT_NFT(id));
  }

  static async allNFTInMarketplace(data?: any): Promise<ApiResponse<NFT>> {
    return ApiService.get<NFT>(API_ENDPOINTS.NFT.LIST, data);
  }

  static async transferNFT(data: {
    nftId: string;
    transactionHash: string;
  }): Promise<ApiResponse<any>> {
    return ApiService.post(API_ENDPOINTS.NFT.BUY, data);
  }
  static async pushComment(data: {
    nftId: any;
    content: any;
    replyTo?: any;
  }): Promise<ApiResponse<any>> {
    return ApiService.post(API_ENDPOINTS.NFT.COMMENT, data);
  }
  static async getComment(nftId: string): Promise<ApiResponse<any>> {
    return ApiService.get(`${API_ENDPOINTS.NFT.COMMENT}?nftId=${nftId}`);
  }
  static async likeNft(nftId: string): Promise<ApiResponse<any>> {
    return ApiService.post(`${API_ENDPOINTS.NFT.LIKE}`, { nftId });
  }
  static async unlikeNft(nftId: string): Promise<ApiResponse<any>> {
    return ApiService.post(`${API_ENDPOINTS.NFT.UNLIKE}`, { nftId });
  }
  static async getP2PList(data?: any): Promise<ApiResponse<any[]>> {
    return ApiService.get<any[]>(API_ENDPOINTS.NFT.P2P_LIST, data);
  }
  static async buyP2PList(data?: any): Promise<ApiResponse<any[]>> {
    return ApiService.post<any[]>(API_ENDPOINTS.NFT.BUY_P2P, data);
  }
  static async buyP2PHistoryTransaction(
    id: string
  ): Promise<ApiResponse<any[]>> {
    return ApiService.get<any[]>(
      API_ENDPOINTS.NFT.BUY_P2P_HISTORY_TRANSACTION(id)
    );
  }
  static async getNFTInvestmentList(): Promise<ApiResponse<any[]>> {
    return ApiService.get<any[]>(API_ENDPOINTS.NFT.LIST_INVESTMENT);
  }
  static async buyNFTInvestmentList(data?: any): Promise<ApiResponse<any[]>> {
    return ApiService.post<any[]>(API_ENDPOINTS.NFT.BUY_INVESTMENT_NFT, data);
  }
  static async investmentNFTHistoryTransaction(
    id: string
  ): Promise<ApiTransactionHistoryResponse<any[]>> {
    return ApiService.get<any[]>(
      API_ENDPOINTS.NFT.INVESTMENT_NFT_HISTORY_TRANSACTION(id)
    );
  }
}

export default NFTService;
