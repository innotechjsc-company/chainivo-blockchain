/**
 * NFT Model Types
 */

export type DisplayType =
  | "string"
  | "number"
  | "date"
  | "boost_percentage"
  | "boost_number";
export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type NFTStandard = "ERC-721" | "ERC-1155" | "ERC-4907";
export type Currency = "ETH" | "USDT" | "USDC" | "CAN";
export type OfferStatus = "active" | "accepted" | "rejected" | "expired";
export type TransactionType =
  | "mint"
  | "transfer"
  | "sale"
  | "bid"
  | "offer"
  | "burn"
  | "list"
  | "delist";
export type NFTStatus = "active" | "inactive" | "banned" | "burned";
export type BlockchainStatus = "pending" | "minted" | "failed" | "not_minted";

export interface IAttribute {
  trait_type: string;
  value: any;
  display_type?: DisplayType;
  max_value?: number;
  rarity?: Rarity;
}

export interface ICollection {
  name: string;
  contractAddress: string;
  standard: NFTStandard;
}

export interface IUserInfo {
  address: string;
  username?: string;
  verified: boolean;
}

export interface IRoyalty {
  percentage: number;
  recipient?: string;
}

export interface IPrice {
  amount: number;
  currency: Currency;
}

export interface IOffer {
  bidder: string;
  amount: number;
  currency: string;
  timestamp: Date;
  status: OfferStatus;
}

export interface IMarketplace {
  isListed: boolean;
  price?: IPrice;
  listingDate?: Date;
  listingExpiry?: Date;
  offers: IOffer[];
}

export interface ITransaction {
  type: TransactionType;
  from?: string;
  to?: string;
  amount?: number;
  currency?: string;
  transactionHash?: string;
  blockNumber?: number;
  timestamp: Date;
}

export interface IStaking {
  isStaked: boolean;
  stakingContract?: string;
  stakingPool?: string;
  stakingDate?: Date;
  rewards: number;
}

export interface IMysteryBoxInfo {
  isFromBox: boolean;
  boxId?: number;
  boxType?: string;
  rarity: Rarity;
}

export interface ILike {
  user: string;
  timestamp: Date;
}

export interface IComment {
  user: string;
  username?: string;
  comment: string;
  timestamp: Date;
}

export interface IShares {
  count: number;
  users: string[];
}

export interface INFTStats {
  views: number;
  favorites: number;
  floorPrice: number;
  highestSale: number;
  totalSales: number;
}

export interface INFT {
  // Basic NFT Information
  tokenId: number;
  name: string;
  description?: string;
  image: string;

  // Metadata
  tokenURI: string;
  metadata?: Map<string, any>;

  // Attributes and Traits
  attributes: IAttribute[];

  // Collection Information
  collection: ICollection;

  // Ownership and Creator
  owner: IUserInfo;
  creator: IUserInfo;

  // Royalty Information
  royalty: IRoyalty;

  // Marketplace Information
  marketplace: IMarketplace;

  // Transaction History
  transactions: ITransaction[];

  // Staking Information
  staking: IStaking;

  // Mystery Box Information
  mysteryBox: IMysteryBoxInfo;

  // Social and Community
  likes: ILike[];
  comments: IComment[];
  shares: IShares;

  // Statistics
  stats: INFTStats;

  // Status and Verification
  status: NFTStatus;
  blockchainStatus: BlockchainStatus;
  isVerified: boolean;
  verificationDate?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  totalLikes?: number;
  totalComments?: number;
  isForSale?: boolean;
  currentPrice?: IPrice | null;

  // Instance Methods
  addView(): Promise<INFT>;
  addLike(userAddress: string): Promise<INFT>;
  removeLike(userAddress: string): Promise<INFT>;
  addComment(
    userAddress: string,
    username: string,
    comment: string
  ): Promise<INFT>;
  addTransaction(transactionData: ITransaction): Promise<INFT>;
  listForSale(
    price: number,
    currency: Currency,
    expiryDays?: number
  ): Promise<INFT>;
  delist(): Promise<INFT>;
}

export interface INFTModel {
  findByOwner(address: string): Promise<INFT[]>;
  findByCreator(address: string): Promise<INFT[]>;
  findForSale(): Promise<INFT[]>;
  findByCollection(contractAddress: string): Promise<INFT[]>;
  findByTrait(traitType: string, traitValue: any): Promise<INFT[]>;
  findByRarity(rarity: Rarity): Promise<INFT[]>;
}

export type NFTDocument = INFT;

/**
 * NFT API Response Types - Theo structure từ backend API
 */
export type NFTType = 'normal' | 'rank' | 'mysteryBox' | 'investment';
export type NFTLevel = '1' | '2' | '3' | '4' | '5';
export type NFTCurrency = 'can' | 'usdc' | 'usdt' | 'eth';

export interface NFTItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  salePrice: number | null;
  walletAddress: string;
  owner: string | null;
  isSale: boolean;
  isActive: boolean;
  type: NFTType;
  level: NFTLevel;
  currency: NFTCurrency;
  viewsCount: number;
  likesCount: number;
  isLike?: boolean;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
  purchaseDate: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Analytics {
  allNFT: number;
  allUserCount: number;
  allMoney: number;
  priceRange: number;
}

export interface MyNFTsResponse {
  success: boolean;
  message: string;
  data: {
    nfts: NFTItem[];
    pagination: Pagination;
  };
}

export interface NFTMarketplaceResponse {
  success: boolean;
  message: string;
  data: {
    nfts: NFTItem[];
    analytics: Analytics;
    pagination: Pagination;
  };
}

export interface NFTDetailResponse {
  success: boolean;
  message: string;
  data: NFTItem;
}

export interface NFTStats {
  totalNFTs: number;
  onSale: number;
  notListed: number;
  totalValue: number;
  inactive: number;
}
