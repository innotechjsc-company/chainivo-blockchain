import { config } from "@/api/config";

type Web3Type = any;
type ContractType = any;

// Các loại token được hỗ trợ //
export type TokenType = "USDC" | "CAN" | "POL";

// Thông tin chi tiết về kết quả giao dịch
export interface TransferResult {
  transactionHash: string; // Mã hash của giao dịch
  blockNumber: string; // Số block được confirm
  recipient: string; // Địa chỉ người nhận
  tokenType: TokenType; // Loại token đã chuyển
  amount: string; // Số lượng token đã chuyển
  rawReceipt: any; // Receipt gốc từ blockchain
}

// Tham số cho hàm chuyển token
export interface TransferParams {
  fromAddress: string; // Địa chỉ ví người gửi
  toAddress?: string; // Địa chỉ người nhận (mặc định là admin)
  amount: number; // Số lượng token cần chuyển
  tokenType: TokenType; // Loại token (USDC, CAN, hoặc POL)
  gasLimit?: number; // Giới hạn gas (mặc định 150000)
  gasBoostPercent?: number; // % tăng gas price để xử lý nhanh hơn (mặc định 50%)
}

export default class TransferService {
  // ERC-20 ABI - Từ contract thực tế trên Polygonscan
  private static readonly erc20Abi = [
    {
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "value", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  /**
   * Mapping decimals cho mỗi loại token
   * USDC: 6 decimals
   * CAN: 18 decimals
   * POL: 18 decimals
   */
  private static readonly tokenDecimals: Record<TokenType, number> = {
    USDC: 6,
    CAN: 18,
    POL: 18,
  };

  /**
   * Lấy địa chỉ contract của token dựa vào loại token
   */
  private static getTokenAddress(tokenType: TokenType): string {
    switch (tokenType) {
      case "USDC":
        return config.BLOCKCHAIN.USDT_CONTRACT_ADDRESS; // USDC contract address
      case "CAN":
        return config.BLOCKCHAIN.CAN_TOKEN_ADDRESS; // CAN token address
      case "POL":
        return config.BLOCKCHAIN.CAN_TOKEN_ADDRESS; // POL sử dụng native token (tạm thời dùng CAN)
      default:
        throw new Error(`Loại token không được hỗ trợ: ${tokenType}`);
    }
  }

  /**
   * Lấy số decimals của token
   */
  private static getTokenDecimals(tokenType: TokenType): number {
    return this.tokenDecimals[tokenType];
  }

  /**
   * Khởi tạo Web3 instance từ MetaMask/wallet
   */
  private static async getWeb3(): Promise<Web3Type> {
    const web3Module = await import("web3");
    return new web3Module.default((window as any).ethereum);
  }

  /**
   * Tạo contract instance cho token ERC-20
   */
  private static getTokenContract(
    web3: Web3Type,
    tokenAddress: string
  ): ContractType {
    return new web3.eth.Contract(this.erc20Abi, tokenAddress);
  }

  /**
   * Chuyển đổi số lượng token sang Wei với số decimals tùy chỉ
   */
  private static toWeiWithDecimals(amount: string, decimals: number): string {
    const divisor = BigInt(10) ** BigInt(decimals);
    const parts = amount.split(".");
    const wholePart = parts[0];
    const fractionalPart = (parts[1] || "")
      .padEnd(decimals, "0")
      .slice(0, decimals);
    const combined = wholePart + fractionalPart;
    return combined;
  }

  /**
   * Chuyển đổi số lượng token sang Wei (đơn vị nhỏ nhất)
   */
  private static toWei(web3: Web3Type, amount: string): string {
    return web3.utils.toWei(amount, "ether");
  }

  /**
   * Chuyển đổi Wei về số lượng token dạng thập phân với decimals tùy chỉ
   */
  private static fromWeiWithDecimals(
    web3: Web3Type,
    amountWei: string,
    decimals: number
  ): string {
    const amountBigInt = BigInt(amountWei);
    const divisor = BigInt(10) ** BigInt(decimals);
    const wholePart = amountBigInt / divisor;
    const remainder = amountBigInt % divisor;
    const fractionalPart = remainder.toString().padStart(decimals, "0");
    return `${wholePart}.${fractionalPart}`.replace(/\.?0+$/, "");
  }

  /**
   * Chuyển đổi Wei về số lượng token dạng thập phân
   */
  private static fromWei(web3: Web3Type, amountWei: string): string {
    return web3.utils.fromWei(amountWei, "ether");
  }

  /**
   * Tính toán gas price tối ưu với tỷ lệ boost để giao dịch được xử lý nhanh hơn
   */
  private static async getOptimizedGasPrice(
    web3: Web3Type,
    boostPercent = 50
  ): Promise<string> {
    const current = await web3.eth.getGasPrice();
    const currentBigInt =
      typeof current === "bigint" ? current : BigInt(current);
    // Tăng gas price thêm % boost để ưu tiên giao dịch
    const boosted = (currentBigInt * BigInt(100 + boostPercent)) / BigInt(100);
    return boosted.toString();
  }

  /**
   * Trích xuất địa chỉ người nhận từ receipt của giao dịch
   */
  private static extractRecipientFromReceipt(
    receipt: any,
    fallback: string
  ): string {
    try {
      const evt = receipt?.events?.Transfer || receipt?.events?.["Transfer"];
      const first = Array.isArray(evt) ? evt[0] : evt;
      const toAddr = first?.returnValues?.to ?? first?.returnValues?.[1];
      if (typeof toAddr === "string" && toAddr.startsWith("0x")) return toAddr;
    } catch {}
    return fallback;
  }

  /**
   * Chuẩn hóa block number về dạng string
   */
  private static normalizeBlockNumber(blockNumber: any): string {
    if (typeof blockNumber === "bigint") return blockNumber.toString();
    if (blockNumber == null) return "";
    return String(blockNumber);
  }

  /**
   * Kiểm tra xem contract có tồn tại tại address này không
   * Lưu ý: Validation này chỉ là optional - contract có thể tồn tại nhưng RPC không thể verify
   */
  private static async validateContract(
    web3: Web3Type,
    contractAddress: string
  ): Promise<boolean> {
    try {
      // Thử gọi balanceOf với address 0x0 để test contract
      // Cách này reliablehơn là getCode
      const contract = this.getTokenContract(web3, contractAddress);
      await contract.methods
        .balanceOf("0x0000000000000000000000000000000000000000")
        .call();
      console.log(`✅ Contract is valid at ${contractAddress}`);
      return true;
    } catch (error: any) {
      // Nếu lỗi là "address is not a valid address", contract có thể vẫn hợp lệ
      // Chỉ fail nếu là lỗi format address
      if (error?.toString()?.includes("not a valid address")) {
        console.warn(`⚠️ Invalid contract address format: ${contractAddress}`);
        return false;
      }
      // Nếu lỗi khác (RPC fail, timeout), vẫn return true để retry balanceOf call
      console.warn(
        `⚠️ Could not validate contract (will retry): ${error?.message}`
      );
      return true;
    }
  }

  /**
   * Kiểm tra số dư token của một địa chỉ ví
   */
  static async getBalance(params: {
    walletAddress: string;
    tokenType: TokenType;
  }): Promise<string> {
    const { walletAddress, tokenType } = params;

    try {
      const web3 = await this.getWeb3();
      const tokenAddress = this.getTokenAddress(tokenType);

      console.log(
        `📍 getBalance - Token: ${tokenType}, Address: ${tokenAddress}, Wallet: ${walletAddress}`
      );

      // Validate contract exists
      const contractExists = await this.validateContract(web3, tokenAddress);
      if (!contractExists) {
        throw new Error(`Contract không tồn tại tại address: ${tokenAddress}`);
      }

      const contract = this.getTokenContract(web3, tokenAddress);

      // Lấy số dư dạng Wei
      console.log(`📍 Calling balanceOf...`);
      const balanceWei = await contract.methods.balanceOf(walletAddress).call();

      // Lấy số decimals đúng cho token type
      const decimals = this.getTokenDecimals(tokenType);

      // Chuyển đổi sang dạng thập phân để dễ đọc - dùng decimals chính xác
      const balance = this.fromWeiWithDecimals(web3, balanceWei, decimals);
      console.log(`✅ Balance fetched: ${balance} ${tokenType}`);
      return balance;
    } catch (error: any) {
      console.error(`❌ getBalance Error:`, error);
      throw new Error(
        `Lỗi khi kiểm tra số dư ${params.tokenType}: ${
          error?.message || error?.toString() || "Unknown error"
        }`
      );
    }
  }

  /**
   * Chuyển token từ ví này sang ví khác
   * Hỗ trợ 3 loại token: USDC, CAN, POL
   */
  static async transferToken(params: TransferParams): Promise<TransferResult> {
    const {
      fromAddress,
      toAddress,
      amount,
      tokenType,
      gasLimit = 150000,
      gasBoostPercent = 50,
    } = params;

    try {
      // Nếu không có địa chỉ người nhận, mặc định gửi về admin
      const recipientAddress = toAddress || config.WALLET_ADDRESSES.ADMIN;

      console.log(
        `📍 transferToken START - Token: ${tokenType}, From: ${fromAddress}, To: ${recipientAddress}, Amount: ${amount}`
      );

      // 1. Khởi tạo Web3 và lấy contract của token
      const web3 = await this.getWeb3();
      const tokenAddress = this.getTokenAddress(tokenType);

      console.log(`📍 Step 1: tokenAddress = ${tokenAddress}`);

      const contract = this.getTokenContract(web3, tokenAddress);

      // Lấy số decimals từ mapping dựa vào loại token
      const decimals = this.getTokenDecimals(tokenType);
      console.log(`📍 Step 2: decimals = ${decimals}`);

      // Tính toán required Wei trực tiếp (bỏ qua balance check do ABI issue)
      const requiredWei = this.toWeiWithDecimals(String(amount), decimals);
      console.log(`📍 Step 3: requiredWei = ${requiredWei}`);

      // Tính toán gas price tối ưu
      const gasPrice = await this.getOptimizedGasPrice(web3, gasBoostPercent);
      console.log(`📍 Step 4: gasPrice = ${gasPrice}`);

      // Validate fromAddress before sending transaction
      let senderAddress = fromAddress;
      if (!senderAddress || senderAddress.trim() === "") {
        // Try to get current account from ethereum provider
        if ((window as any).ethereum) {
          const accounts = await (window as any).ethereum.request({
            method: "eth_accounts",
          });
          if (accounts && accounts.length > 0) {
            senderAddress = accounts[0];
            console.log(
              `📍 Using current account from provider: ${senderAddress}`
            );
          } else {
            throw new Error(
              "Không tìm thấy địa chỉ ví. Vui lòng kết nối MetaMask."
            );
          }
        } else {
          throw new Error(
            "Địa chỉ ví không được cung cấp và không có ethereum provider."
          );
        }
      }

      // Validate address format
      if (!senderAddress.startsWith("0x") || senderAddress.length !== 42) {
        throw new Error(`Địa chỉ ví không hợp lệ: ${senderAddress}`);
      }

      // Thực hiện giao dịch chuyển token trực tiếp
      // (Contract sẽ reject nếu insufficient balance)
      console.log(`📍 Step 5: Sending transaction from ${senderAddress}...`);
      const receipt = await contract.methods
        .transfer(recipientAddress, requiredWei)
        .send({
          from: senderAddress,
          gas: String(gasLimit),
          gasPrice,
        });

      console.log(`✅ Transaction sent: ${(receipt as any)?.transactionHash}`);

      // Trích xuất thông tin từ receipt
      const recipient = this.extractRecipientFromReceipt(
        receipt,
        recipientAddress
      );
      const blockNumber = this.normalizeBlockNumber(
        (receipt as any)?.blockNumber
      );

      // Trả về kết quả giao dịch
      return {
        transactionHash: (receipt as any)?.transactionHash,
        blockNumber,
        recipient,
        tokenType,
        amount: String(amount),
        rawReceipt: receipt,
      };
    } catch (error: any) {
      console.error(`❌ transferToken Error:`, error);
      const errorMessage =
        error?.message || error?.toString() || "Unknown error";
      throw new Error(`Lỗi chuyển ${params.tokenType}: ${errorMessage}`);
    }
  }

  // check phí gas để gửi giao dịch USDC mua CAN
  static async checkGasFeeUSDCTransfer(params: {
    fromAddress: string;
    amount: number;
    gasLimit?: number;
    gasBoostPercent?: number;
  }): Promise<any> {
    const {
      fromAddress,
      amount,
      gasLimit = 150000,
      gasBoostPercent = 50,
    } = params;
    // 1. Khởi tạo Web3 và lấy contract của USDC token
    const web3 = await this.getWeb3();
    const tokenAddress = this.getTokenAddress("USDC");
    const contract = this.getTokenContract(web3, tokenAddress);

    // 2. Kiểm tra số dư USDC của người gửi
    const balanceWei = await contract.methods.balanceOf(fromAddress).call();
    const requiredWei = this.toWeiWithDecimals(String(amount), 6);

    if (BigInt(balanceWei) < BigInt(requiredWei)) {
      const availableBalance = this.fromWeiWithDecimals(web3, balanceWei, 6);
      console.error(
        `Số dư USDC không đủ. Cần: ${amount} USDC, Có sẵn: ${availableBalance} USDC`
      );
      return {
        result: false,
        message: `Số dư USDC không đủ. Bạn chỉ còn ${availableBalance} USDC`,
      };
    }

    // 3. Tính toán gas price tối ưu
    const gasPrice = await this.getOptimizedGasPrice(web3, gasBoostPercent);
    const gasPriceFormattedForDisplay = this.formatGweiFromWei(gasPrice);

    return {
      result: true,
      message: gasPriceFormattedForDisplay,
    };
  }

  private static formatGweiFromWei(wei: string): string {
    const value = BigInt(wei || "0");
    const base = BigInt(1_000_000_000); // 1e9
    const whole = value / base;
    const frac = (value % base).toString().padStart(9, "0");
    return `${whole}.${frac}`.replace(/\.0+$/, "");
  }

  /**
   * Chuyển USDC từ ví này sang ví khác (với xử lý decimals chính xác cho USDC - 6 decimals)
   * @param fromAddress - Địa chỉ ví người gửi
   * @param toAddress - Địa chỉ người nhận (mặc định là admin)
   * @param amount - Số lượng USDC cần chuyển
   * @param gasLimit - Giới hạn gas (mặc định 150000)
   * @param gasBoostPercent - % tăng gas price (mặc định 50%)
   */
  static async sendUSDCTransfer(params: {
    fromAddress: string;
    toAddress?: string;
    amount: number;
    gasLimit?: number;
    gasBoostPercent?: number;
  }): Promise<TransferResult> {
    const {
      fromAddress,
      toAddress,
      amount,
      gasLimit = 150000,
      gasBoostPercent = 50,
    } = params;

    // Nếu không có địa chỉ người nhận, mặc định gửi về admin
    const recipientAddress = toAddress || config.WALLET_ADDRESSES.ADMIN;

    // 1. Khởi tạo Web3 và lấy contract của USDC token
    const web3 = await this.getWeb3();
    const tokenAddress = this.getTokenAddress("USDC");
    const contract = this.getTokenContract(web3, tokenAddress);

    // 2. Kiểm tra số dư USDC của người gửi
    const balanceWei = await contract.methods.balanceOf(fromAddress).call();
    const requiredWei = this.toWeiWithDecimals(String(amount), 6);

    if (BigInt(balanceWei) < BigInt(requiredWei)) {
      const availableBalance = this.fromWeiWithDecimals(web3, balanceWei, 6);
      throw new Error(
        `Số dư USDC không đủ. Cần: ${amount} USDC, Có sẵn: ${availableBalance} USDC`
      );
    }

    // 3. Tính toán gas price tối ưu
    const gasPrice = await this.getOptimizedGasPrice(web3, gasBoostPercent);

    // 4. Thực hiện giao dịch chuyển USDC
    const receipt = await contract.methods
      .transfer(recipientAddress, requiredWei)
      .send({
        from: fromAddress,
        gas: String(gasLimit),
        gasPrice,
      });

    // 5. Trích xuất thông tin từ receipt
    const recipient = this.extractRecipientFromReceipt(
      receipt,
      recipientAddress
    );
    const blockNumber = this.normalizeBlockNumber(
      (receipt as any)?.blockNumber
    );

    // 6. Trả về kết quả giao dịch
    return {
      transactionHash: (receipt as any)?.transactionHash,
      blockNumber,
      recipient,
      tokenType: "USDC",
      amount: String(amount),
      rawReceipt: receipt,
    };
  }

  /**
   * @deprecated Sử dụng transferToken() thay thế
   * Hàm cũ để tương thích ngược - sẽ bị loại bỏ trong tương lai
   */
  static async sendCanTransfer(params: {
    fromAddress: string;
    toAddressData?: string;
    amountCan: number;
    gasLimit?: number;
    gasBoostPercent?: number;
  }): Promise<{
    transactionHash: string;
    blockNumber: string;
    recipient: string;
    rawReceipt: any;
  }> {
    // Map từ tham số cũ sang tham số mới
    const tokenType: TokenType = "CAN";

    const result = await this.transferToken({
      fromAddress: params.fromAddress,
      toAddress: params.toAddressData,
      amount: params.amountCan,
      tokenType,
      gasLimit: params.gasLimit,
      gasBoostPercent: params.gasBoostPercent,
    });

    // Trả về format cũ để tương thích
    return {
      transactionHash: result.transactionHash,
      blockNumber: result.blockNumber,
      recipient: result.recipient,
      rawReceipt: result.rawReceipt,
    };
  }

  /**
   * Chuyển NFT (ERC-721) từ ví này sang ví khác
   * @param params - Tham số chuyển NFT
   * @returns Kết quả giao dịch
   */
  static async transferNFT(params: {
    fromAddress: string;
    toAddress?: string; // Mặc định là admin
    contractAddress: string;
    tokenId: string | number;
  }): Promise<{
    transactionHash: string;
    blockNumber: string;
    recipient: string;
    gasUsed: string;
    gasPrice: string;
    totalGasCost: string;
    rawReceipt: any;
  }> {
    const { fromAddress, toAddress, contractAddress, tokenId } = params;

    const adminWalletAddress = toAddress || config.WALLET_ADDRESSES.ADMIN;

    console.log(
      `📍 transferNFT START - TokenId: ${tokenId}, From: ${fromAddress}, To: ${adminWalletAddress}, Contract: ${contractAddress}`
    );

    try {
      // 1. Kiểm tra MetaMask
      if (!(window as any).ethereum) {
        throw new Error(
          "MetaMask không được cài đặt. Vui lòng cài đặt MetaMask extension."
        );
      }

      console.log(`📍 Step 1: Importing Web3...`);
      // 2. Import web3 và tạo instance
      const web3 = await this.getWeb3();

      // 3. Validate addresses
      console.log(`📍 Step 2: Validating addresses...`);
      if (!web3.utils.isAddress(contractAddress)) {
        throw new Error("Địa chỉ contract không hợp lệ.");
      }

      if (!web3.utils.isAddress(adminWalletAddress)) {
        throw new Error("Địa chỉ ví admin không hợp lệ.");
      }

      if (!web3.utils.isAddress(fromAddress)) {
        throw new Error("Địa chỉ ví của bạn không hợp lệ.");
      }

      // 4. Kiểm tra network và tự động chuyển nếu cần
      console.log(`📍 Step 3: Checking network...`);
      const chainId = await web3.eth.getChainId();
      const expectedChainId = config.BLOCKCHAIN.CHAIN_ID;
      console.log(
        `📍 Current Chain ID: ${chainId}, Expected: ${expectedChainId}`
      );

      if (Number(chainId) !== expectedChainId) {
        console.log(`📍 Wrong network detected. Attempting to switch...`);

        try {
          // Thử chuyển network tự động
          const chainIdHex = `0x${expectedChainId.toString(16)}`;

          await (window as any).ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainIdHex }],
          });

          console.log(`✅ Switched to Chain ID: ${expectedChainId}`);

          // Đợi một chút để network switch hoàn tất
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (switchError: any) {
          console.error("❌ Failed to switch network:", switchError);

          // Nếu network chưa được thêm vào MetaMask (error code 4902)
          if (switchError.code === 4902) {
            try {
              console.log(`📍 Network not found. Attempting to add...`);

              await (window as any).ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: 80002,
                    chainName: "Polygon Amoy Testnet",
                    nativeCurrency: {
                      name: "POL",
                      symbol: "POL",
                      decimals: 18,
                    },
                    rpcUrls: [config.BLOCKCHAIN.RPC_URL],
                    blockExplorerUrls: [
                      config.BLOCKCHAIN_EXPLORER.POLYGONSCAN_AMOY,
                    ],
                  },
                ],
              });

              console.log(
                `✅ Added and switched to ${config.BLOCKCHAIN.NETWORK}`
              );

              // Đợi một chút để network switch hoàn tất
              await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (addError: any) {
              console.error("❌ Failed to add network:", addError);
              throw new Error(
                `Không thể thêm network ${config.BLOCKCHAIN.NETWORK}. Vui lòng thêm thủ công trong MetaMask.\n` +
                  `Chain ID: ${expectedChainId}\n` +
                  `RPC URL: ${config.BLOCKCHAIN.RPC_URL}`
              );
            }
          } else {
            // User từ chối chuyển network
            throw new Error(
              `Vui lòng chuyển sang network ${config.BLOCKCHAIN.NETWORK} trong MetaMask.\n` +
                `Chain ID hiện tại: ${chainId}, yêu cầu: ${expectedChainId}`
            );
          }
        }
      }

      // 5. Kiểm tra số dư native token (POL) để trả phí gas
      console.log(`📍 Step 4: Checking POL balance...`);
      const nativeBalance = await web3.eth.getBalance(fromAddress);
      const nativeBalanceInEth = web3.utils.fromWei(nativeBalance, "ether");
      const minNativeBalance = "0.001"; // Tối thiểu 0.001 POL để trả phí gas

      console.log(`📍 POL Balance: ${nativeBalanceInEth} POL`);

      if (Number(nativeBalanceInEth) < Number(minNativeBalance)) {
        throw new Error(
          `Số dư POL không đủ để trả phí gas. Cần tối thiểu ${minNativeBalance} POL, hiện có: ${Number(
            nativeBalanceInEth
          ).toFixed(6)} POL`
        );
      }

      // NFT ABI (ERC-721)
      const erc721Abi = [
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
          inputs: [
            { internalType: "address", name: "approver", type: "address" },
          ],
          name: "ERC721InvalidApprover",
          type: "error",
        },
        {
          inputs: [
            { internalType: "address", name: "operator", type: "address" },
          ],
          name: "ERC721InvalidOperator",
          type: "error",
        },
        {
          inputs: [{ internalType: "address", name: "owner", type: "address" }],
          name: "ERC721InvalidOwner",
          type: "error",
        },
        {
          inputs: [
            { internalType: "address", name: "receiver", type: "address" },
          ],
          name: "ERC721InvalidReceiver",
          type: "error",
        },
        {
          inputs: [
            { internalType: "address", name: "sender", type: "address" },
          ],
          name: "ERC721InvalidSender",
          type: "error",
        },
        {
          inputs: [
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
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
          inputs: [
            { internalType: "address", name: "account", type: "address" },
          ],
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
          inputs: [
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
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
          inputs: [
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
          name: "getApproved",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
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
          inputs: [
            { internalType: "string", name: "tokenURI", type: "string" },
          ],
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
          inputs: [
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
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
          inputs: [
            { internalType: "string", name: "newBaseURI", type: "string" },
          ],
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
          inputs: [
            { internalType: "uint256", name: "newPrice", type: "uint256" },
          ],
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
          inputs: [
            { internalType: "bytes4", name: "interfaceId", type: "bytes4" },
          ],
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
          inputs: [
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
          name: "tokenCreator",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
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
          inputs: [
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
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
          inputs: [
            { internalType: "address", name: "newOwner", type: "address" },
          ],
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

      const contract = new web3.eth.Contract(erc721Abi, contractAddress);

      // 7. Kiểm tra owner trước khi transfer
      console.log(`📍 Step 6: Checking NFT owner...`);
      let ownerAddress: string;
      try {
        const ownerAddressResult = await contract.methods
          .ownerOf(String(tokenId))
          .call();
        // Xử lý kết quả ownerOf (có thể là string hoặc array)
        ownerAddress =
          typeof ownerAddressResult === "string"
            ? ownerAddressResult
            : Array.isArray(ownerAddressResult) && ownerAddressResult.length > 0
            ? String(ownerAddressResult[0])
            : String(ownerAddressResult);

        console.log(
          `📍 NFT Owner: ${ownerAddress}, Your wallet: ${fromAddress}`
        );

        if (ownerAddress.toLowerCase() !== fromAddress.toLowerCase()) {
          throw new Error(
            `Bạn không phải là chủ sở hữu của NFT này. Owner hiện tại: ${ownerAddress.slice(
              0,
              6
            )}...${ownerAddress.slice(-4)}`
          );
        }
      } catch (ownerError: any) {
        console.error("❌ Error checking owner:", ownerError);
        const errorMsg = ownerError?.message || "";
        if (
          errorMsg.includes("nonexistent token") ||
          errorMsg.includes("ERC721: invalid token ID")
        ) {
          throw new Error("Token ID không tồn tại trên contract này.");
        } else if (errorMsg.includes("không phải là chủ sở hữu")) {
          throw ownerError; // Re-throw owner error
        } else {
          throw new Error(
            "Không thể kiểm tra quyền sở hữu NFT. Vui lòng thử lại."
          );
        }
      }

      // 8. Tạo transaction - thử transferFrom trước
      console.log(`📍 Step 7: Creating transfer transaction...`);
      let transaction: any;
      let useTransferFrom = true; // Mặc định dùng transferFrom

      try {
        console.log(`📍 Trying transferFrom...`);
        transaction = contract.methods.transferFrom(
          fromAddress,
          adminWalletAddress,
          String(tokenId)
        );

        // Bỏ qua gas estimation để tránh lỗi Internal JSON-RPC
        // MetaMask sẽ tự động estimate gas khi send transaction
        console.log(`📍 Skipping gas estimation (will be done by MetaMask)...`);
      } catch (transferError: any) {
        console.warn(
          "❌ transferFrom failed, trying safeTransferFrom:",
          transferError?.message || transferError
        );

        // Fallback sang safeTransferFrom
        useTransferFrom = false;
        try {
          console.log(`📍 Trying safeTransferFrom...`);
          transaction = contract.methods.safeTransferFrom(
            fromAddress,
            adminWalletAddress,
            String(tokenId)
          );
          console.log(
            `📍 Skipping gas estimation (will be done by MetaMask)...`
          );
        } catch (safeTransferError: any) {
          console.error("❌ Both methods failed:", safeTransferError);

          // Log chi tiết lỗi
          console.error("Error details:", {
            message: safeTransferError?.message,
            code: safeTransferError?.code,
            data: safeTransferError?.data,
          });

          // Kiểm tra các lỗi cụ thể
          const errorMsg = safeTransferError?.message?.toLowerCase() || "";
          if (errorMsg.includes("execution reverted")) {
            throw new Error(
              "Không thể chuyển NFT. Có thể NFT đã được approve cho contract khác hoặc bị khóa."
            );
          } else if (errorMsg.includes("nonexistent token")) {
            throw new Error("Token ID không tồn tại trên contract.");
          } else {
            throw new Error(
              safeTransferError?.message ||
                "Không thể tạo transaction. Vui lòng kiểm tra lại contract và token ID."
            );
          }
        }
      }

      console.log(
        `📍 Using transfer method: ${
          useTransferFrom ? "transferFrom" : "safeTransferFrom"
        }`
      );

      // 9. Estimate gas và lấy gas price trước khi gửi transaction
      console.log(`📍 Step 8: Estimating gas and preparing transaction...`);
      console.log(`📍 Transaction params:`, {
        from: fromAddress,
        to: adminWalletAddress,
        tokenId: tokenId,
        contract: contractAddress,
      });

      let gasLimit: number;
      let gasPrice: string;

      // Estimate gas với error handling
      try {
        debugger;
        console.log(`📍 Estimating gas for transaction...`);
        const estimatedGas = await transaction.estimateGas({
          from: fromAddress,
        });
        // Thêm buffer 20% để đảm bảo transaction không bị out of gas
        gasLimit = Math.floor(Number(estimatedGas) * 1.2);
        console.log(
          `📍 Estimated gas: ${estimatedGas}, With buffer: ${gasLimit}`
        );
        debugger;
      } catch (gasEstimateError: any) {
        console.warn(
          "⚠️ Gas estimation failed, using default gas limit:",
          gasEstimateError?.message || gasEstimateError
        );
        // Sử dụng gas limit mặc định cho NFT transfer nếu estimate fail
        gasLimit = 200000; // Default gas limit cho ERC-721 transfer
        console.log(`📍 Using default gas limit: ${gasLimit}`);
      }

      // Lấy gas price từ network
      try {
        console.log(`📍 Getting current gas price from network...`);
        const currentGasPrice = await web3.eth.getGasPrice();
        gasPrice =
          typeof currentGasPrice === "string"
            ? currentGasPrice
            : String(currentGasPrice);
        console.log(`📍 Current gas price: ${gasPrice} wei`);
      } catch (gasPriceError: any) {
        console.warn(
          "⚠️ Failed to get gas price, using default:",
          gasPriceError?.message || gasPriceError
        );
        // Sử dụng gas price mặc định nếu không lấy được (20 gwei = 20000000000 wei)
        gasPrice = "20000000000";
        console.log(`📍 Using default gas price: ${gasPrice} wei (20 gwei)`);
      }

      // 10. Gửi transaction với gas limit và gas price đã chuẩn bị
      console.log(
        `📍 Step 9: Sending transaction with gas limit: ${gasLimit}, gas price: ${gasPrice}...`
      );
      let receipt: any;
      try {
        receipt = await transaction.send({
          from: fromAddress,
          gas: gasLimit,
          gasPrice: gasPrice,
        });
        console.log(
          `✅ Transaction sent successfully: ${receipt?.transactionHash}`
        );
      } catch (sendError: any) {
        console.error("❌ Error sending transaction:", sendError);
        console.error("Send error details:", {
          message: sendError?.message,
          code: sendError?.code,
          data: sendError?.data,
          error: sendError?.error,
        });

        // Xử lý các lỗi cụ thể
        const errorMsg = (
          sendError?.message ||
          sendError?.error?.message ||
          ""
        ).toLowerCase();

        if (
          errorMsg.includes("user rejected") ||
          errorMsg.includes("user denied") ||
          errorMsg.includes("user cancelled")
        ) {
          throw new Error("Bạn đã hủy giao dịch.");
        } else if (
          errorMsg.includes("insufficient funds") ||
          errorMsg.includes("insufficient balance")
        ) {
          throw new Error("Số dư POL không đủ để trả phí gas.");
        } else if (
          errorMsg.includes("execution reverted") ||
          errorMsg.includes("revert")
        ) {
          throw new Error(
            "Giao dịch bị từ chối. Vui lòng kiểm tra lại quyền sở hữu NFT hoặc contract có hỗ trợ transfer không."
          );
        } else if (
          errorMsg.includes("internal json-rpc error") ||
          errorMsg.includes("json-rpc") ||
          errorMsg.includes("jsonrpc") ||
          sendError?.code === -32603
        ) {
          // Nếu vẫn lỗi Internal JSON-RPC, thử lại với gas limit cao hơn
          console.log(`📍 Retrying with higher gas limit...`);
          try {
            const higherGasLimit = Math.floor(gasLimit * 1.5); // Tăng thêm 50%
            receipt = await transaction.send({
              from: fromAddress,
              gas: higherGasLimit,
              gasPrice: gasPrice,
            });
            console.log(
              `✅ Transaction sent with higher gas limit: ${receipt?.transactionHash}`
            );
          } catch (retryError: any) {
            console.error("❌ Retry also failed:", retryError);
            throw new Error(
              "Lỗi kết nối với blockchain khi gửi transaction. Vui lòng:\n" +
                "1. Kiểm tra network đã đúng chưa? (Polygon Amoy - Chain ID: 80002)\n" +
                "2. Kiểm tra contract address và token ID có hợp lệ không?\n" +
                "3. Kiểm tra bạn có đủ POL để trả phí gas không?\n" +
                "4. Thử lại sau vài giây"
            );
          }
        } else {
          // Re-throw với message gốc
          throw new Error(
            sendError?.message ||
              sendError?.error?.message ||
              "Có lỗi xảy ra khi gửi transaction. Vui lòng thử lại."
          );
        }
      }

      // 11. Xử lý kết quả
      if (!receipt.transactionHash) {
        throw new Error("Không thể lấy transaction hash.");
      }

      // Lấy thông tin về phí gas đã sử dụng
      const gasUsed = receipt.gasUsed || receipt.receipt?.gasUsed || "0";
      const actualGasPrice =
        receipt.gasPrice || receipt.receipt?.effectiveGasPrice || "0";
      const totalGasCost = BigInt(gasUsed) * BigInt(actualGasPrice);
      const gasCostInEth = web3.utils.fromWei(totalGasCost.toString(), "ether");

      console.log(
        `✅ Gas used: ${gasUsed}, Gas price: ${actualGasPrice}, Total cost: ${gasCostInEth} POL`
      );

      const blockNumber = this.normalizeBlockNumber(receipt?.blockNumber);

      return {
        transactionHash: receipt.transactionHash,
        blockNumber,
        recipient: adminWalletAddress,
        gasUsed: String(gasUsed),
        gasPrice: String(actualGasPrice),
        totalGasCost: gasCostInEth,
        rawReceipt: receipt,
      };
    } catch (error: any) {
      console.error("❌ transferNFT Error:", error);
      const errorMessage =
        error?.message || error?.toString() || "Unknown error";
      throw new Error(`Lỗi chuyển NFT: ${errorMessage}`);
    }
  }
}
