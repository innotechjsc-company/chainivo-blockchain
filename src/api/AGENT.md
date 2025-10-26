# Quy Tắc Thư Mục API

## Mục đích

Thư mục `/api` chứa toàn bộ logic tương tác với backend API, bao gồm cấu hình, types, services và utilities. Đây là layer trung gian giữa frontend và backend, đảm bảo type safety và error handling nhất quán.

## Cấu Trúc Thư Mục

```
src/api/
├── index.ts                    # Entry point chính - export tất cả
├── api.ts                      # Axios instance với interceptors & ApiService
├── config.ts                   # Cấu hình API endpoints và settings
├── constants.ts                # Constants và static values
├── services/                   # Service modules theo feature
│   ├── index.ts               # Export tất cả services
│   ├── auth-service.ts        # Authentication & authorization
│   ├── phase-service.ts       # Investment phases management
│   ├── nft-service.ts         # NFT marketplace
│   ├── staking-service.ts     # Staking pools & rewards
│   ├── airdrop-service.ts     # Airdrop campaigns
│   ├── mystery-box-service.ts # Mystery box system
│   ├── investor-service.ts    # Investor analytics & stats
│   ├── analytics-service.ts   # Platform analytics
│   └── wallet-service.ts      # Wallet & transactions
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
export { default as api } from "./api";
export { ApiService, API_ENDPOINTS } from "./api";
export type { ApiResponse } from "./api";

// Export all services from services directory
export * from "./services";

// Export configuration
export { config, buildApiUrl, buildFrontendUrl, buildBlockchainUrl } from "./config";
export { constants } from "./constants";
```

**Nguyên tắc:**
- Là single source of truth cho API imports
- Export tất cả public APIs
- Cung cấp usage examples trong comments

### config.ts - Configuration

```typescript
export const config = {
  ENVIRONMENT: environment,
  API_BASE_URL: getEnvValue("API_BASE_URL_DEV", "API_BASE_URL_PROD", "http://localhost:3001"),
  FRONTEND_BASE_URL: getEnvValue("FRONTEND_BASE_URL_DEV", "FRONTEND_BASE_URL_PROD", "http://localhost:3002"),
  
  API_ENDPOINTS: {
    NFT: {
      GET_BY_ID: (tokenId: string) => `/api/nft/${tokenId}`,
      MINT: "/api/nft/mint",
      MARKETPLACE: {
        FOR_SALE: (page: number, limit: number) => `/api/nft/marketplace/for-sale?page=${page}&limit=${limit}`,
      },
    },
    AUTH: {
      LOGIN: "/auth/login",
      TEST_TOKEN: "/auth/test-token",
    },
    // ... more endpoints
  },
  
  BLOCKCHAIN: {
    NETWORK: "amoy",
    CHAIN_ID: 80002,
    RPC_URL: "https://rpc-amoy.polygon.technology",
    CAN_TOKEN_ADDRESS: "0x5b54896A3F8d144E02DcEEa05668C4a4EDe83c4F",
  },
}
```

**Nguyên tắc:**
- Tất cả endpoints được định nghĩa tập trung
- Sử dụng `as const` cho type safety
- Environment variables với fallback values
- Organized theo feature groups

### Types - Type Definitions

Types được định nghĩa trong từng service file:

```typescript
// api.ts - Common types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// auth-service.ts - Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  walletAddress: string;
}

// nft-service.ts - NFT types
export interface NFT {
  _id: string;
  tokenId: string;
  name: string;
  description: string;
  imageUrl: string;
  // ... more fields
}
```

**Nguyên tắc:**
- Types được định nghĩa trong service files tương ứng
- Common types trong `api.ts`
- Request/Response types cho mỗi service
- Comprehensive type coverage cho từng domain

### api.ts - HTTP Client

```typescript
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors & auto logout
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jwt_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

**Nguyên tắc:**
- Single axios instance cho toàn bộ app
- Automatic authentication via interceptors
- Centralized error handling với auto-logout
- JWT token management
- Consistent error responses

### services/ - Service Modules

Mỗi service file chứa API calls cho một feature cụ thể:

```typescript
// auth-service.ts
export class AuthService {
  static async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return ApiService.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }
  
  static async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return ApiService.post(API_ENDPOINTS.AUTH.REGISTER, data);
  }
  
  static async testToken(): Promise<ApiResponse<{ token: string }>> {
    return ApiService.get(API_ENDPOINTS.AUTH.TEST_TOKEN);
  }
}

// nft-service.ts
export class NFTService {
  static async getNFTById(tokenId: string): Promise<ApiResponse<NFT>> {
    return ApiService.get(API_ENDPOINTS.NFT.GET_BY_ID(tokenId));
  }
  
  static async mintNFT(data: MintNFTData): Promise<ApiResponse<NFT>> {
    return ApiService.post(API_ENDPOINTS.NFT.MINT, data);
  }
}
```

**Nguyên tắc:**
- Mỗi service tập trung vào một domain cụ thể
- Sử dụng class-based static methods
- Type-safe parameters và return types
- Sử dụng `ApiService` helper thay vì axios trực tiếp
- Consistent error handling qua ApiService

## Nguyên Tắc Development

### 1. **Import Standards**

```typescript
// ✅ ĐÚNG - Import từ main entry point
import { AuthService, NFTService, WalletService, ApiResponse } from '@/api'

// ✅ ĐÚNG - Import specific services
import { AuthService } from '@/api/services/auth-service'

// ✅ ĐÚNG - Import ApiService cho custom calls
import { ApiService, API_ENDPOINTS } from '@/api'

// ❌ SAI - Import axios trực tiếp
import axios from 'axios'
```

### 2. **Service Usage**

```typescript
// ✅ ĐÚNG - Sử dụng services
const response = await AuthService.login({ email, password })
if (response.success) {
  console.log(response.data.user)
}

// ✅ ĐÚNG - Sử dụng ApiService cho custom calls
const response = await ApiService.get('/custom/endpoint')

// ❌ SAI - Gọi API trực tiếp
const response = await axios.post('/auth/login', { email, password })
```

### 3. **Error Handling**

```typescript
// ✅ ĐÚNG - Handle errors properly
try {
  const response = await AuthService.login(credentials)
  if (response.success) {
    // Handle success
  } else {
    console.error(response.error)
  }
} catch (error) {
  console.error('Login failed:', error)
}

// ❌ SAI - Ignore errors
const response = await AuthService.login(credentials) // No error handling
```

### 4. **Type Safety**

```typescript
// ✅ ĐÚNG - Use typed requests
const loginData: LoginCredentials = {
  email: 'user@example.com',
  password: 'password123'
}
const response: ApiResponse<AuthResponse> = await AuthService.login(loginData)

// ❌ SAI - Use any types
const response: any = await AuthService.login({ email, password })
```

## Integration với Stores

### Zustand Store Example

```typescript
import { create } from 'zustand'
import { AuthService, NFTService } from '@/api'
import type { LoginCredentials, AuthResponse, NFT } from '@/api'

interface UserState {
  user: any | null
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const response = await AuthService.login(credentials)
      if (response.success) {
        set({ user: response.data.user, isLoading: false })
      } else {
        set({ error: response.error || 'Login failed', isLoading: false })
      }
    } catch (error: any) {
      set({ error: error.message || 'Login failed', isLoading: false })
    }
  },
  
  logout: async () => {
    set({ isLoading: true })
    try {
      // Clear local storage
      localStorage.removeItem('jwt_token')
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
- **Handle errors với try-catch blocks và response.success checks**
- **Sử dụng TypeScript types cho tất cả API calls**
- **Sử dụng ApiService cho custom API calls**
- **Test API integration với mock data**
- **Document complex API endpoints**
- **Sử dụng environment variables cho configuration**
- **Implement proper loading states**
- **Cache responses khi phù hợp**
- **Sử dụng class-based services cho consistency**

### ❌ KHÔNG NÊN

- **Gọi axios trực tiếp trong components**
- **Hardcode API endpoints**
- **Ignore error handling**
- **Sử dụng `any` types**
- **Mix business logic trong services**
- **Store sensitive data trong localStorage**
- **Make API calls trong render functions**
- **Forget to handle loading states**
- **Bypass ApiService error handling**

## Testing

### Unit Tests

```typescript
// Mock API responses
jest.mock('@/api', () => ({
  AuthService: {
    login: jest.fn().mockResolvedValue({
      success: true,
      data: { user: mockUser, token: mockToken }
    })
  },
  ApiService: {
    post: jest.fn().mockResolvedValue({
      success: true,
      data: mockData
    })
  }
}))

// Test service calls
test('should call login service with correct parameters', async () => {
  const credentials = { email: 'test@example.com', password: 'password' }
  await AuthService.login(credentials)
  expect(AuthService.login).toHaveBeenCalledWith(credentials)
})
```

### Integration Tests

```typescript
// Test với real API (development only)
test('should authenticate user with valid credentials', async () => {
  const response = await AuthService.login({
    email: 'test@example.com',
    password: 'password123'
  })
  
  expect(response.success).toBe(true)
  expect(response.data).toBeDefined()
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
2. **Định nghĩa types trong service file tương ứng**
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
