/**
 * Rank Eligibility Utilities
 * Functions để check xem user có được phép mua rank không
 */

/**
 * Check xem user có được phép mua rank này không
 * @param tierLevel - Level của rank muốn mua (string: "1", "2", "3"...)
 * @param currentUserRankLevel - Level của rank hiện tại của user
 * @returns true nếu được phép mua, false nếu không
 */
export const isRankEligible = (
  tierLevel: string,
  currentUserRankLevel?: string
): boolean => {
  // Nếu chưa có rank → cho phép mua tất cả
  if (!currentUserRankLevel) {
    return true;
  }

  // So sánh level: chỉ cho phép mua rank cao hơn
  const tierLevelNum = parseInt(tierLevel);
  const currentLevelNum = parseInt(currentUserRankLevel);

  return tierLevelNum > currentLevelNum;
};

/**
 * Lấy lý do tại sao không được mua rank
 * @param tierLevel - Level của rank muốn mua
 * @param currentUserRankLevel - Level của rank hiện tại của user
 * @returns String lý do, hoặc null nếu được phép mua
 */
export const getRankIneligibilityReason = (
  tierLevel: string,
  currentUserRankLevel?: string
): string | null => {
  // Nếu được phép mua → không có lý do
  if (isRankEligible(tierLevel, currentUserRankLevel)) {
    return null;
  }

  const tierLevelNum = parseInt(tierLevel);
  const currentLevelNum = parseInt(currentUserRankLevel || '0');

  // Đang sở hữu rank này
  if (tierLevelNum === currentLevelNum) {
    return 'Rank hiện tại ';
  }

  // Rank thấp hơn rank hiện tại
  if (tierLevelNum < currentLevelNum) {
    return 'Rank thấp hơn hiện tại';
  }

  // Fallback (không nên xảy ra)
  return 'Không thể mua rank này';
};
