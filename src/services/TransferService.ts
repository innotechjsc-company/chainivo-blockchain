import { config } from "@/api/config";

type Web3Type = any;
type ContractType = any;

export default class TransferService {
  // Minimal ERC-20 ABI for balanceOf/transfer
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

  static async getWeb3(): Promise<Web3Type> {
    const web3Module = await import("web3");
    return new web3Module.default((window as any).ethereum);
  }

  static getTokenContract(web3: Web3Type, tokenAddress: string): ContractType {
    return new web3.eth.Contract(this.erc20Abi, tokenAddress);
  }

  static toWei(web3: Web3Type, amount: string): string {
    return web3.utils.toWei(amount, "ether");
  }

  static fromWei(web3: Web3Type, amountWei: string): string {
    return web3.utils.fromWei(amountWei, "ether");
  }

  static async getOptimizedGasPrice(
    web3: Web3Type,
    boostPercent = 50
  ): Promise<string> {
    const current = await web3.eth.getGasPrice();
    const currentBigInt =
      typeof current === "bigint" ? current : BigInt(current);
    const boosted = (currentBigInt * BigInt(100 + boostPercent)) / BigInt(100);
    return boosted.toString();
  }

  static extractRecipientFromReceipt(receipt: any, fallback: string): string {
    try {
      const evt = receipt?.events?.Transfer || receipt?.events?.["Transfer"];
      const first = Array.isArray(evt) ? evt[0] : evt;
      const toAddr = first?.returnValues?.to ?? first?.returnValues?.[1];
      if (typeof toAddr === "string" && toAddr.startsWith("0x")) return toAddr;
    } catch {}
    return fallback;
  }

  static normalizeBlockNumber(blockNumber: any): string {
    if (typeof blockNumber === "bigint") return blockNumber.toString();
    if (blockNumber == null) return "";
    return String(blockNumber);
  }

  static async sendCanTransfer(params: {
    fromAddress: string;
    toAddressData?: string; // default admin address
    amountCan: number;
    gasLimit?: number;
    gasBoostPercent?: number;
  }): Promise<{
    transactionHash: string;
    blockNumber: string;
    recipient: string;
    rawReceipt: any;
  }> {
    const {
      fromAddress,
      amountCan,
      toAddressData,
      gasLimit = 150000,
      gasBoostPercent = 50,
    } = params;
    const toAddress = params.toAddressData
      ? params.toAddressData
      : config.WALLET_ADDRESSES.ADMIN;
    debugger;
    const web3 = await this.getWeb3();
    const tokenAddress = config.BLOCKCHAIN.CAN_TOKEN_ADDRESS;
    const contract = this.getTokenContract(web3, tokenAddress);

    // Balance check
    const canBalanceWei = await contract.methods.balanceOf(fromAddress).call();
    const requiredWei = this.toWei(web3, String(amountCan));
    if (BigInt(canBalanceWei) < BigInt(requiredWei)) {
      throw new Error(
        `Insufficient CAN balance. Required: ${amountCan} CAN, Available: ${this.fromWei(
          web3,
          canBalanceWei
        )} CAN`
      );
    }

    const gasPrice = await this.getOptimizedGasPrice(web3, gasBoostPercent);

    const receipt = await contract.methods
      .transfer(toAddress, requiredWei)
      .send({
        from: fromAddress,
        gas: String(gasLimit),
        gasPrice,
      });

    const recipient = this.extractRecipientFromReceipt(receipt, toAddress);
    const blockNumber = this.normalizeBlockNumber(
      (receipt as any)?.blockNumber
    );

    return {
      transactionHash: (receipt as any)?.transactionHash,
      blockNumber,
      recipient,
      rawReceipt: receipt,
    };
  }
}

// stray duplicate content removed
