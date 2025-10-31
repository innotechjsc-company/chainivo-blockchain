import { config } from "@/api/config";

type Web3Type = any;
type ContractType = any;

// Các loại token được hỗ trợ
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
  // ERC-20 ABI chuẩn để gọi các hàm balanceOf và transfer
  private static readonly erc20Abi = [
    {
      name: "balanceOf",
      type: "function" as const,
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view" as const,
    },
    {
      name: "transfer",
      type: "function" as const,
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable" as const,
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
   * Kiểm tra số dư token của một địa chỉ ví
   */
  static async getBalance(params: {
    walletAddress: string;
    tokenType: TokenType;
  }): Promise<string> {
    const { walletAddress, tokenType } = params;

    const web3 = await this.getWeb3();
    const tokenAddress = this.getTokenAddress(tokenType);
    const contract = this.getTokenContract(web3, tokenAddress);

    // Lấy số dư dạng Wei
    const balanceWei = await contract.methods.balanceOf(walletAddress).call();

    // Chuyển đổi sang dạng thập phân để dễ đọc
    return this.fromWei(web3, balanceWei);
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

    // Nếu không có địa chỉ người nhận, mặc định gửi về admin
    const recipientAddress = toAddress || config.WALLET_ADDRESSES.ADMIN;

    // 1. Khởi tạo Web3 và lấy contract của token
    const web3 = await this.getWeb3();
    const tokenAddress = this.getTokenAddress(tokenType);
    const contract = this.getTokenContract(web3, tokenAddress);

    // 2. Kiểm tra số dư token của người gửi
    const balanceWei = await contract.methods.balanceOf(fromAddress).call();
    const requiredWei = this.toWei(web3, String(amount));

    if (BigInt(balanceWei) < BigInt(requiredWei)) {
      const availableBalance = this.fromWei(web3, balanceWei);
      throw new Error(
        `Số dư ${tokenType} không đủ. Cần: ${amount} ${tokenType}, Có sẵn: ${availableBalance} ${tokenType}`
      );
    }

    // 3. Tính toán gas price tối ưu
    const gasPrice = await this.getOptimizedGasPrice(web3, gasBoostPercent);

    // 4. Thực hiện giao dịch chuyển token
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
      tokenType,
      amount: String(amount),
      rawReceipt: receipt,
    };
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
    token?: string;
  }): Promise<{
    transactionHash: string;
    blockNumber: string;
    recipient: string;
    rawReceipt: any;
    token?: string;
  }> {
    // Map từ tham số cũ sang tham số mới
    const tokenType: TokenType = params.token === "USDT" ? "USDC" : "CAN";

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
      token: params.token,
    };
  }
}
