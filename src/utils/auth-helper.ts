import { LocalStorageService } from "@/services";

/**
 * Kiểm tra xem user đã đăng nhập hay chưa
 * @returns true nếu có token hợp lệ
 */
export const isAuthenticated = (): boolean => {
  const token = LocalStorageService.getToken();
  return !!token;
};

/**
 * Kiểm tra authentication và trả về token nếu có
 * @returns token string hoặc null
 */
export const getAuthToken = (): string | null => {
  return LocalStorageService.getToken();
};

/**
 * Kiểm tra authentication và trả về user info nếu có
 * @returns user object hoặc null
 */
export const getAuthUser = (): any | null => {
  const token = LocalStorageService.getToken();
  if (!token) return null;
  
  return LocalStorageService.getUser();
};

/**
 * Kiểm tra xem token có hết hạn không
 * @returns true nếu token đã hết hạn
 */
export const isTokenExpired = (): boolean => {
  const token = LocalStorageService.getToken();
  if (!token) return true;
  
  try {
    // Parse JWT token để lấy expiry time
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    
    if (!exp) return false;
    
    // So sánh với thời gian hiện tại (tính bằng giây)
    return Date.now() >= exp * 1000;
  } catch (error) {
    console.error("Error parsing token:", error);
    return true;
  }
};

/**
 * Xóa toàn bộ dữ liệu authentication
 */
export const clearAuth = (): void => {
  LocalStorageService.clearAuthData();
};
