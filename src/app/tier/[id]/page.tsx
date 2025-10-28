"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NFT, useAppSelector } from "@/stores";
import { toast } from "sonner";
import { buildFrontendUrl, config } from "@/api/config";
import {
  Crown,
  Star,
  Zap,
  CheckCircle2,
  Users,
  TrendingUp,
  ArrowLeft,
  Shield,
  Sparkles,
  Gift,
  Target,
  Clock,
  Package,
  DollarSign,
  Loader2,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { NFTService } from "@/api/services";

// MetaMask types
interface MetaMaskProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: MetaMaskProvider;
  }
}

const tierData = {
  bronze: {
    name: "Bronze",
    icon: Star,
    color: "from-amber-700 to-amber-900",
    price: 50,
    usdPrice: 10,
    buyers: 1247,
    nftDropRate: [
      { rarity: "Common", rate: 70, color: "text-gray-400" },
      { rarity: "Rare", rate: 25, color: "text-blue-400" },
      { rarity: "Epic", rate: 5, color: "text-purple-400" },
    ],
    benefits: [
      {
        title: "Phí giao dịch giảm 5%",
        description: "Tiết kiệm chi phí mỗi giao dịch",
      },
      {
        title: "Truy cập NFT cơ bản",
        description: "Mở khóa bộ sưu tập NFT Bronze",
      },
      { title: "1 nhiệm vụ/ngày", description: "Nhận phần thưởng hàng ngày" },
      { title: "Hỗ trợ cơ bản", description: "Email support 24/7" },
    ],
    stats: {
      totalSold: 1247,
      avgRating: 4.5,
      holders: 1189,
    },
  },
  silver: {
    name: "Silver",
    icon: Zap,
    color: "from-gray-400 to-gray-600",
    price: 250,
    usdPrice: 50,
    buyers: 856,
    nftDropRate: [
      { rarity: "Rare", rate: 50, color: "text-blue-400" },
      { rarity: "Epic", rate: 40, color: "text-purple-400" },
      { rarity: "Legendary", rate: 10, color: "text-orange-400" },
    ],
    benefits: [
      {
        title: "Phí giao dịch giảm 10%",
        description: "Tiết kiệm gấp đôi so với Bronze",
      },
      { title: "Truy cập NFT cao cấp", description: "NFT với giá trị cao hơn" },
      { title: "3 nhiệm vụ/ngày", description: "Nhiều cơ hội kiếm thưởng hơn" },
      { title: "Bonus staking +5%", description: "Thu nhập thêm từ staking" },
      { title: "Hỗ trợ ưu tiên", description: "Chat support nhanh chóng" },
    ],
    stats: {
      totalSold: 856,
      avgRating: 4.7,
      holders: 798,
    },
  },
  gold: {
    name: "Gold",
    icon: Crown,
    color: "from-yellow-400 to-yellow-600",
    price: 750,
    usdPrice: 150,
    buyers: 423,
    nftDropRate: [
      { rarity: "Epic", rate: 50, color: "text-purple-400" },
      { rarity: "Legendary", rate: 40, color: "text-orange-400" },
      { rarity: "Mythic", rate: 10, color: "text-red-400" },
    ],
    benefits: [
      { title: "Phí giao dịch giảm 15%", description: "Tiết kiệm tối đa" },
      { title: "Truy cập toàn bộ NFT", description: "Không giới hạn NFT" },
      { title: "5 nhiệm vụ/ngày", description: "Tối đa hóa thu nhập" },
      { title: "Bonus staking +10%", description: "Lợi nhuận staking cao" },
      { title: "Airdrop độc quyền", description: "Nhận airdrop đặc biệt" },
      { title: "Hỗ trợ VIP 24/7", description: "Dedicated support team" },
    ],
    stats: {
      totalSold: 423,
      avgRating: 4.9,
      holders: 401,
    },
  },
  platinum: {
    name: "Platinum",
    icon: Crown,
    color: "from-cyan-400 to-purple-600",
    price: 2500,
    usdPrice: 500,
    buyers: 127,
    nftDropRate: [
      { rarity: "Legendary", rate: 60, color: "text-orange-400" },
      { rarity: "Mythic", rate: 30, color: "text-red-400" },
      { rarity: "Divine", rate: 10, color: "text-cyan-400" },
    ],
    benefits: [
      { title: "Phí giao dịch MIỄN PHÍ", description: "0% phí mọi giao dịch" },
      { title: "NFT độc quyền", description: "NFT hiếm nhất hệ thống" },
      {
        title: "Nhiệm vụ không giới hạn",
        description: "Làm bao nhiêu cũng được",
      },
      { title: "Bonus staking +20%", description: "Thu nhập cực cao" },
      { title: "Airdrop VIP", description: "Airdrop giá trị nhất" },
      {
        title: "Quản lý tài khoản riêng",
        description: "Personal account manager",
      },
      { title: "Sự kiện đặc biệt", description: "Tham gia event VIP" },
    ],
    stats: {
      totalSold: 127,
      avgRating: 5.0,
      holders: 120,
    },
  },
};

interface TierDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// CAN Token contract address (for ERC-20 transfers)
const CAN_TOKEN_CONTRACT = config.BLOCKCHAIN.CAN_TOKEN_ADDRESS;
// Destination wallet address (where tokens will be sent)
const DESTINATION_WALLET = "0x7c4767673cc6024365e08f2af4369b04701a5fed";

export default function TierDetailPage({ params }: TierDetailPageProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user from Redux store
  const { user } = useAppSelector((state) => state.auth);

  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);
  const tier = tierData[resolvedParams?.id as keyof typeof tierData];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log(tier);
  }, [tier]);

  /**
   * Helper function to encode ERC-20 transfer data
   * Creates the data field for calling transfer(address,uint256) function on ERC-20 contract
   * @param toAddress - Destination wallet address
   * @param amount - Amount of tokens to transfer (in token units, not wei)
   * @returns Encoded data string starting with 0x
   */
  const encodeERC20Transfer = (toAddress: string, amount: number): string => {
    // Validate inputs
    if (!toAddress || !toAddress.startsWith("0x") || toAddress.length !== 42) {
      throw new Error("Invalid destination address");
    }

    if (amount <= 0 || !isFinite(amount)) {
      throw new Error("Invalid amount");
    }

    // Helper function to encode address (remove 0x and pad to 64 chars)
    const encodeAddress = (address: string): string => {
      return address.slice(2).toLowerCase().padStart(64, "0");
    };

    // Helper function to encode uint256 (convert to hex and pad to 64 chars)
    const encodeUint256 = (value: bigint): string => {
      return value.toString(16).padStart(64, "0");
    };

    // Convert amount to wei (18 decimals) with proper rounding
    const amountWei = BigInt(Math.floor(amount * Math.pow(10, 18)));

    // ERC-20 transfer function selector (transfer(address,uint256))
    const functionSelector = "a9059cbb";

    // Encode parameters
    const encodedTo = encodeAddress(toAddress);
    const encodedAmount = encodeUint256(amountWei);

    // Combine function selector with encoded parameters
    return "0x" + functionSelector + encodedTo + encodedAmount;
  };

  /**
   * Function to create ERC-20 token transfer transaction
   * Sends CAN tokens from user's wallet to destination address
   * @param fromAddress - Sender's wallet address
   * @param amount - Amount of CAN tokens to transfer
   * @returns Transaction hash
   */

  const createNFTInDatabase = async (nftData: any) => {
    try {
      // Get authentication token
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await NFTService.mintNFT({
        toAddress: user?.walletAddress as string,
        tokenURI: `ipfs://nft_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        name: nftData.name,
        description: `NFT from ${nftData.collection.name}`,
        image: nftData.image,
        attributes: [
          { trait_type: "Rarity", value: nftData.rarity },
          { trait_type: "Collection", value: nftData.collection.name },
        ],
        collection: nftData.collection,
        walletAddress: user?.walletAddress as string,
        mintOnBlockchain: false, // ✅ Không mint trên blockchain ngay
        fromMysteryBox: true,
      });
      console.log(response);
      debugger;

      // const response = await fetch(buildApiUrl(config.API_ENDPOINTS.NFT.MINT), {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({
      //     toAddress: walletAddress,
      //     tokenURI: `ipfs://nft_${Date.now()}_${Math.random()
      //       .toString(36)
      //       .substr(2, 9)}`,
      //     name: nftData.name,
      //     description: `NFT from ${nftData.collection.name}`,
      //     image: nftData.image,
      //     attributes: [
      //       { trait_type: "Rarity", value: nftData.rarity },
      //       { trait_type: "Collection", value: nftData.collection.name },
      //     ],
      //     collection: nftData.collection,
      //     creatorAddress: walletAddress,
      //     mintOnBlockchain: false, // ✅ Không mint trên blockchain ngay
      //     fromMysteryBox: true,
      //   }),
      // });

      // if (response.ok) {
      //   const result = await response.json();
      //   // NFT minted successfully
      //   return result;
      // } else {
      //   const errorData = await response.json().catch(() => ({}));
      //   throw new Error(
      //     errorData.message || `Failed to mint NFT: ${response.status}`
      //   );
      // }
    } catch (error) {
      console.error("Error minting NFT:", error);
      throw error;
    }
  };

  const createTransaction = async (fromAddress: string, amount: number) => {
    try {
      if (!window.ethereum) {
        throw new Error(
          "MetaMask không được cài đặt. Vui lòng cài đặt MetaMask extension."
        );
      }

      // Validate from address
      if (
        !fromAddress ||
        !fromAddress.startsWith("0x") ||
        fromAddress.length !== 42
      ) {
        throw new Error("Invalid sender address");
      }

      // Encode ERC-20 transfer data
      const data = encodeERC20Transfer(DESTINATION_WALLET, amount);

      // Request transaction
      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: fromAddress,
            to: CAN_TOKEN_CONTRACT, // Token contract address
            value: "0x0", // No ETH value for ERC-20 transfer
            data: data,
            gas: "0xC350", // 50000 gas limit for ERC-20 transfer
          },
        ],
      });

      const rarities = ["common", "uncommon", "rare", "epic", "legendary"];

      const getMembershipTierImage = (rarity: string) => {
        switch (rarity.toLowerCase()) {
          case "legendary":
            return buildFrontendUrl("/images/membership/tier-5-diamond.png");
          case "epic":
            return buildFrontendUrl("/images/membership/tier-4-gold.png");
          case "rare":
            return buildFrontendUrl("/images/membership/tier-3-silver.png");
          case "uncommon":
            return buildFrontendUrl("/images/membership/tier-2-bronze.png");
          case "common":
          default:
            return buildFrontendUrl("/images/membership/tier-1-common.png");
        }
      };

      // Helper to get a random item from array
      const getRandomItem = <T,>(arr: T[]): T =>
        arr[Math.floor(Math.random() * arr.length)];
      const randomRarity = getRandomItem(rarities);

      const newNFT: NFT = {
        _id: `nft_${Date.now()}`,
        name: `${tier.name.charAt(0).toUpperCase() + tier.name.slice(1)} NFT`,
        image: getMembershipTierImage(randomRarity),
        rarity: randomRarity as "common" | "rare" | "epic" | "legendary",
        collection: {
          name: "Mystery Box Collection",
        },
      };

      const result = await createNFTInDatabase(newNFT);
      return result;
    } catch (error: any) {
      console.error("Transaction error:", error);

      // Handle specific error cases
      if (error.code === 4001) {
        throw new Error("Người dùng đã từ chối giao dịch");
      } else if (error.code === -32603) {
        throw new Error("Lỗi nội bộ. Vui lòng thử lại.");
      } else if (error.message?.includes("insufficient funds")) {
        throw new Error("Số dư không đủ để thực hiện giao dịch");
      } else if (error.message?.includes("gas")) {
        throw new Error("Lỗi gas. Vui lòng thử lại.");
      } else if (error.message?.includes("Invalid")) {
        throw new Error(error.message);
      } else {
        throw new Error(error.message || "Có lỗi xảy ra khi tạo giao dịch");
      }
    }
  };

  const handlePurchase = async () => {
    if (!tier) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Check if MetaMask is installed
      if (!window.ethereum?.isMetaMask) {
        throw new Error(
          "MetaMask không được cài đặt. Vui lòng cài đặt MetaMask extension."
        );
      }

      // Check if user has wallet connected
      if (!user?.walletAddress) {
        throw new Error("Vui lòng kết nối ví trước khi mua hàng.");
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("Không có ví nào được kết nối.");
      }

      const walletAddress = accounts[0];
      const totalPrice = tier.price * quantity;

      // Create transaction
      toast.loading("Đang tạo giao dịch...", { id: "purchase" });

      const txHash = await createTransaction(walletAddress, totalPrice);

      toast.success(`Giao dịch thành công!`);

      // Reset form
      setQuantity(1);
    } catch (error: any) {
      console.error("Purchase error:", error);
      setError(error.message);

      if (error.code === 4001) {
        toast.error("Người dùng đã từ chối giao dịch", { id: "purchase" });
      } else {
        toast.error(error.message, { id: "purchase" });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tier) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Không tìm thấy gói hạng</h1>
            <Button onClick={() => router.push("/membership")}>Quay lại</Button>
          </div>
        </main>
      </div>
    );
  }

  const Icon = tier.icon;
  const totalPrice = tier.price * quantity;
  const totalUsdPrice = tier.usdPrice * quantity;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-4 animate-fade-in"
          onClick={() => router.push("/membership")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left side - Image and basic info */}
          <div className="lg:col-span-7 space-y-6">
            {/* Hero Image */}
            <Card className="glass border-border/50 overflow-hidden animate-fade-in">
              <div
                className={`bg-gradient-to-br ${tier.color} p-12 flex items-center justify-center relative`}
              >
                <div className="w-64 h-64 flex items-center justify-center bg-white/10 rounded-full animate-scale-in">
                  <Icon className="w-32 h-32 text-white" />
                </div>
                <Badge className="absolute top-4 right-4 bg-background/80 backdrop-blur">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  PHỔ BIẾN
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {tier.name} Membership
                    </h1>
                    <p className="text-muted-foreground">
                      Nâng cấp tài khoản lên hạng {tier.name} để mở khóa đặc
                      quyền cao cấp
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-muted/30 rounded-lg p-3 text-center">
                    <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <div className="text-xs text-muted-foreground">Đã bán</div>
                    <div className="text-lg font-bold">
                      {tier.stats.totalSold}
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 text-center">
                    <Shield className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <div className="text-xs text-muted-foreground">Holders</div>
                    <div className="text-lg font-bold">
                      {tier.stats.holders}
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 text-center">
                    <Star className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <div className="text-xs text-muted-foreground">
                      Đánh giá
                    </div>
                    <div className="text-lg font-bold">
                      {tier.stats.avgRating}/5
                    </div>
                  </div>
                </div>

                {/* NFT Drop Rates */}
                <div className="bg-muted/20 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Tỉ lệ rơi NFT
                  </h3>
                  <div className="space-y-3">
                    {tier.nftDropRate.map((drop) => (
                      <div key={drop.rarity}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={drop.color}>{drop.rarity}</span>
                          <span className="font-semibold">{drop.rate}%</span>
                        </div>
                        <Progress value={drop.rate} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card
              className="glass border-border/50 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  Đặc quyền thành viên
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tier.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm">
                        {benefit.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {benefit.description}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card
              className="glass border-border/50 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Thông tin quan trọng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-primary" />
                  <div>
                    <span className="font-semibold">Thời hạn:</span> Trọn đời,
                    không hết hạn
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-2">
                  <Package className="w-4 h-4 mt-0.5 text-primary" />
                  <div>
                    <span className="font-semibold">NFT:</span> Nhận ngay sau
                    khi mua, mở hộp tự động
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 mt-0.5 text-primary" />
                  <div>
                    <span className="font-semibold">Bảo mật:</span> 100% an
                    toàn, có thể giao dịch lại trên P2P
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Purchase form */}
          <div className="lg:col-span-5">
            <Card
              className="glass border-border/50 sticky top-24 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Thông tin mua hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price */}
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    Giá gói
                  </div>
                  <div className="text-3xl font-bold gradient-text mb-1">
                    {tier.price} CAN
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ≈ ${tier.usdPrice} (CAN Token)
                  </div>
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Số lượng</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10"
                    >
                      -
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="text-center h-10"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-10 w-10"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tổng phụ</span>
                    <span className="font-semibold">{totalPrice} CAN</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí giao dịch</span>
                    <span className="font-semibold text-green-500">
                      Chỉ phí gas
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold">Tổng cộng</span>
                    <div className="text-right">
                      <div className="text-xl font-bold gradient-text">
                        {totalPrice} CAN
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ≈ ${totalUsdPrice}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Lỗi</span>
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {error}
                    </p>
                  </div>
                )}

                {/* Purchase Button */}
                <Button
                  className="w-full h-12 text-lg font-semibold"
                  size="lg"
                  onClick={handlePurchase}
                  disabled={isProcessing || !user?.walletAddress}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Package className="w-5 h-5 mr-2" />
                      Mua ngay
                    </>
                  )}
                </Button>

                {/* User wallet info */}
                <div className="bg-muted/20 rounded-lg p-3 text-xs text-center">
                  <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1">
                    <Wallet className="w-3 h-3" />
                    Ví của bạn
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {user?.walletAddress
                      ? `${user.walletAddress.slice(
                          0,
                          6
                        )}...${user.walletAddress.slice(-4)}`
                      : "Chưa kết nối ví"}
                  </div>
                  {user?.walletAddress && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Token: {CAN_TOKEN_CONTRACT.slice(0, 6)}...
                      {CAN_TOKEN_CONTRACT.slice(-4)}
                    </div>
                  )}
                </div>

                {/* Security badges */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-muted/20 rounded p-2">
                    <Shield className="w-4 h-4 mx-auto mb-1 text-green-500" />
                    <div>Bảo mật 100%</div>
                  </div>
                  <div className="bg-muted/20 rounded p-2">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                    <div>Giao ngay lập tức</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
