/**
 * Analytics Model Types
 */

export type AnalyticsType =
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom";

export interface IPeriod {
  startDate: Date;
  endDate: Date;
}

export interface ICountryData {
  country: string;
  count: number;
  percentage: number;
}

export interface IUserRetention {
  day1?: number;
  day7?: number;
  day30?: number;
}

export interface IUserAnalytics {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  returningUsers: number;
  userGrowth: number;
  topCountries: ICountryData[];
  userRetention: IUserRetention;
}

export interface ITopInvestor {
  address: string;
  username?: string;
  totalInvested: number;
  investmentCount: number;
}

export interface IInvestmentByPhase {
  phaseId: number;
  phaseName: string;
  investmentCount: number;
  totalAmount: number;
}

export interface IInvestmentTrend {
  date: Date;
  count: number;
  amount: number;
}

export interface IInvestmentAnalytics {
  totalInvestments: number;
  totalAmount: number;
  averageInvestment: number;
  investmentGrowth: number;
  topInvestors: ITopInvestor[];
  investmentByPhase: IInvestmentByPhase[];
  investmentTrends: IInvestmentTrend[];
}

export interface IPhasePerformance {
  phaseId: number;
  name: string;
  targetAmount: number;
  raisedAmount: number;
  completionPercentage: number;
  investorCount: number;
  duration: number;
}

export interface IPhaseAnalytics {
  totalPhases: number;
  activePhases: number;
  completedPhases: number;
  totalRaised: number;
  averagePhaseCompletion: number;
  phasePerformance: IPhasePerformance[];
}

export interface ITopCollection {
  name: string;
  contractAddress: string;
  totalNFTs: number;
  totalVolume: number;
  averagePrice: number;
}

export interface INFTSale {
  date: Date;
  count: number;
  volume: number;
  averagePrice: number;
}

export interface IRarityDistribution {
  common: number;
  uncommon: number;
  rare: number;
  epic: number;
  legendary: number;
}

export interface INFTAnalytics {
  totalNFTs: number;
  mintedNFTs: number;
  tradedNFTs: number;
  totalVolume: number;
  averagePrice: number;
  floorPrice: number;
  topCollections: ITopCollection[];
  nftSales: INFTSale[];
  rarityDistribution: IRarityDistribution;
}

export interface IBoxPerformance {
  boxType: string;
  totalSupply: number;
  soldSupply: number;
  revenue: number;
  averageReward: number;
}

export interface IMysteryBoxAnalytics {
  totalBoxes: number;
  soldBoxes: number;
  openedBoxes: number;
  totalRevenue: number;
  averageRewardValue: number;
  boxPerformance: IBoxPerformance[];
  rewardDistribution: IRarityDistribution;
}

export interface ITopStaker {
  address: string;
  username?: string;
  totalStaked: number;
  totalRewards: number;
}

export interface IStakingTrend {
  date: Date;
  totalStaked: number;
  stakerCount: number;
  rewards: number;
}

export interface IStakingAnalytics {
  totalStaked: number;
  totalStakers: number;
  totalRewards: number;
  averageStake: number;
  stakingGrowth: number;
  topStakers: ITopStaker[];
  stakingTrends: IStakingTrend[];
}

export interface IRevenueBySource {
  source: string;
  amount: number;
  percentage: number;
}

export interface IMonthlyRevenue {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface IFinancialAnalytics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  revenueGrowth: number;
  profitMargin: number;
  revenueBySource: IRevenueBySource[];
  monthlyRevenue: IMonthlyRevenue[];
}

export interface IGasUsage {
  total?: number;
  average?: number;
  cost?: number;
}

export interface INetworkPerformance {
  averageBlockTime?: number;
  averageGasPrice?: number;
  networkCongestion?: string;
}

export interface IPlatformAnalytics {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  successRate: number;
  averageTransactionTime: number;
  gasUsage: IGasUsage;
  networkPerformance: INetworkPerformance;
}

export interface ITopReferrer {
  source: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
}

export interface IPageView {
  page: string;
  views: number;
  uniqueViews: number;
  timeOnPage: number;
}

export interface IUserJourneyStep {
  step: string;
  users: number;
  dropoff: number;
  conversionRate: number;
}

export interface IMarketingAnalytics {
  totalVisitors: number;
  uniqueVisitors: number;
  conversionRate: number;
  topReferrers: ITopReferrer[];
  pageViews: IPageView[];
  userJourney: IUserJourneyStep[];
}

export interface ITopContent {
  type: string;
  id: string;
  title: string;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
}

export interface ISocialGrowth {
  platform: string;
  followers: number;
  growth: number;
  engagement: number;
}

export interface ISocialAnalytics {
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  engagementRate: number;
  topContent: ITopContent[];
  socialGrowth: ISocialGrowth[];
}

export interface IMetadata {
  generatedAt: Date;
  dataSource: string;
  version: string;
  notes?: string;
}

export interface IAnalytics {
  // Basic Information
  type: AnalyticsType;
  period: IPeriod;

  // User Analytics
  users: IUserAnalytics;

  // Investment Analytics
  investments: IInvestmentAnalytics;

  // Phase Analytics
  phases: IPhaseAnalytics;

  // NFT Analytics
  nfts: INFTAnalytics;

  // Mystery Box Analytics
  mysteryBoxes: IMysteryBoxAnalytics;

  // Staking Analytics
  staking: IStakingAnalytics;

  // Financial Analytics
  financial: IFinancialAnalytics;

  // Platform Analytics
  platform: IPlatformAnalytics;

  // Marketing Analytics
  marketing: IMarketingAnalytics;

  // Social Analytics
  social: ISocialAnalytics;

  // Custom Metrics
  customMetrics?: Map<string, any>;

  // Metadata
  metadata: IMetadata;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  periodDuration?: number;
  periodLabel?: string;

  // Instance Methods
  updateMetrics(newData: any): Promise<IAnalytics>;
  addUserData(userData: any): Promise<IAnalytics>;
  addInvestmentData(investmentData: any): Promise<IAnalytics>;
}

export interface IAnalyticsModel {
  findByPeriod(startDate: Date, endDate: Date): Promise<IAnalytics[]>;
  findByType(type: AnalyticsType): Promise<IAnalytics[]>;
  findLatest(type?: AnalyticsType): Promise<IAnalytics | null>;
  generateDailyAnalytics(date: Date): Promise<IAnalytics | null>;
}

export type AnalyticsDocument = IAnalytics;
