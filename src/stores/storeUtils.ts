/**
 * Tiện ích Store
 * 
 * Các hàm và tiện ích hỗ trợ làm việc với Zustand stores
 */

import { useEffect, useRef } from 'react'
import type { StoreApi } from 'zustand'

/**
 * Hook để đăng ký lắng nghe thay đổi của store với một callback
 * 
 * @example
 * useStoreSubscription(useUserStore, (state) => {
 *   console.log('Người dùng thay đổi:', state.user)
 * })
 */
export function useStoreSubscription<T>(
  store: StoreApi<T>,
  callback: (state: T) => void
) {
  useEffect(() => {
    const unsubscribe = store.subscribe(callback)
    return unsubscribe
  }, [store, callback])
}

/**
 * Hook để theo dõi giá trị trước đó của một trạng thái store
 * 
 * @example
 * const user = useUser()
 * const prevUser = usePrevious(user)
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)
  
  useEffect(() => {
    ref.current = value
  }, [value])
  
  return ref.current
}

/**
 * Đặt lại tất cả các store về trạng thái ban đầu
 * Hữu ích cho các hoạt động đăng xuất hoặc dọn dẹp
 * 
 * Lưu ý: Điều này giả định các store có phương thức reset
 */
export function resetAllStores(stores: Array<{ reset?: () => void }>) {
  stores.forEach(store => {
    if (store.reset) {
      store.reset()
    }
  })
}

/**
 * Gộp nhiều cập nhật store lại với nhau
 * Hữu ích để cập nhật nhiều store một cách nguyên tử
 * 
 * @example
 * batchStoreUpdates([
 *   () => useUserStore.getState().setUser(user),
 *   () => useWalletStore.getState().connectWallet(address)
 * ])
 */
export function batchStoreUpdates(updates: Array<() => void>) {
  updates.forEach(update => update())
}

/**
 * Tạo một selector ghi nhớ dựa trên sự bằng nhau sâu (deep equality)
 * Hữu ích cho các đối tượng phức tạp thay đổi tham chiếu nhưng không thay đổi giá trị
 * 
 * @example
 * const investments = useInvestmentStore(
 *   createDeepEqualSelector(state => state.investments)
 * )
 */
export function createDeepEqualSelector<T, R>(
  selector: (state: T) => R
): (state: T) => R {
  let previousValue: R | undefined
  
  return (state: T) => {
    const newValue = selector(state)
    
    if (JSON.stringify(previousValue) === JSON.stringify(newValue)) {
      return previousValue as R
    }
    
    previousValue = newValue
    return newValue
  }
}

/**
 * Tạo một shallow selector cho các trường mảng/đối tượng
 * Ngăn chặn việc re-render không cần thiết khi tham chiếu mảng/đối tượng thay đổi
 * nhưng nội dung vẫn giống nhau
 * 
 * @example
 * const missions = useMissionStore(
 *   createShallowSelector(state => state.missions)
 * )
 */
export function createShallowSelector<T, R extends any[]>(
  selector: (state: T) => R
): (state: T) => R {
  let previousValue: R | undefined
  
  return (state: T) => {
    const newValue = selector(state)
    
    if (
      previousValue &&
      previousValue.length === newValue.length &&
      previousValue.every((item, index) => item === newValue[index])
    ) {
      return previousValue
    }
    
    previousValue = newValue
    return newValue
  }
}

/**
 * Helper để gỡ lỗi, ghi lại tất cả các thay đổi trạng thái của store
 * Chỉ sử dụng trong môi trường phát triển
 * 
 * @example
 * if (process.env.NODE_ENV === 'development') {
 *   logStoreChanges(useUserStore)
 * }
 */
export function logStoreChanges<T>(
  store: StoreApi<T>,
  storeName: string = 'Store'
) {
  if (typeof window !== 'undefined') {
    store.subscribe((state) => {
      console.group(`🔄 ${storeName} State Changed`)
      console.log('New State:', state)
      console.groupEnd()
    })
  }
}

/**
 * Type guard để kiểm tra xem một giá trị có phải là lỗi store hay không
 */
export function isStoreError(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  )
}

/**
 * Định dạng tiền tệ để hiển thị
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Định dạng phần trăm để hiển thị
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}

/**
 * Rút gọn địa chỉ ví để hiển thị
 */
export function truncateAddress(address: string, startLength: number = 6, endLength: number = 4): string {
  if (address.length <= startLength + endLength) {
    return address
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

/**
 * Định dạng thời gian trôi qua (ví dụ: "2 giờ trước")
 */
export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  }
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit)
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`
    }
  }
  
  return 'just now'
}

