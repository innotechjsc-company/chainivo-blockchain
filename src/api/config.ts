const isDevelopment = process.env.NODE_ENV === "development";

const getEnvValue = (
  devKey: string,
  prodKey: string,
  fallback: string
): string => {
  console.log("environment", isDevelopment);
  if (isDevelopment) {
    console.log("devKey", process.env[devKey]);
    return process.env[devKey] || fallback;
  } else if (!isDevelopment) {
    return process.env[prodKey] || fallback;
  }
  return fallback;
};

export const config = {
  ENVIRONMENT: isDevelopment ? "development" : "production",

  API_BASE_URL: getEnvValue(
    "NEXT_PUBLIC_API_BASE_URL_DEV",
    "API_BASE_URL_PROD",
    "http://localhost:3001"
  ),

  FRONTEND_BASE_URL: getEnvValue(
    "FRONTEND_BASE_URL_DEV",
    "FRONTEND_BASE_URL_PROD",
    "http://localhost:3002"
  ),

  BLOCKCHAIN: {
    NETWORK: getEnvValue(
      "BLOCKCHAIN_NETWORK_DEV",
      "BLOCKCHAIN_NETWORK_PROD",
      "amoy"
    ),
    CHAIN_ID: parseInt(
      getEnvValue(
        "BLOCKCHAIN_CHAIN_ID_DEV",
        "BLOCKCHAIN_CHAIN_ID_PROD",
        "80002"
      )
    ),
    RPC_URL: getEnvValue(
      "BLOCKCHAIN_RPC_URL_DEV",
      "BLOCKCHAIN_RPC_URL_PROD",
      "https://rpc-amoy.polygon.technology"
    ),
    RPC_BACKUP: getEnvValue(
      "BLOCKCHAIN_RPC_BACKUP_DEV",
      "BLOCKCHAIN_RPC_BACKUP_PROD",
      "https://polygon-amoy.g.alchemy.com/v2/ML-P1SSIpdgteEcS9ukyD"
    ),
    EXPLORER: getEnvValue(
      "BLOCKCHAIN_EXPLORER_DEV",
      "BLOCKCHAIN_EXPLORER_PROD",
      "https://www.oklink.com/amoy"
    ),
    CAN_TOKEN_ADDRESS: getEnvValue(
      "CAN_TOKEN_ADDRESS_DEV",
      "CAN_TOKEN_ADDRESS_PROD",
      "0x5b54896A3F8d144E02DcEEa05668C4a4EDe83c4F"
    ),
    USDT_CONTRACT_ADDRESS: getEnvValue(
      "USDT_CONTRACT_ADDRESS_DEV",
      "USDT_CONTRACT_ADDRESS_PROD",
      "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582"
    ),
  },

  _debug: {
    environment: isDevelopment ? "development" : "production",
    blockchain: {
      network: getEnvValue(
        "BLOCKCHAIN_NETWORK_DEV",
        "BLOCKCHAIN_NETWORK_PROD",
        "amoy"
      ),
      chainId: parseInt(
        getEnvValue(
          "BLOCKCHAIN_CHAIN_ID_DEV",
          "BLOCKCHAIN_CHAIN_ID_PROD",
          "80002"
        )
      ),
      rpcUrl: getEnvValue(
        "BLOCKCHAIN_RPC_URL_DEV",
        "BLOCKCHAIN_RPC_URL_PROD",
        "https://rpc-amoy.polygon.technology"
      ),
      canTokenAddress: getEnvValue(
        "CAN_TOKEN_ADDRESS_DEV",
        "CAN_TOKEN_ADDRESS_PROD",
        "0x5b54896A3F8d144E02DcEEa05668C4a4EDe83c4F"
      ),
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

  WALLET_ADDRESSES: {
    CAN_CONTRACT:
      process.env.CAN_CONTRACT || "0x5b54896A3F8d144E02DcEEa05668C4a4EDe83c4F",
    ADMIN:
      process.env.ADMIN_WALLET || "0x7C4767673CC6024365E08F2Af4369b04701a5FeD",
    USDT_CONTRACT:
      process.env.USDT_CONTRACT || "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
  },

  STORAGE_KEYS: {
    WALLET_ADDRESS: "walletAddress",
    WALLET_CONNECTED: "walletConnected",
    JWT_TOKEN: "jwt_token",
  },

  DEFAULTS: {
    GAS_FEE: parseFloat(process.env.DEFAULT_GAS_FEE || "0.001"),
    CURRENCY: process.env.DEFAULT_CURRENCY || "CAN",
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
