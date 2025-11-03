import { config } from "./config";
///

export const constants = {
  blockchain: {
    DEFAULT_ROYALTY_PERCENTAGE: 2.5,
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
    GAS_LIMITS: {
      TRANSFER: 100000,
      MINT: 200000,
      APPROVE: 100000,
    },
  },

  nft: {
    DEFAULT_ATTRIBUTES: [
      { trait_type: "Color", value: "Blue" },
      { trait_type: "Rarity", value: "Common" },
    ],
    DEFAULT_IMAGE: `${config.EXTERNAL_URLS.DEFAULT_IMAGES}/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop`,
    PLACEHOLDER_IMAGES: {
      NFT: `${config.EXTERNAL_URLS.PLACEHOLDER_IMAGES}/400x320/6B7280/FFFFFF?text=NFT`,
      AVATAR: `${config.EXTERNAL_URLS.PLACEHOLDER_IMAGES}/100x100/6366f1/ffffff?text=U`,
      MYSTERY_BOX: `${config.EXTERNAL_URLS.PLACEHOLDER_IMAGES}/400x320/6B7280/FFFFFF?text=MYSTERY+BOX`,
    },
  },

  user: {
    DEFAULT_BIO: "Blockchain enthusiast",
    DEFAULT_AVATAR: `${config.EXTERNAL_URLS.PLACEHOLDER_IMAGES}/100x100/6366f1/ffffff?text=U`,
  },

  social: {
    SHARE_URLS: {
      TWITTER: config.EXTERNAL_URLS.SOCIAL.TWITTER,
      FACEBOOK: config.EXTERNAL_URLS.SOCIAL.FACEBOOK,
      TELEGRAM: config.EXTERNAL_URLS.SOCIAL.TELEGRAM,
    },
    DEFAULT_SHARE_TEXT: "Check out this amazing NFT on Chainivo!",
    HASHTAGS: ["#Chainivo", "#NFT", "#Blockchain", "#Web3"],
  },

  api: {
    TIMEOUTS: {
      DEFAULT: 10000,
      BLOCKCHAIN: 30000,
      UPLOAD: 60000,
    },
  },

  business: {
    STAKING: {
      MIN_STAKE_AMOUNT: 100,
      MAX_STAKE_AMOUNT: 1000000,
      DEFAULT_APY: 12,
    },
    AIRDROP: {
      DEFAULT_MAX_CLAIM: 1000,
      DEFAULT_TOKEN_SYMBOL: "CAN",
    },
    MYSTERY_BOX: {
      DEFAULT_TIER: "common",
      DEFAULT_PRICE: 100,
    },
  },

  errors: {
    COMMON: {
      UNAUTHORIZED: "Unauthorized access",
      FORBIDDEN: "Access forbidden",
      NOT_FOUND: "Resource not found",
      VALIDATION_ERROR: "Validation failed",
      SERVER_ERROR: "Internal server error",
    },
    BLOCKCHAIN: {
      INSUFFICIENT_BALANCE: "Insufficient balance",
      TRANSACTION_FAILED: "Transaction failed",
      NETWORK_ERROR: "Network connection error",
      INVALID_ADDRESS: "Invalid wallet address",
    },
  },

  success: {
    COMMON: {
      CREATED: "Resource created successfully",
      UPDATED: "Resource updated successfully",
      DELETED: "Resource deleted successfully",
      OPERATION_COMPLETED: "Operation completed successfully",
    },
    BLOCKCHAIN: {
      TRANSACTION_SUCCESS: "Transaction completed successfully",
      TOKEN_TRANSFERRED: "Tokens transferred successfully",
      NFT_MINTED: "NFT minted successfully",
    },
  },
};

export default constants;
