'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import { RankService, UserService } from '@/api';
import { ToastService, LocalStorageService } from '@/services';
import { config } from '@/api/config';
import { updateProfile } from '@/stores/authSlice';
import type { RootState, AppDispatch } from '@/stores/store';

interface UseBuyRankReturn {
  handleBuyRank: (rankId: string, rankPrice: number) => Promise<void>;
  loadingRankId: string | null;
  error: string | null;
}

/**
 * Custom hook để xử lý mua rank
 */
export const useBuyRank = (onSuccess?: () => void): UseBuyRankReturn => {
  const [loadingRankId, setLoadingRankId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Redux dispatch
  const dispatch = useDispatch<AppDispatch>();

  // Lấy wallet address từ Redux store
  const walletAddress = useSelector(
    (state: RootState) => state.wallet?.wallet?.address || state.auth?.user?.walletAddress
  );

  const handleBuyRank = async (rankId: string, rankPrice: number) => {
    try {
      setLoadingRankId(rankId);
      setError(null);

      // 1. Kiểm tra wallet đã kết nối chưa
      if (!walletAddress) {
        ToastService.error('Vui lòng kết nối ví trước khi mua hạng');
        setError('Chưa kết nối ví');
        return;
      }

      // 2. Kiểm tra có MetaMask không
      if (typeof window.ethereum === 'undefined') {
        ToastService.error('Vui lòng cài đặt MetaMask để tiếp tục');
        setError('Chưa cài MetaMask');
        return;
      }

      // 3. Khởi tạo provider và signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // 4. Chuẩn bị transaction
      const adminWallet = config.WALLET_ADDRESSES.ADMIN;
      const canTokenAddress = config.WALLET_ADDRESSES.CAN_CONTRACT;

      // ERC20 ABI để transfer tokens
      const erc20Abi = [
        'function transfer(address to, uint256 amount) returns (bool)',
      ];

      // 5. Khởi tạo contract
      const canContract = new ethers.Contract(
        canTokenAddress,
        erc20Abi,
        signer
      );

      // 6. Convert amount sang wei (CAN token có 18 decimals)
      const amountInWei = ethers.parseUnits(rankPrice.toString(), 18);

      ToastService.info('Đang xử lý giao dịch, vui lòng xác nhận trong MetaMask...');

      // 7. Thực hiện transfer
      const tx = await canContract.transfer(adminWallet, amountInWei);

      ToastService.info('Đang chờ xác nhận giao dịch trên blockchain...');

      // 8. Đợi transaction được confirm
      const receipt = await tx.wait();

      if (!receipt || receipt.status !== 1) {
        throw new Error('Giao dịch thất bại');
      }

      // 9. Gọi API để update rank
      const response = await RankService.buyRank({
        rankId,
        transactionHash: receipt.hash,
      });

      if (response.success) {
        // Gọi API để lấy user profile mới nhất (bao gồm rank mới)
        try {
          const profileResponse = await UserService.getCurrentUserProfile();

          if (profileResponse.success && profileResponse.data) {
            const userData = profileResponse.data;

            // Update Redux store
            dispatch(updateProfile(userData));

            // Update localStorage
            LocalStorageService.setUserInfo(userData);

            console.log('✅ User info updated:', userData);
          }
        } catch (profileError) {
          console.warn('Không thể cập nhật profile sau khi mua rank:', profileError);
          // Không throw error vì transaction đã thành công
        }

        // Toast với rank name
        ToastService.success(
          `Chúc mừng! Bạn đã lên hạng ${response.data?.rank.name}`
        );

        // 10. Callback để refresh data
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error(response.error || 'Không thể cập nhật hạng');
      }
    } catch (err: any) {
      console.error('Lỗi khi mua rank:', err);

      // Xử lý các loại lỗi khác nhau
      let errorMessage = 'Có lỗi xảy ra khi mua hạng';

      if (err.code === 'ACTION_REJECTED') {
        errorMessage = 'Bạn đã từ chối giao dịch';
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Số dư không đủ để thực hiện giao dịch';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      ToastService.error(errorMessage);
    } finally {
      setLoadingRankId(null);
    }
  };

  return {
    handleBuyRank,
    loadingRankId,
    error,
  };
};
