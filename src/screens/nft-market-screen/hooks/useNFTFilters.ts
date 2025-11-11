import { useState, useMemo, useEffect } from "react";
import { NFT } from "./useNFTData";
import NFTService from "@/api/services/nft-service";
import { useSelector } from "react-redux";
import { useAppSelector } from "@/stores";
import { toast } from "sonner";

export interface NFTFiltersState {
  rarity: string[];
  priceRange: [number, number];
  type: string;
  status?: string[];
  shares?: string[];
}

export const useNFTFilters = (nfts: NFT[]) => {
  const [filters, setFilters] = useState<NFTFiltersState>({
    rarity: [],
    priceRange: [0, 10000],
    type: "all",
  });

  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [searchNFTs, setSearchNFTs] = useState<any[]>([]);
  const [otherNFTsData, setOtherNFTsData] = useState<any[]>([]);
  const [otherNFTsAnalytics, setOtherNFTsAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mysteryBoxData, setMysteryBoxData] = useState<any[]>([]);
  const [mysteryBoxTotalPages, setMysteryBoxTotalPages] = useState(1);
  const [mysteryBoxCurrentPage, setMysteryBoxCurrentPage] = useState(1);
  const userInfo = useAppSelector((state) => state.auth.user);

  const fetchUserNFTs = async () => {
    if (!userInfo || !userInfo.walletAddress) {
      setUserNFTs([]);
      return;
    }
    try {
      const response = await NFTService.getNFTsByOwner({
        ownerAddress: userInfo?.walletAddress || "",
      });
      if (response.success) {
        setUserNFTs((response.data as any).nfts || []);
      } else {
        toast.error(response.message);
        setUserNFTs([]);
      }
    } catch (error) {
      setUserNFTs([]);
    }
  };

  const GetInfoNFT = async () => {
    const response = await NFTService.getInfoNFT();
    if (response.success) {
      setOtherNFTsAnalytics((response.data as any).metrics);
    } else {
      toast.error(response.message);
      setOtherNFTsAnalytics([]);
    }
  };

  // Ensure we always return an array for downstream components (e.g. Grid uses slice)
  const normalizeNFTCollection = (input: any): any[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (Array.isArray(input.nfts)) return input.nfts;
    if (Array.isArray(input.items)) return input.items;
    if (Array.isArray(input.data)) return input.data;
    if (input.data) return normalizeNFTCollection(input.data);
    return [];
  };

  const fetchOtherNFTs = async (page: number = 1, limit: number = 9) => {
    try {
      setLoading(true);
      const response = await NFTService.allNFTInMarketplace({
        page,
        limit,
        type: ["normal", "rank"],
      });
      if (response.success) {
        const data: any = response.data as any;

        // Lấy danh sách NFT - kiểm tra nhiều cấu trúc có thể
        let list: any[] = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data?.docs && Array.isArray(data.docs)) {
          list = data.docs;
        } else if (data?.nfts && Array.isArray(data.nfts)) {
          list = data.nfts;
        } else if (data?.items && Array.isArray(data.items)) {
          list = data.items;
        } else if (data?.data && Array.isArray(data.data)) {
          list = data.data;
        } else {
          list = normalizeNFTCollection(data);
        }

        setOtherNFTsData(list);
        // Lấy thông tin pagination từ response - ưu tiên data.totalPages
        const totalPagesFromData =
          data?.totalPages ||
          data?.data?.totalPages ||
          data?.total_pages ||
          data?.data?.total_pages;

        // Nếu có pagination object
        const pagination =
          data?.pagination ||
          data?.data?.pagination ||
          (response as any).pagination;

        if (totalPagesFromData) {
          // Ưu tiên sử dụng data.totalPages
          setTotalPages(totalPagesFromData);
          setCurrentPage(data?.page || data?.data?.page || page);
        } else if (pagination) {
          // Fallback: sử dụng pagination object
          setTotalPages(pagination.totalPages || pagination.total_pages || 1);
          setCurrentPage(pagination.page || page);
        } else {
          // Fallback cuối cùng: tính toán từ data nếu không có pagination object
          const totalItems =
            data?.total || data?.data?.total || data?.totalDocs || list.length;
          setTotalPages(Math.max(1, Math.ceil(totalItems / limit)));
          setCurrentPage(page);
        }

        const analytics =
          (data && (data.analytics || data?.data?.analytics)) ||
          (response as any).analytics ||
          null;
        setOtherNFTsAnalytics(analytics);
      } else {
        toast.error(response.message || "Không thể tải dữ liệu");
        setOtherNFTsData([]);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      toast.error("Lỗi khi tải dữ liệu NFT");
      setOtherNFTsData([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchMysteryBoxNFTs = async (page: number = 1, limit: number = 9) => {
    try {
      setLoading(true);
      const response = await NFTService.allNFTInMarketplace({
        page,
        limit,
        type: ["mysteryBox"],
      });
      if (response.success) {
        const data: any = response.data as any;

        // Lấy danh sách NFT - kiểm tra nhiều cấu trúc có thể
        let list: any[] = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data?.docs && Array.isArray(data.docs)) {
          list = data.docs;
        } else if (data?.nfts && Array.isArray(data.nfts)) {
          list = data.nfts;
        } else if (data?.items && Array.isArray(data.items)) {
          list = data.items;
        } else if (data?.data && Array.isArray(data.data)) {
          list = data.data;
        } else {
          list = normalizeNFTCollection(data);
        }

        setMysteryBoxData(list);
        // Lấy thông tin pagination từ response - ưu tiên data.totalPages
        const totalPagesFromData =
          data?.totalPages ||
          data?.data?.totalPages ||
          data?.total_pages ||
          data?.data?.total_pages;

        // Nếu có pagination object
        const pagination =
          data?.pagination ||
          data?.data?.pagination ||
          (response as any).pagination;

        if (totalPagesFromData) {
          // Ưu tiên sử dụng data.totalPages
          setMysteryBoxTotalPages(totalPagesFromData);
          setMysteryBoxCurrentPage(data?.page || data?.data?.page || page);
        } else if (pagination) {
          // Fallback: sử dụng pagination object
          setMysteryBoxTotalPages(
            pagination.totalPages || pagination.total_pages || 1
          );
          setMysteryBoxCurrentPage(pagination.page || page);
        } else {
          // Fallback cuối cùng: tính toán từ data nếu không có pagination object
          const totalItems =
            data?.total || data?.data?.total || data?.totalDocs || list.length;
          setMysteryBoxTotalPages(Math.max(1, Math.ceil(totalItems / limit)));
          setMysteryBoxCurrentPage(page);
        }

        const analytics =
          (data && (data.analytics || data?.data?.analytics)) ||
          (response as any).analytics ||
          null;
        setOtherNFTsAnalytics(analytics);
      } else {
        toast.error(response.message || "Không thể tải dữ liệu");
        setOtherNFTsData([]);
        setMysteryBoxTotalPages(1);
        setMysteryBoxCurrentPage(1);
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      toast.error("Lỗi khi tải dữ liệu NFT");
      setMysteryBoxData([]);
      setMysteryBoxTotalPages(1);
      setMysteryBoxCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  const searchMarketplace = async (
    override?: Partial<NFTFiltersState>
  ): Promise<boolean> => {
    const f = { ...filters, ...(override || {}) };
    const params: any = {
      page: 1,
      limit: 9,
    };

    if (f.rarity.length > 0) {
      params.level = f.rarity.join(",");
    }

    if (
      f.priceRange &&
      Array.isArray(f.priceRange) &&
      f.priceRange.length === 2
    ) {
      const [minPrice, maxPrice] = f.priceRange;
      params.minPrice = String(minPrice);
      params.maxPrice = String(maxPrice);
    }

    try {
      const response = await NFTService.allNFTInMarketplace(params);
      if (response.success) {
        setSearchNFTs((response.data as any).nfts || []);
        return true;
      } else {
        toast.error(response.message);
        setSearchNFTs([]);
        return false;
      }

      // Filter marketplace results manually để đảm bảo level được áp dụng
    } catch (error) {
      console.error("Error searching marketplace:", error);
      toast.error("Lỗi khi tìm kiếm NFT.");
      return false;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchOtherNFTs(1, 9),
          fetchUserNFTs(),
          fetchMysteryBoxNFTs(1, 9),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userInfo]);

  useEffect(() => {
    GetInfoNFT();
  }, [userInfo]);

  const filteredNFTs = useMemo(() => {
    return nfts.filter((nft) => {
      // Type filter
      if (filters.type !== "all" && nft.type !== filters.type) {
        return false;
      }

      // Rarity filter
      if (filters.rarity.length > 0 && !filters.rarity.includes(nft.rarity)) {
        return false;
      }

      // Price range filter
      const priceValue = parseFloat(nft.price.split(" ")[0]);
      if (
        priceValue < filters.priceRange[0] ||
        priceValue > filters.priceRange[1]
      ) {
        return false;
      }

      return true;
    });
  }, [nfts, filters]);

  const resetFilters = () => {
    setFilters({
      rarity: [],
      priceRange: [0, 10000],
      type: "all",
    });
    // Clear search results when resetting filters
    setSearchNFTs([]);
  };

  const hasActiveFilters =
    filters.rarity.length > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 10000 ||
    filters.type !== "all";

  return {
    filters,
    setFilters,
    filteredNFTs,
    resetFilters,
    hasActiveFilters,
    fetchUserNFTs,
    userNFTs,
    otherNFTsData,
    otherNFTsAnalytics,
    searchMarketplace,
    searchNFTs,
    loading,
    fetchOtherNFTs,
    currentPage,
    totalPages,
    fetchMysteryBoxNFTs,
    mysteryBoxData,
    mysteryBoxTotalPages,
    mysteryBoxCurrentPage,
  };
};
