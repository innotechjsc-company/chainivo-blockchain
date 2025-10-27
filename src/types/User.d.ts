/**
 * User Model Types for DigitalizeAssets
 * Quản lý thông tin người dùng và authentication
 */

export type UserRole =
  | "user"
  | "investor"
  | "creator"
  | "moderator"
  | "admin"
  | "super_admin";

export type UserPermission =
  | "read_phases"
  | "create_investment"
  | "mint_nft"
  | "stake_tokens"
  | "manage_phases"
  | "manage_users"
  | "view_analytics"
  | "manage_system";

export type Language = "en" | "vi" | "ja" | "ko";
export type Currency = "USD" | "USDT" | "CAN";

export interface ISocialLinks {
  twitter?: string;
  discord?: string;
  telegram?: string;
  website?: string;
}

export interface INotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface IUserPreferences {
  language: Language;
  currency: Currency;
  notifications: INotificationPreferences;
}

export interface IUserStats {
  totalInvestments: number;
  totalInvested: number;
  totalNFTs: number;
  totalStaked: number;
  joinDate: Date;
}

export interface IUser {
  // Basic Information
  username: string;
  email: string;
  password: string;

  // Profile Information
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
  bio?: string;

  // Wallet Information
  walletAddress?: string;
  walletName?: string;

  // Token Balance
  tokenBalance: number;

  // Role and Permissions
  role: UserRole;
  permissions: UserPermission[];

  // Verification Status
  isEmailVerified: boolean;
  isKYCVerified: boolean;
  isWalletVerified: boolean;

  // Account Status
  isActive: boolean;
  isSuspended: boolean;
  suspensionReason?: string;

  // Login tracking
  lastLogin: Date | null;
  loginAttempts: number;
  lockUntil: Date | null;

  // Social Links
  socialLinks: ISocialLinks;

  // Preferences
  preferences: IUserPreferences;

  // Statistics
  stats: IUserStats;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  fullName?: string;
  displayName?: string;

  // Instance Methods
  isLocked(): boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  incLoginAttempts(): Promise<any>;
  resetLoginAttempts(): Promise<any>;
}

export interface IUserModel {
  findByWalletAddress(address: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  findByCredentials(email: string, password: string): Promise<IUser | null>;
}

export type UserDocument = IUser;
