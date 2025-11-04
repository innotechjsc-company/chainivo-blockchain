'use client';

import { useState, useMemo } from 'react';
import { NFTStatsCards } from './NFTStatsCards';
import { NFTCard } from '@/screens/nft-market-screen/components/NFTCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { NFTItem } from '@/types/NFT';

// MOCK DATA - Sẽ xóa khi tích hợp API
const MOCK_NFTS: NFTItem[] = [
  {
    id: '1',
    name: 'Golden Dragon NFT',
    description: 'Rare golden dragon with special powers',
    image: '/nft-box.jpg',
    price: 1000,
    salePrice: 1500,
    walletAddress: '0x1234567890abcdef',
    owner: 'user123',
    isSale: true,
    isActive: true,
    type: 'rank',
    level: '5',
    currency: 'can',
    viewsCount: 245,
    likesCount: 89,
    isLike: false,
    createdAt: '2024-01-15T10:00:00Z',
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    name: 'Crystal Sword',
    description: 'Legendary weapon forged in ancient times',
    image: '/nft-box.jpg',
    price: 750,
    salePrice: null,
    walletAddress: '0x1234567890abcdef',
    owner: 'user123',
    isSale: false,
    isActive: true,
    type: 'normal',
    level: '4',
    currency: 'usdt',
    viewsCount: 120,
    likesCount: 45,
    isLike: true,
    createdAt: '2024-02-01T08:30:00Z',
    publishedAt: '2024-02-01T08:30:00Z',
    updatedAt: '2024-02-05T12:00:00Z',
  },
  {
    id: '3',
    name: 'Mystery Box #42',
    description: 'Contains random rare items',
    image: '/nft-box.jpg',
    price: 500,
    salePrice: 600,
    walletAddress: '0x1234567890abcdef',
    owner: 'user123',
    isSale: true,
    isActive: true,
    type: 'mysteryBox',
    level: '3',
    currency: 'can',
    viewsCount: 380,
    likesCount: 156,
    isLike: false,
    createdAt: '2024-02-10T14:20:00Z',
    publishedAt: '2024-02-10T14:20:00Z',
    updatedAt: '2024-02-15T09:45:00Z',
  },
  {
    id: '4',
    name: 'Investment Token Alpha',
    description: 'High-yield investment opportunity',
    image: '/nft-box.jpg',
    price: 2000,
    salePrice: null,
    walletAddress: '0x1234567890abcdef',
    owner: 'user123',
    isSale: false,
    isActive: true,
    type: 'investment',
    level: '5',
    currency: 'usdc',
    viewsCount: 512,
    likesCount: 234,
    isLike: true,
    createdAt: '2024-03-01T11:00:00Z',
    publishedAt: '2024-03-01T11:00:00Z',
    updatedAt: '2024-03-10T16:20:00Z',
  },
  {
    id: '5',
    name: 'Phoenix Feather',
    description: 'Magical feather with regeneration power',
    image: '/nft-box.jpg',
    price: 850,
    salePrice: 950,
    walletAddress: '0x1234567890abcdef',
    owner: 'user123',
    isSale: true,
    isActive: true,
    type: 'normal',
    level: '4',
    currency: 'eth',
    viewsCount: 190,
    likesCount: 78,
    isLike: false,
    createdAt: '2024-03-15T09:30:00Z',
    publishedAt: '2024-03-15T09:30:00Z',
    updatedAt: '2024-03-20T13:15:00Z',
  },
  {
    id: '6',
    name: 'Ancient Rune Stone',
    description: 'Stone inscribed with powerful runes',
    image: '/nft-box.jpg',
    price: 400,
    salePrice: null,
    walletAddress: '0x1234567890abcdef',
    owner: 'user123',
    isSale: false,
    isActive: true,
    type: 'normal',
    level: '2',
    currency: 'can',
    viewsCount: 95,
    likesCount: 32,
    isLike: true,
    createdAt: '2024-04-01T15:45:00Z',
    publishedAt: '2024-04-01T15:45:00Z',
    updatedAt: '2024-04-05T10:30:00Z',
  },
  {
    id: '7',
    name: 'Cyber Punk Avatar',
    description: 'Futuristic cyberpunk character',
    image: '/nft-box.jpg',
    price: 1200,
    salePrice: null,
    walletAddress: '0x1234567890abcdef',
    owner: 'user123',
    isSale: false,
    isActive: false,
    type: 'rank',
    level: '3',
    currency: 'usdt',
    viewsCount: 67,
    likesCount: 23,
    isLike: false,
    createdAt: '2024-04-10T12:00:00Z',
    publishedAt: '2024-04-10T12:00:00Z',
    updatedAt: '2024-04-12T08:20:00Z',
  },
  {
    id: '8',
    name: 'Diamond Shield',
    description: 'Unbreakable diamond-forged shield',
    image: '/nft-box.jpg',
    price: 1800,
    salePrice: 2000,
    walletAddress: '0x1234567890abcdef',
    owner: 'user123',
    isSale: true,
    isActive: true,
    type: 'rank',
    level: '5',
    currency: 'can',
    viewsCount: 456,
    likesCount: 189,
    isLike: true,
    createdAt: '2024-05-01T10:15:00Z',
    publishedAt: '2024-05-01T10:15:00Z',
    updatedAt: '2024-05-08T14:45:00Z',
  },
];

type FilterType = 'all' | 'sale' | 'not-listed';

export function MyNFTCollection() {
  const [filter, setFilter] = useState<FilterType>('all');

  // Filter NFTs dựa trên tab đã chọn
  const filteredNFTs = useMemo(() => {
    if (filter === 'sale') {
      return MOCK_NFTS.filter((nft) => nft.isSale);
    }
    if (filter === 'not-listed') {
      return MOCK_NFTS.filter((nft) => !nft.isSale);
    }
    return MOCK_NFTS;
  }, [filter]);

  // Tính toán stats
  const stats = useMemo(() => {
    const totalNFTs = MOCK_NFTS.length;
    const onSale = MOCK_NFTS.filter((nft) => nft.isSale).length;
    const notListed = MOCK_NFTS.filter((nft) => !nft.isSale).length;
    const inactive = MOCK_NFTS.filter((nft) => !nft.isActive).length;

    const totalValue = MOCK_NFTS.reduce((sum, nft) => {
      return sum + (nft.salePrice || nft.price);
    }, 0);

    return {
      totalNFTs,
      onSale,
      notListed,
      totalValue,
      inactive,
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <NFTStatsCards {...stats} />

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">
            Tất cả ({stats.totalNFTs})
          </TabsTrigger>
          <TabsTrigger value="sale">
            Đang bán ({stats.onSale})
          </TabsTrigger>
          <TabsTrigger value="not-listed">
            Chưa bán ({stats.notListed})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* NFT Grid */}
      {filteredNFTs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không có NFT nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNFTs.map((nft) => (
            <NFTCard
              key={nft.id}
              nft={nft}
              type="tier"
            />
          ))}
        </div>
      )}
    </div>
  );
}