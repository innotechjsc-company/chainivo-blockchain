# Quy Tắc Thư Mục API

## Mục đích

Thư mục `/api` chứa toàn bộ logic tương tác với backend API, bao gồm cấu hình, types, services và utilities. Đây là layer trung gian giữa frontend và backend, đảm bảo type safety và error handling nhất quán.

## Cấu Trúc Thư Mục

```
src/api/
├── index.ts                    # Entry point chính - export tất cả
├── config.ts                   # Cấu hình API endpoints và settings
├── types.ts                    # TypeScript types cho requests/responses
├── axios.ts                    # Axios instance với interceptors
├── services/                   # Service modules theo feature
│   ├── authService.ts         # Authentication & authorization
│   ├── userService.ts         # User management
│   ├── walletService.ts       # Wallet & transactions
│   ├── investmentService.ts   # Investment portfolio
│   ├── nftService.ts          # NFT marketplace
│   ├── missionService.ts      # Daily missions & rewards
│   ├── notificationService.ts # Notifications system
│   ├── blockchainService.ts   # Blockchain data & stats
│   └── index.ts               # Export tất cả services
├── README.md                   # Documentation chi tiết
└── AGENT.md                   # Quy tắc development (file này)
```

## Quy Tắc Chung

### 1. **Luôn sử dụng TypeScript**
- Tất cả API calls phải có type definitions
- Không sử dụng `any` - dùng `unknown` và type guards
- Export types từ `types.ts` để tái sử dụng

### 2. **Centralized Configuration**
- Tất cả endpoints được định nghĩa trong `config.ts`
- Environment variables được quản lý tập trung
- API versioning và timeout được cấu hình thống nhất

### 3. **Service-based Architecture**
- Mỗi feature có service riêng (auth, wallet, nft, etc.)
- Services chỉ chứa API calls, không có business logic
- Business logic được xử lý ở hooks hoặc stores

### 4. **Error Handling**
- Tất cả errors được standardize qua interceptors
- Consistent error format với `ApiError` type
- Automatic token refresh và retry logic

### 5. **Authentication**
- Automatic token management qua interceptors
- Secure token storage với localStorage
- Auto-logout khi token expired

## Cấu Trúc Files

### index.ts - Entry Point

```typescript
// Export axios instance và utilities
export { default as axiosInstance, apiRequest, tokenManager, uploadFile } from './axios'

// Export configuration
export { API_CONFIG, API_ENDPOINTS, STORAGE_KEYS } from './config'

// Export types
export * from './types'

// Export all services
export * from './services'
```

**Nguyên tắc:**
- Là single source of truth cho API imports
- Export tất cả public APIs
- Cung cấp usage examples trong comments

### config.ts - Configuration

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.chainivo.com',
  TIMEOUT: 30000,
  API_VERSION: 'v1',
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    // ...
  },
  // ...
} as const
```

**Nguyên tắc:**
- Tất cả endpoints được định nghĩa tập trung
- Sử dụng `as const` cho type safety
- Environment variables với fallback values
- Organized theo feature groups

### types.ts - Type Definitions

```typescript
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  timestamp?: string
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  user: User
  tokens: TokenPair
}
```

**Nguyên tắc:**
- Generic types cho common patterns
- Request/Response types cho mỗi endpoint
- Comprehensive type coverage
- Grouped theo feature areas

### axios.ts - HTTP Client

```typescript
export const axiosInstance = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}`,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor - add auth token
// Response interceptor - handle errors & token refresh
```

**Nguyên tắc:**
- Single axios instance cho toàn bộ app
- Automatic authentication via interceptors
- Centralized error handling
- Development logging
- Token refresh logic

### services/ - Service Modules

Mỗi service file chứa API calls cho một feature cụ thể:

```typescript
// authService.ts
export const authService = {
  login: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiRequest.post(API_ENDPOINTS.AUTH.LOGIN, data)
  },
  
  register: (data: RegisterRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiRequest.post(API_ENDPOINTS.AUTH.REGISTER, data)
  },
  
  logout: (): Promise<ApiResponse<void>> => {
    return apiRequest.post(API_ENDPOINTS.AUTH.LOGOUT)
  },
}
```

**Nguyên tắc:**
- Mỗi service tập trung vào một domain
- Consistent naming convention
- Type-safe parameters và return types
- Sử dụng `apiRequest` helper thay vì axios trực tiếp

## Nguyên Tắc Development

### 1. **Import Standards**

```typescript
// ✅ ĐÚNG - Import từ main entry point
import { authService, walletService, ApiResponse } from '@/api'

// ✅ ĐÚNG - Import specific services
import { authService } from '@/api/services/authService'

// ❌ SAI - Import axios trực tiếp
import axios from 'axios'
```

### 2. **Service Usage**

```typescript
// ✅ ĐÚNG - Sử dụng services
const response = await authService.login({ email, password })
if (response.success) {
  console.log(response.data.user)
}

// ❌ SAI - Gọi API trực tiếp
const response = await axios.post('/auth/login', { email, password })
```

### 3. **Error Handling**

```typescript
// ✅ ĐÚNG - Handle errors properly
try {
  const response = await authService.login(credentials)
  if (response.success) {
    // Handle success
  }
} catch (error) {
  const apiError = error as ApiError
  console.error(apiError.error.message)
}

// ❌ SAI - Ignore errors
const response = await authService.login(credentials) // No error handling
```

### 4. **Type Safety**

```typescript
// ✅ ĐÚNG - Use typed requests
const loginData: LoginRequest = {
  email: 'user@example.com',
  password: 'password123'
}
const response: ApiResponse<LoginResponse> = await authService.login(loginData)

// ❌ SAI - Use any types
const response: any = await authService.login({ email, password })
```

## Integration với Stores

### Zustand Store Example

```typescript
import { create } from 'zustand'
import { authService, userService } from '@/api'
import type { LoginRequest, User } from '@/api'

interface UserState {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.login(credentials)
      if (response.success) {
        set({ user: response.data.user, isLoading: false })
      }
    } catch (error: any) {
      set({ error: error.error?.message || 'Login failed', isLoading: false })
    }
  },
  
  logout: async () => {
    set({ isLoading: true })
    try {
      await authService.logout()
      set({ user: null, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
    }
  },
}))
```

## Best Practices

### ✅ NÊN

- **Sử dụng services thay vì axios trực tiếp**
- **Handle errors với try-catch blocks**
- **Sử dụng TypeScript types cho tất cả API calls**
- **Test API integration với mock data**
- **Document complex API endpoints**
- **Sử dụng environment variables cho configuration**
- **Implement proper loading states**
- **Cache responses khi phù hợp**

### ❌ KHÔNG NÊN

- **Gọi axios trực tiếp trong components**
- **Hardcode API endpoints**
- **Ignore error handling**
- **Sử dụng `any` types**
- **Mix business logic trong services**
- **Store sensitive data trong localStorage**
- **Make API calls trong render functions**
- **Forget to handle loading states**

## Testing

### Unit Tests

```typescript
// Mock API responses
jest.mock('@/api', () => ({
  authService: {
    login: jest.fn().mockResolvedValue({
      success: true,
      data: { user: mockUser, tokens: mockTokens }
    })
  }
}))

// Test service calls
test('should call login service with correct parameters', async () => {
  const credentials = { email: 'test@example.com', password: 'password' }
  await authService.login(credentials)
  expect(authService.login).toHaveBeenCalledWith(credentials)
})
```

### Integration Tests

```typescript
// Test với real API (development only)
test('should authenticate user with valid credentials', async () => {
  const response = await authService.login({
    email: 'test@example.com',
    password: 'password123'
  })
  
  expect(response.success).toBe(true)
  expect(response.data.user).toBeDefined()
})
```

## Performance

### Caching

```typescript
// Implement response caching
const cache = new Map()

export const cachedApiRequest = {
  get: async <T>(url: string, ttl = 300000): Promise<ApiResponse<T>> => {
    const cacheKey = `GET:${url}`
    const cached = cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data
    }
    
    const response = await apiRequest.get<T>(url)
    cache.set(cacheKey, { data: response, timestamp: Date.now() })
    return response
  }
}
```

### Request Cancellation

```typescript
// Cancel requests khi component unmount
useEffect(() => {
  const controller = new AbortController()
  
  const fetchData = async () => {
    try {
      const response = await apiRequest.get('/data', {
        signal: controller.signal
      })
      setData(response.data)
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(error)
      }
    }
  }
  
  fetchData()
  
  return () => controller.abort()
}, [])
```

## Security

### Token Management

```typescript
// Secure token storage
export const secureTokenManager = {
  setTokens: (accessToken: string, refreshToken: string) => {
    // Encrypt tokens before storage
    const encryptedAccess = encrypt(accessToken)
    const encryptedRefresh = encrypt(refreshToken)
    
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, encryptedAccess)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, encryptedRefresh)
  },
  
  getAccessToken: (): string | null => {
    const encrypted = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    return encrypted ? decrypt(encrypted) : null
  }
}
```

### Input Validation

```typescript
// Validate API inputs
export const validateLoginRequest = (data: any): LoginRequest => {
  if (!data.email || !data.password) {
    throw new Error('Email and password are required')
  }
  
  if (!isValidEmail(data.email)) {
    throw new Error('Invalid email format')
  }
  
  return data as LoginRequest
}
```

## Monitoring & Debugging

### Development Logging

```typescript
// Enhanced logging cho development
if (process.env.NODE_ENV === 'development') {
  axiosInstance.interceptors.request.use((config) => {
    console.group(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    console.log('Headers:', config.headers)
    console.log('Data:', config.data)
    console.log('Params:', config.params)
    console.groupEnd()
    return config
  })
}
```

### Error Tracking

```typescript
// Track API errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log to error tracking service
    if (error.response?.status >= 500) {
      errorTracker.captureException(error)
    }
    return Promise.reject(error)
  }
)
```

## Migration & Versioning

### API Versioning

```typescript
// Support multiple API versions
export const API_VERSIONS = {
  v1: '/api/v1',
  v2: '/api/v2',
} as const

export const getApiUrl = (version: keyof typeof API_VERSIONS = 'v1') => {
  return `${API_CONFIG.BASE_URL}${API_VERSIONS[version]}`
}
```

### Backward Compatibility

```typescript
// Handle API changes gracefully
export const migrateApiResponse = <T>(response: any, version: string): ApiResponse<T> => {
  if (version === 'v1') {
    return {
      success: response.status === 'success',
      data: response.data,
      message: response.message
    }
  }
  
  // v2 format
  return response
}
```

## Contributing

Khi thêm API endpoints mới:

1. **Thêm endpoint vào `config.ts`**
2. **Định nghĩa types trong `types.ts`**
3. **Tạo/update service trong `services/`**
4. **Export từ `services/index.ts`**
5. **Update documentation**
6. **Viết tests**
7. **Test với real API**

## Troubleshooting

### Common Issues

1. **CORS Errors**: Kiểm tra backend CORS configuration
2. **Token Expired**: Implement proper token refresh logic
3. **Network Timeout**: Adjust timeout settings
4. **Type Errors**: Ensure all types are properly defined
5. **Circular Dependencies**: Check import/export structure

### Debug Tools

```typescript
// Enable API debugging
export const enableApiDebug = () => {
  localStorage.setItem('api_debug', 'true')
  window.apiDebug = {
    clearCache: () => cache.clear(),
    getCache: () => cache,
    getTokens: () => tokenManager.getAccessToken()
  }
}
```
