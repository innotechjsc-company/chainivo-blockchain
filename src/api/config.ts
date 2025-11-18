// Helper function để lấy env value với fallback
const getEnvValue = (key: string, fallback: string): string => {
  const value = process.env[key];

  return value || fallback;
};

const isDevelopment = process.env.NODE_ENV === "development";

export const config = {
  ENVIRONMENT: process.env.NODE_ENV || "development",

  // API Configuration
  API_BASE_URL: getEnvValue(
    "NEXT_PUBLIC_API_BASE_URL",
    // "https://chainivo.online"
    "http://localhost:3001"
  ),

  FRONTEND_BASE_URL: getEnvValue(
    "NEXT_PUBLIC_FRONTEND_BASE_URL",
    "http://localhost:3000"
  ),

  // Blockchain Configuration
  BLOCKCHAIN: {
    NETWORK: getEnvValue("NEXT_PUBLIC_BLOCKCHAIN_NETWORK", "amoy"),
    CHAIN_ID: parseInt(getEnvValue("NEXT_PUBLIC_BLOCKCHAIN_CHAIN_ID", "80002")),
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
      chainId: parseInt(
        getEnvValue("NEXT_PUBLIC_BLOCKCHAIN_CHAIN_ID", "80002")
      ),
      rpcUrl: getEnvValue(
        "NEXT_PUBLIC_BLOCKCHAIN_RPC_URL",
        "https://rpc-amoy.polygon.technology"
      ),
      canTokenAddress: getEnvValue(
        "NEXT_PUBLIC_CAN_TOKEN_ADDRESS",
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
    NFT_CONTRACT_ADDRESS: getEnvValue(
      "NEXT_PUBLIC_NFT_CONTRACT_ADDRESS",
      "0xeaDB5F19e5Fc4fbf15123606BA61CE1Da7FaaaFF"
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
    GAS_FEE: parseFloat(getEnvValue("NEXT_PUBLIC_DEFAULT_GAS_FEE", "0.001")),
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

export const erc721Abi = [
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_symbol", type: "string" },
      { internalType: "string", name: "_baseURI", type: "string" },
      { internalType: "uint256", name: "_maxSupply", type: "uint256" },
      { internalType: "uint256", name: "_mintPrice", type: "uint256" },
      {
        internalType: "uint256",
        name: "_royaltyPercentage",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_royaltyReceiver",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ERC721EnumerableForbiddenBatchMint",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "address", name: "owner", type: "address" },
    ],
    name: "ERC721IncorrectOwner",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "ERC721InsufficientApproval",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "approver", type: "address" }],
    name: "ERC721InvalidApprover",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "operator", type: "address" }],
    name: "ERC721InvalidOperator",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "ERC721InvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "receiver", type: "address" }],
    name: "ERC721InvalidReceiver",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "ERC721InvalidSender",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ERC721NonexistentToken",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "ERC721OutOfBoundsIndex",
    type: "error",
  },
  { inputs: [], name: "EnforcedPause", type: "error" },
  { inputs: [], name: "ExpectedPause", type: "error" },
  { inputs: [], name: "InsufficientPayment", type: "error" },
  { inputs: [], name: "InvalidAddress", type: "error" },
  { inputs: [], name: "InvalidAmount", type: "error" },
  { inputs: [], name: "InvalidRoyaltyPercentage", type: "error" },
  { inputs: [], name: "InvalidTokenId", type: "error" },
  { inputs: [], name: "MaxSupplyReached", type: "error" },
  { inputs: [], name: "MintingNotActive", type: "error" },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
  { inputs: [], name: "TokenNotExists", type: "error" },
  { inputs: [], name: "TransferFailed", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "newBaseURI",
        type: "string",
      },
    ],
    name: "BaseURIUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_fromTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_toTokenId",
        type: "uint256",
      },
    ],
    name: "BatchMetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newMaxSupply",
        type: "uint256",
      },
    ],
    name: "MaxSupplyUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "MetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newPrice",
        type: "uint256",
      },
    ],
    name: "MintPriceUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "status",
        type: "bool",
      },
    ],
    name: "MintingStatusUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "NFTBurned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "tokenURI",
        type: "string",
      },
    ],
    name: "NFTMinted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PaymentReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "percentage",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "RoyaltyUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "baseURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "recipients",
        type: "address[]",
      },
      { internalType: "string[]", name: "tokenURIs", type: "string[]" },
    ],
    name: "batchMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "collectionName",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "collectionSymbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "emergencyWithdrawToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getTokenInfo",
    outputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "uint256", name: "mintTime", type: "uint256" },
      { internalType: "string", name: "tokenURI", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "tokenURI", type: "string" }],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "mintPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mintingActive",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "royaltyPercentage",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "royaltyReceiver",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "newBaseURI", type: "string" }],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "newMaxSupply", type: "uint256" },
    ],
    name: "setMaxSupply",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "newPrice", type: "uint256" }],
    name: "setMintPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bool", name: "status", type: "bool" }],
    name: "setMintingStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "percentage", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" },
    ],
    name: "setRoyalty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
    name: "tokenByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenCreator",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenMintTime",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];
