import { ApiService, API_ENDPOINTS } from "../api";
import type { ApiResponse, ApiTransactionHistoryResponse } from "../api";
import type {
  MyNFTsResponse,
  APIRewardItem,
  TokenReward,
  NFTReward,
} from "@/types/NFT";

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

export interface GetNFTOwnershipsParams {
  page?: number;
  limit?: number;
  sortBy?:
    | "name"
    | "price"
    | "viewsCount"
    | "likesCount"
    | "createdAt"
    | "publishedAt";
  sortOrder?: "asc" | "desc";
  isSale?: boolean;
}

// Params cho API /api/nft/my-nft
export interface GetMyNFTsParams {
  page?: number;
  limit?: number;
  isSale?: boolean;
  ownerAddress?: string;
  sortBy?:
    | "name"
    | "price"
    | "viewsCount"
    | "likesCount"
    | "createdAt"
    | "publishedAt";
  sortOrder?: "asc" | "desc";
}

// Helper function: Transform rewards tu API format sang component format
function transformRewards(
  apiRewards: APIRewardItem[] | undefined,
  nftCurrency: string = "can"
):
  | {
      tokens?: TokenReward[];
      nfts?: NFTReward[];
    }
  | undefined {
  if (!apiRewards || !Array.isArray(apiRewards) || apiRewards.length === 0) {
    return undefined;
  }

  const tokens: TokenReward[] = [];
  const nfts: NFTReward[] = [];

  apiRewards.forEach((reward) => {
    if (
      reward.rewardType === "token" &&
      reward.tokenMinQuantity &&
      reward.tokenMaxQuantity
    ) {
      tokens.push({
        currency: nftCurrency as any, // Lay currency tu NFT
        minAmount: reward.tokenMinQuantity,
        maxAmount: reward.tokenMaxQuantity,
        probability: undefined, // API chua co field nay
      });
    } else if (reward.rewardType === "nft" && reward.rank) {
      const imageUrl = reward.nftTemplate?.image
        ? typeof reward.nftTemplate.image === "string"
          ? reward.nftTemplate.image
          : reward.nftTemplate.image?.url || ""
        : "";

      nfts.push({
        id: reward.id,
        name: reward.nftTemplate?.name || "NFT Reward",
        image: imageUrl,
        rarity: reward.rank as any, // rank la string "1", "2", "3"...
        probability: undefined, // API chua co field nay
      });
    }
  });

  return {
    tokens: tokens.length > 0 ? tokens : undefined,
    nfts: nfts.length > 0 ? nfts : undefined,
  };
}

// Helper function: Check xem mystery box co the mo duoc khong
function checkIsOpenable(apiRewards: APIRewardItem[] | undefined): boolean {
  if (!apiRewards || !Array.isArray(apiRewards) || apiRewards.length === 0) {
    return false;
  }
  // Neu co it nhat 1 reward isOpenable = true thi mystery box co the mo
  return apiRewards.some((reward) => reward.isOpenable === true);
}

export class NFTService {
  static async getNFTs(): Promise<ApiResponse<NFT[]>> {
    return ApiService.get<NFT[]>(API_ENDPOINTS.NFT.LIST);
  }
  static async getNFTsByOwner(
    params?: GetMyNFTsParams
  ): Promise<ApiResponse<MyNFTsResponse["data"]>> {
    const res = await ApiService.get<any>(API_ENDPOINTS.NFT.MY_NFT, params);
    if (!res.success || !res.data) {
      return res as ApiResponse<MyNFTsResponse["data"]>;
    }

    // Handle ca 2 format: data.ownerships (cu) hoac data.nfts (moi)
    let rawNFTs: any[] = [];
    if (Array.isArray(res.data.ownerships)) {
      rawNFTs = res.data.ownerships.map((o: any) => ({
        nft: o?.nft || {},
        user: o?.user,
        metadata: o?.metadata,
      }));
    } else if (Array.isArray(res.data.nfts)) {
      rawNFTs = res.data.nfts.map((nft: any) => ({
        nft: nft,
        user: null,
        metadata: null,
      }));
    }

    const nfts = rawNFTs.map((item: any) => {
      const nft = item.nft || {};
      const imageObj = nft?.image;

      // Extract image URL
      let imageUrl = "";
      if (typeof imageObj === "string") {
        imageUrl = imageObj;
      } else if (imageObj && typeof imageObj === "object") {
        imageUrl = imageObj.url || "";
      }

      return {
        id: nft.id || nft._id,
        name: nft.name || "",
        description: nft.description || "",
        image: imageUrl,
        price: typeof nft.price === "number" ? nft.price : 0,
        salePrice: nft.isSale
          ? typeof nft.salePrice === "number"
            ? nft.salePrice
            : typeof nft.pricePerShare === "number"
            ? nft.pricePerShare
            : typeof nft.price === "number"
            ? nft.price
            : null
          : null,
        walletAddress: nft.walletAddress || "",
        owner: item?.user?.id || null,
        isSale: !!nft.isSale,
        isActive: !!nft.isActive,
        isMinted: !!nft.isMinted,
        isStaking: !!nft.isStaking,
        type: nft.type,
        level: nft.level,
        currency: nft.currency,
        viewsCount: typeof nft.viewsCount === "number" ? nft.viewsCount : 0,
        likesCount: typeof nft.likesCount === "number" ? nft.likesCount : 0,
        isLike: !!nft.isLike,
        createdAt: nft.createdAt,
        publishedAt: nft.investmentStartDate || nft.createdAt,
        updatedAt: nft.updatedAt,
        purchaseDate: item.metadata?.purchaseDate || nft.createdAt,

        // Investment NFT fields
        isFractional: nft.isFractional,
        totalShares: nft.totalShares,
        soldShares: nft.soldShares,
        availableShares: nft.availableShares,
        totalInvestors: nft.totalInvestors,
        investmentStartDate: nft.investmentStartDate,
        investmentEndDate: nft.investmentEndDate,
        pricePerShare: nft.pricePerShare,

        // Mystery Box NFT fields
        isOpenable:
          nft.type === "mysteryBox" ? checkIsOpenable(nft.rewards) : undefined,
        rewards:
          nft.type === "mysteryBox"
            ? transformRewards(nft.rewards, nft.currency)
            : undefined,

        // General flags
        isFeatured: !!nft.isFeatured,
      } as MyNFTsResponse["data"]["nfts"][number];
    });

    const p = res.data.pagination || {};
    const pagination = {
      page: p.page ?? 1,
      limit: p.limit ?? nfts.length,
      total: p.totalDocs ?? p.total ?? nfts.length,
      totalPages: p.totalPages ?? 1,
      hasNextPage: !!p.hasNextPage,
      hasPrevPage: !!p.hasPrevPage,
    } as MyNFTsResponse["data"]["pagination"];

    return {
      success: true,
      data: { nfts, pagination },
    };
  }

  static async getNFTById(id: string): Promise<ApiResponse<NFT>> {
    return ApiService.get<NFT>(API_ENDPOINTS.NFT.DETAIL(id));
  }

  static async getInfoNFT(): Promise<ApiResponse<NFT>> {
    return ApiService.get<NFT>(API_ENDPOINTS.NFT.INFO);
  }

  // So huu NFT (ownership)
  static async getNFTOwnerships(
    params?: GetNFTOwnershipsParams
  ): Promise<ApiResponse<MyNFTsResponse["data"]>> {
    const res = await ApiService.get<any>(
      API_ENDPOINTS.NFT.MY_OWNERSHIP,
      params
    );
    if (!res.success || !res.data)
      return res as ApiResponse<MyNFTsResponse["data"]>;

    const ownerships = Array.isArray(res.data.ownerships)
      ? res.data.ownerships
      : [];

    const nfts = ownerships.map((o: any) => {
      const nft = o?.nft || {};
      const imageObj = nft?.image;
      const imageUrl =
        typeof imageObj === "string" ? imageObj : imageObj?.url || "";
      return {
        id: nft.id || nft._id,
        name: nft.name || "",
        description: nft.description || "",
        image: imageUrl,
        price: typeof nft.price === "number" ? nft.price : 0,
        salePrice: nft.isSale
          ? typeof nft.pricePerShare === "number"
            ? nft.pricePerShare
            : typeof nft.price === "number"
            ? nft.price
            : null
          : null,
        walletAddress: nft.walletAddress || "",
        owner: o?.user?.id || null,
        isSale: !!nft.isSale,
        isActive: !!nft.isActive,
        type: nft.type,
        level: nft.level,
        currency: nft.currency,
        viewsCount: typeof nft.viewsCount === "number" ? nft.viewsCount : 0,
        likesCount: typeof nft.likesCount === "number" ? nft.likesCount : 0,
        isLike: !!nft.isLike,
        createdAt: nft.createdAt,
        publishedAt: nft.investmentStartDate || nft.createdAt,
        updatedAt: nft.updatedAt,
        purchaseDate: ownerships.metadata?.purchaseDate || nft.createdAt,

        // Investment NFT fields
        isFractional: nft.isFractional,
        totalShares: nft.totalShares,
        soldShares: nft.soldShares,
        availableShares: nft.availableShares,
        totalInvestors: nft.totalInvestors,
        investmentStartDate: nft.investmentStartDate,
        investmentEndDate: nft.investmentEndDate,
        pricePerShare: nft.pricePerShare,

        // Mystery Box NFT fields
        isOpenable:
          nft.type === "mysteryBox" ? checkIsOpenable(nft.rewards) : undefined,
        rewards:
          nft.type === "mysteryBox"
            ? transformRewards(nft.rewards, nft.currency)
            : undefined,

        // General flags
        isFeatured: nft.isFeatured,
      } as MyNFTsResponse["data"]["nfts"][number];
    });

    const p = res.data.pagination || {};
    const pagination = {
      page: p.page ?? 1,
      limit: p.limit ?? nfts.length,
      total: p.totalDocs ?? p.total ?? nfts.length,
      totalPages: p.totalPages ?? 1,
      hasNextPage: !!p.hasNextPage,
      hasPrevPage: !!p.hasPrevPage,
    } as MyNFTsResponse["data"]["pagination"];

    return {
      success: true,
      data: { nfts, pagination },
    };
  }

  static async getMyNFTOwnerships(
    params?: GetNFTOwnershipsParams
  ): Promise<ApiResponse<MyNFTsResponse["data"]>> {
    const res = await ApiService.get<any>(
      API_ENDPOINTS.NFT.OWNERSHIP_LIST,
      params
    );
    if (!res.success || !res.data)
      return res as ApiResponse<MyNFTsResponse["data"]>;

    // Handle ca 2 format: data.ownerships (cu) hoac data.nfts (moi)
    let rawNFTs: any[] = [];
    if (Array.isArray(res.data.ownerships)) {
      // Format cu: data.ownerships
      rawNFTs = res.data.ownerships.map((o: any) => ({
        nft: o?.nft || {},
        user: o?.user,
        metadata: o?.metadata,
      }));
    } else if (Array.isArray(res.data.nfts)) {
      // Format moi: data.nfts (direct array)
      rawNFTs = res.data.nfts.map((nft: any) => ({
        nft: nft,
        user: null,
        metadata: null,
      }));
    }

    const nfts = rawNFTs.map((item: any) => {
      const nft = item.nft || {};
      const shares = item?.shares || 0;
      const pricePerShare = nft?.pricePerShare || 0;
      const imageObj = nft?.image;

      // Extract image URL - handle nested object structure
      let imageUrl = "";
      if (typeof imageObj === "string") {
        imageUrl = imageObj;
      } else if (imageObj && typeof imageObj === "object") {
        imageUrl = imageObj.url || "";
      }

      return {
        id: nft.id || nft._id,
        name: nft.name || "",
        description: nft.description || "",
        image: imageUrl,
        price: typeof nft.price === "number" ? nft.price : 0,
        salePrice: nft.isSale
          ? typeof nft.salePrice === "number"
            ? nft.salePrice
            : typeof nft.pricePerShare === "number"
            ? nft.pricePerShare
            : typeof nft.price === "number"
            ? nft.price
            : null
          : null,
        walletAddress: nft.walletAddress || "",
        owner: item?.user?.id || null,
        isSale: !!nft.isSale,
        isActive: !!nft.isActive,
        type: nft.type,
        level: nft.level,
        currency: nft.currency,
        viewsCount: typeof nft.viewsCount === "number" ? nft.viewsCount : 0,
        likesCount: typeof nft.likesCount === "number" ? nft.likesCount : 0,
        isLike: !!nft.isLike,
        createdAt: nft.createdAt,
        publishedAt: nft.investmentStartDate || nft.createdAt,
        updatedAt: nft.updatedAt,
        purchaseDate: item.metadata?.purchaseDate || nft.createdAt,

        // Investment NFT fields
        isFractional: nft.isFractional,
        totalShares: nft.totalShares,
        soldShares: nft.soldShares,
        availableShares: nft.availableShares,
        totalInvestors: nft.totalInvestors,
        investmentStartDate: nft.investmentStartDate,
        investmentEndDate: nft.investmentEndDate,
        pricePerShare: nft.pricePerShare,

        // Mystery Box NFT fields
        isOpenable:
          nft.type === "mysteryBox" ? checkIsOpenable(nft.rewards) : undefined,
        rewards:
          nft.type === "mysteryBox"
            ? transformRewards(nft.rewards, nft.currency)
            : undefined,

        // General flags
        isFeatured: !!nft.isFeatured,
        shares: shares,
      } as MyNFTsResponse["data"]["nfts"][number];
    });

    const p = res.data.pagination || {};
    const pagination = {
      page: p.page ?? 1,
      limit: p.limit ?? nfts.length,
      total: p.totalDocs ?? p.total ?? nfts.length,
      totalPages: p.totalPages ?? 1,
      hasNextPage: !!p.hasNextPage,
      hasPrevPage: !!p.hasPrevPage,
    } as MyNFTsResponse["data"]["pagination"];

    return {
      success: true,
      data: { nfts, pagination },
    };
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
    nftId?: string;
    templateId?: string;
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

  // Dang ban NFT len marketplace
  static async listNFTForSale(data: {
    nftId: string;
    salePrice: number;
  }): Promise<ApiResponse<any>> {
    return ApiService.post(API_ENDPOINTS.NFT.POST_FOR_SALE, data);
  }

  // Huy dang ban NFT
  static async cancelNFTSale(nftId: string): Promise<ApiResponse<any>> {
    return ApiService.post(API_ENDPOINTS.NFT.CAN_FOR_SALE, { nftId });
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
  static async getNFTInvestmentList(data?: any): Promise<ApiResponse<any[]>> {
    return ApiService.get<any[]>(API_ENDPOINTS.NFT.LIST_INVESTMENT, data);
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

  // Mo hop bi an NFT
  static async openBox(nftId: string): Promise<ApiResponse<any>> {
    return ApiService.post(API_ENDPOINTS.NFT.OPEN_BOX, { nftId });
  }

  static async mintNFTToBlockchain(data: {
    nftId: string;
  }): Promise<ApiResponse<any>> {
    return ApiService.post(API_ENDPOINTS.NFT.Mint_NFT_BLOCKCHAIN, data);
  }
}

export default NFTService;
