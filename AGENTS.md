# CLAUDE.md

File nay cung cap huong dan cho Claude Code (claude.ai/code) khi lam viec voi code trong repository nay.

---

## CAU TRUC DU AN

**QUAN TRONG**: Truoc khi code, LUON doc file `PROJECT_STRUCTURE.md` de:
- Hieu ro cau truc du an
- Tham chieu component/hook/service da co
- Tranh tao file trung lap
- Sau khi tạo hoặc xoá file nào thì phải cập nhật lại trong file ```PROJECT_STRUCTURE.md`.
```bash
# Doc file nay truoc:
./PROJECT_STRUCTURE.md
```

---

# Hướng dẫn làm việc với AI

## Ngôn ngữ giao tiếp
- **Mặc định: Tiếng Việt** cho mọi giải thích, comment, documentation
- Chỉ dùng English khi được yêu cầu rõ ràng
- Code và biến thì vẫn bằng English theo convention

## Phong cách trả lời
- Giải thích logic trước khi viết code
- Nếu không rõ yêu cầu, hỏi làm rõ trước khi code
- Đưa ra ví dụ cụ thể khi giải thích concept
- Code examples phải có comment tiếng Việt giải thích

## Cách tiếp cận vấn đề
- Ưu tiên giải pháp đơn giản, dễ maintain
- Tuân thủ SOLID principles
- Tránh over-engineering
- Luôn nghĩ đến performance và scalability

## Code Quality
- Clean code > Clever code
- Đặt tên biến/hàm phải rõ nghĩa, self-documenting
- Mỗi function chỉ làm 1 việc
- Tránh nested if/else sâu quá 2 levels
- Error handling phải đầy  đủ

# PROJECT RULES

> Quick reference cho Chainivo Blockchain project

---

## TECH STACK

```
Next.js 15 (App Router + Turbopack)
TypeScript 5.x (strict mode)
Redux Toolkit + redux-persist
Axios (API client với interceptors)
ethers.js v6.15.0
Tailwind CSS + shadcn/ui
Polygon Amoy Testnet (dev) / Mainnet (prod)
```

---

## NAMING CONVENTIONS

| Type | Convention | Example |
|------|-----------|---------|
| Variables | `camelCase` | `userName`, `isLoading` |
| Constants | `UPPER_SNAKE_CASE` | `API_BASE_URL`, `MAX_RETRY` |
| Functions | `camelCase` | `getUserData()` |
| Components | `PascalCase` | `UserProfile.tsx` |
| Hooks | `camelCase` + `use` prefix | `useAuth.ts` |
| Files (pages) | `kebab-case` | `user-profile.tsx` |
| Folders | `kebab-case` | `home-screen/` |

---

## CODE STYLE

- **Indent:** 2 spaces
- **Quotes:** Single `'`
- **Semicolons:** Required
- **No package install** without permission
- **Comments:** Vietnamese, explain WHY not WHAT
- **No default exports** (except Next.js pages)

---

## STATE MANAGEMENT (REDUX)

### Slices in `src/stores/`

| Slice | Persisted | Purpose |
|-------|-----------|---------|
| `authSlice` | ✅ | user, token, isAuthenticated |
| `userSlice` | ✅ | profile data |
| `walletSlice` | ✅ | wallet info (not transactions) |
| `investmentSlice` | ✅ | portfolio |
| `nftSlice` | ❌ | marketplace |
| `missionSlice` | ✅ | completedMissions, dailyStreak, totalRewardsEarned |
| `notificationSlice` | ❌ | in-app notifications |

### Usage

```typescript
'use client';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/stores/store';

const user = useSelector((state: RootState) => state.auth.user);
const dispatch = useDispatch<AppDispatch>();
```

---

## API LAYER (`src/api/`)

### Structure

```
api/
├── api.ts            # Axios instance + API_ENDPOINTS
├── config.ts         # Environment config với getEnvValue()
└── services/         # Service modules
    ├── auth.ts
    ├── user.ts
    ├── wallet.ts
    └── ...
```

### Axios Interceptors

- **Request:** Auto-attach JWT token từ `localStorage.jwt_token`
- **Response:** Auto-redirect `/auth?tab=login` on 401

### Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

---

## FOLDER STRUCTURE

> **CHI TIET:** Xem `PROJECT_STRUCTURE.md` de biet day du cau truc, file, thu muc va muc dich.

### Screen Pattern (Co dinh)

```
screens/[screen-name]/
├── index.tsx         # Main component
├── components/       # Screen-specific components
└── hooks/            # Screen-specific hooks
```

---

## ENVIRONMENT CONFIG

### File: `src/api/config.ts`

```typescript
// Dev vs Prod pattern
NEXT_PUBLIC_[VAR]_DEV    # Development
NEXT_PUBLIC_[VAR]_PROD   # Production

// Auto-detect via NODE_ENV
const value = getEnvValue('API_BASE_URL');
```

### Key Variables

```bash
NEXT_PUBLIC_API_BASE_URL_DEV
NEXT_PUBLIC_API_BASE_URL_PROD
NEXT_PUBLIC_BLOCKCHAIN_CHAIN_ID_DEV=80002
NEXT_PUBLIC_BLOCKCHAIN_RPC_URL_DEV=https://rpc-amoy.polygon.technology
NEXT_PUBLIC_CAN_TOKEN_ADDRESS_DEV
NEXT_PUBLIC_USDT_CONTRACT_ADDRESS_DEV
```

---

## BLOCKCHAIN

### Network: Polygon Amoy (Dev)

```
Chain ID: 80002
RPC: https://rpc-amoy.polygon.technology
Explorer: https://www.oklink.com/amoy
```

### Library: ethers.js v6.15.0

```typescript
import { ethers } from 'ethers';
const provider = new ethers.JsonRpcProvider(RPC_URL);
```

---

## IMPORT ORDER

```typescript
// 1. React/Next.js
import React from 'react';
import { useRouter } from 'next/navigation';

// 2. External packages
import { useSelector } from 'react-redux';

// 3. Absolute imports (@/)
import { Button } from '@/components/ui';
import type { User } from '@/types';

// 4. Relative imports
import { helper } from '../utils';

// 5. Styles
import styles from './styles.module.css';
```

---

## PATH ALIASES

```json
{
  "@/*": ["./src/*"],
  "@api": ["./src/api"],
  "@api/*": ["./src/api/*"]
}
```

---

## GIT COMMITS

```
<type>: <mo ta tieng viet>

Types: feat, fix, docs, style, refactor, test, chore
```

Examples:
```
feat: them chuc nang staking
fix: sua loi hien thi balance
refactor: toi uu UserProfile component
```

---

## COMMANDS

```bash
npm run dev          # Dev server (port 3000)
npm run build        # Build production
npm start            # Run production

npx shadcn@latest add [component]  # Add UI component
```

---

## CLIENT COMPONENTS

Bắt buộc `'use client'` directive khi:
- Sử dụng Redux hooks
- Sử dụng browser APIs (localStorage, window, etc.)
- Sử dụng React hooks (useState, useEffect, etc.)

```typescript
'use client';  // Phải ở đầu file, trước imports

import { useSelector } from 'react-redux';
```

---

## TYPESCRIPT

- **Strict mode:** ON
- **No `any`:** Dùng `unknown` nếu cần
- **Interface** cho objects, **Type** cho unions
- **Export types** cùng file với component

---

## AUTH FLOW

```
1. Login/Register → JWT token
2. Token saved → localStorage.jwt_token
3. Axios interceptor → Auto-attach token
4. 401 error → Clear token + redirect /auth?tab=login
```

---

## CRITICAL NOTES

1. **Redux Toolkit** (NOT Zustand)
2. **Client components** cần `'use client'`
3. **API response** luôn theo format `ApiResponse<T>`
4. **Env vars** phải prefix `NEXT_PUBLIC_` (client-side)
5. **No package install** without approval
6. **Output:** tieng viet khong dau

---

## CHECKLIST

```
□ Doc PROJECT_STRUCTURE.md de check component/hook/service da co
□ Naming conventions OK
□ TypeScript types defined
□ Client component có 'use client'
□ Import order đúng
□ Error handling đầy đủ
□ No console.log
□ Commit message đúng format
```

---

