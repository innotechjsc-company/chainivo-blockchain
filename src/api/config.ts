// Helper function để lấy env value với fallback
const getEnvValue = (key: string, fallback: string): string => {
  const value = process.env[key];
  
  // Debug log (chỉ log 1 lần khi module được load)
  if (typeof window === 'undefined' && key === 'NEXT_PUBLIC_API_BASE_URL') {
    console.log('🔍 ENV Debug:');
    console.log('  - Key:', key);
    console.log('  - Value:', value);
    console.log('  - Fallback:', fallback);
    console.log('  - All NEXT_PUBLIC_ vars:', 
      Object.keys(process.env)
        .filter(k => k.startsWith('NEXT_PUBLIC_'))
        .map(k => `${k}=${process.env[k]}`)
    );
  }
  
  return value || fallback;
};

const isDevelopment = process.env.NODE_ENV === "development";

export const config = {
  ENVIRONMENT: process.env.NODE_ENV || "development",

  // API Configuration
  API_BASE_URL: getEnvValue(
    "NEXT_PUBLIC_API_BASE_URL",
    "https://chainivo.online"
  ),

  FRONTEND_BASE_URL: getEnvValue(
    "NEXT_PUBLIC_FRONTEND_BASE_URL",
    "http://localhost:3000"
  ),

  // Blockchain Configuration
  BLOCKCHAIN: {
    NETWORK: getEnvValue(
      "NEXT_PUBLIC_BLOCKCHAIN_NETWORK",
      "amoy"
    ),
    CHAIN_ID: parseInt(
      getEnvValue(
        "NEXT_PUBLIC_BLOCKCHAIN_CHAIN_ID",
        "80002"
      )
    ),
    RPC_URL: getEnvValue(
      "NEXT_PUBLIC_BLOCKCHAIN_RPC_URL",
      "https://rpc-amoy.polygon.technology"
    ),
    RPC_BACKUP: getEnvValue(
      "NEXT_PUBLIC_BLOCKCHAIN_RPC_BACKUP",
      "https://polygon-amoy.g.alchemy.com/v2/ML-P1SSIpdgteEcS9ukyD"
    ),
    EXPLORER: getEnvValue(
      "NEXT_PUBLIC_BLOCKCHAIN_EXPLORER",
      "https://www.oklink.com/amoy"
    ),
    CAN_TOKEN_ADDRESS: getEnvValue(
      "NEXT_PUBLIC_CAN_TOKEN_ADDRESS",
      "0x5b54896A3F8d144E02DcEEa05668C4a4EDe83c4F"
    ),
    USDT_CONTRACT_ADDRESS: getEnvValue(
      "NEXT_PUBLIC_USDT_CONTRACT_ADDRESS",
      "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582"
    ),
  },

  // Debug info
  _debug: {
    environment: process.env.NODE_ENV || "development",
    blockchain: {
      network: getEnvValue("NEXT_PUBLIC_BLOCKCHAIN_NETWORK", "amoy"),
      chainId: parseInt(getEnvValue("NEXT_PUBLIC_BLOCKCHAIN_CHAIN_ID", "80002")),
      rpcUrl: getEnvValue("NEXT_PUBLIC_BLOCKCHAIN_RPC_URL", "https://rpc-amoy.polygon.technology"),
      canTokenAddress: getEnvValue("NEXT_PUBLIC_CAN_TOKEN_ADDRESS", "0x5b54896A3F8d144E02DcEEa05668C4a4EDe83c4F"),
    },
  },

  EXTERNAL_URLS: {
    PLACEHOLDER_IMAGES: "https://via.placeholder.com",
    DEFAULT_IMAGES: "https://images.unsplash.com",
    SOCIAL: {
      TWITTER: "https://twitter.com/intent/tweet",
      FACEBOOK: "https://www.facebook.com/sharer/sharer.php",
      TELEGRAM: "https://t.me/share/url",
    },
  },

  BLOCKCHAIN_EXPLORER: {
    POLYGONSCAN_AMOY: "https://amoy.polygonscan.com",
    POLYGONSCAN_MAINNET: "https://polygonscan.com",
    OKLINK_AMOY: "https://www.oklink.com/amoy",
    CONTRACT_ADDRESS: (address: string) =>
      isDevelopment
        ? `https://amoy.polygonscan.com/address/${address}`
        : `https://polygonscan.com/address/${address}`,
    TOKEN: (contractAddress: string, tokenId: string) =>
      isDevelopment
        ? `https://amoy.polygonscan.com/token/${contractAddress}?a=${tokenId}`
        : `https://polygonscan.com/token/${contractAddress}?a=${tokenId}`,
    TRANSACTION: (txHash: string) =>
      isDevelopment
        ? `https://amoy.polygonscan.com/tx/${txHash}`
        : `https://polygonscan.com/tx/${txHash}`,
    USDT_TRANSACTION: (txHash: string) =>
      isDevelopment
        ? `https://www.oklink.com/amoy/tx/${txHash}`
        : `https://polygonscan.com/tx/${txHash}`,
  },

  // Wallet Addresses
  WALLET_ADDRESSES: {
    CAN_CONTRACT: getEnvValue(
      "NEXT_PUBLIC_CAN_CONTRACT",
      "0x5b54896A3F8d144E02DcEEa05668C4a4EDe83c4F"
    ),
    ADMIN: getEnvValue(
      "NEXT_PUBLIC_ADMIN_WALLET",
      "0x7C4767673CC6024365E08F2Af4369b04701a5FeD"
    ),
    USDT_CONTRACT: getEnvValue(
      "NEXT_PUBLIC_USDT_CONTRACT",
      "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582"
    ),
  },

  // Storage Keys
  STORAGE_KEYS: {
    WALLET_ADDRESS: "walletAddress",
    WALLET_CONNECTED: "walletConnected",
    JWT_TOKEN: "jwt_token",
  },

  // Default Values
  DEFAULTS: {
    GAS_FEE: parseFloat(
      getEnvValue("NEXT_PUBLIC_DEFAULT_GAS_FEE", "0.001")
    ),
    CURRENCY: getEnvValue("NEXT_PUBLIC_DEFAULT_CURRENCY", "POL"),
  },
};

export const buildApiUrl = (endpoint: string): string => {
  return `${config.API_BASE_URL}${endpoint}`;
};

export const buildFrontendUrl = (path: string): string => {
  return `${config.FRONTEND_BASE_URL}${path}`;
};

export const buildBlockchainUrl = (
  type: "contract" | "token" | "transaction" | "usdt_transaction",
  ...params: string[]
): string => {
  switch (type) {
    case "contract":
      return config.BLOCKCHAIN_EXPLORER.CONTRACT_ADDRESS(params[0]);
    case "token":
      return config.BLOCKCHAIN_EXPLORER.TOKEN(params[0], params[1]);
    case "transaction":
      return config.BLOCKCHAIN_EXPLORER.TRANSACTION(params[0]);
    case "usdt_transaction":
      return config.BLOCKCHAIN_EXPLORER.USDT_TRANSACTION(params[0]);
    default:
      return "";
  }
};

export const TOKEN_DEAULT_CURRENCY = "CAN";
export const TOKEN_DEAULT_CURRENCY_INVESTMENT = "USDC";
