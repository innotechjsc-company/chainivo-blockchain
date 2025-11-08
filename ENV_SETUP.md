# Hướng dẫn cấu hình Environment Variables

## 📋 Tổng quan

Project sử dụng cấu hình environment theo **chuẩn Next.js 15**, đảm bảo:
- ✅ Type-safe và maintainable
- ✅ Tách biệt môi trường dev/prod
- ✅ Secure (không commit sensitive data)
- ✅ Client-side variables có prefix `NEXT_PUBLIC_`

---

## 🚀 Quick Start

### 1. Setup Local Development

```bash
# Copy template và rename
cp .env.example .env.local

# Hoặc tạo thủ công .env.local với nội dung từ .env.example
```

### 2. Chỉnh sửa giá trị trong `.env.local`

Thay `YOUR_API_KEY` bằng API key thực tế của bạn.

### 3. Run project

```bash
npm run dev
```

---

## 📂 Cấu trúc Files

```
.
├── .env.example          # ✅ Template (commit vào Git)
├── .env.local            # ❌ Local dev (Git ignored)
├── .env.production       # ❌ Production (Git ignored)
└── src/api/config.ts     # Config loader
```

### Load Priority (Next.js)

1. `.env.local` → Highest priority (luôn được load)
2. `.env.development` hoặc `.env.production` → Based on `NODE_ENV`
3. `.env` → Fallback

---

## 🔑 Biến Environment

### ⚠️ QUY TẮC QUAN TRỌNG

1. **Client-side variables PHẢI có prefix `NEXT_PUBLIC_`**
   - Ví dụ: `NEXT_PUBLIC_API_BASE_URL`
   - Lý do: Next.js chỉ expose biến có prefix này ra browser

2. **Server-side variables KHÔNG cần prefix**
   - Ví dụ: `DATABASE_URL`, `SECRET_KEY`
   - Chỉ accessible ở server-side code

3. **Không dùng suffix `_DEV` / `_PROD`**
   - ❌ Sai: `NEXT_PUBLIC_API_BASE_URL_DEV`
   - ✅ Đúng: `NEXT_PUBLIC_API_BASE_URL`
   - Next.js tự động load file đúng theo `NODE_ENV`

---

## 📝 Danh sách Variables

### API Configuration
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_FRONTEND_BASE_URL=http://localhost:3000
```

### Blockchain Configuration
```bash
NEXT_PUBLIC_BLOCKCHAIN_NETWORK=amoy
NEXT_PUBLIC_BLOCKCHAIN_CHAIN_ID=80002
NEXT_PUBLIC_BLOCKCHAIN_RPC_URL=https://rpc-amoy.polygon.technology
NEXT_PUBLIC_BLOCKCHAIN_RPC_BACKUP=https://polygon-amoy.g.alchemy.com/v2/YOUR_API_KEY
NEXT_PUBLIC_BLOCKCHAIN_EXPLORER=https://www.oklink.com/amoy
```

### Token Addresses
```bash
NEXT_PUBLIC_CAN_TOKEN_ADDRESS=0x5b54896A3F8d144E02DcEEa05668C4a4EDe83c4F
NEXT_PUBLIC_USDT_CONTRACT_ADDRESS=0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582
```

### Wallet Configuration
```bash
NEXT_PUBLIC_CAN_CONTRACT=0x5b54896A3F8d144E02DcEEa05668C4a4EDe83c4F
NEXT_PUBLIC_ADMIN_WALLET=0x7C4767673CC6024365E08F2Af4369b04701a5FeD
NEXT_PUBLIC_USDT_CONTRACT=0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582
```

### Default Values
```bash
NEXT_PUBLIC_DEFAULT_GAS_FEE=0.001
NEXT_PUBLIC_DEFAULT_CURRENCY=POL
```

---

## 🔧 Sử dụng trong Code

### Import config object

```typescript
import { config } from '@/api/config';

// Access values
console.log(config.API_BASE_URL);
console.log(config.BLOCKCHAIN.CHAIN_ID);
console.log(config.WALLET_ADDRESSES.CAN_CONTRACT);
```

### Direct access (không khuyến khích)

```typescript
// Client component
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Server component
const secretKey = process.env.SECRET_KEY;
```

---

## 🌍 Môi trường khác nhau

### Local Development
File: `.env.local`
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_BLOCKCHAIN_NETWORK=amoy
NEXT_PUBLIC_BLOCKCHAIN_CHAIN_ID=80002
```

### Production
File: `.env.production`
```bash
NEXT_PUBLIC_API_BASE_URL=https://chainivo.online
NEXT_PUBLIC_BLOCKCHAIN_NETWORK=polygon
NEXT_PUBLIC_BLOCKCHAIN_CHAIN_ID=137
```

---

## ⚠️ Security Best Practices

### ✅ DO:
- Commit `.env.example` để team biết cấu trúc
- Lưu API keys trong `.env.local` (git ignored)
- Dùng `NEXT_PUBLIC_` prefix cho client-side vars
- Document các biến trong README

### ❌ DON'T:
- Hard-code API keys trong code
- Commit `.env.local` hoặc `.env.production` vào Git
- Dùng prefix `NEXT_PUBLIC_` cho sensitive data (passwords, secrets)
- Share API keys qua Slack/Email (dùng password manager)

---

## 🐛 Troubleshooting

### 1. Biến không load được

**Triệu chứng:** `undefined` khi access biến

**Giải pháp:**
```bash
# 1. Check biến có prefix NEXT_PUBLIC_ chưa (nếu dùng ở client)
# 2. Restart dev server
npm run dev

# 3. Clear Next.js cache
rm -rf .next
npm run dev
```

### 2. Giá trị biến không đúng

**Giải pháp:**
- Check load priority: `.env.local` > `.env.development` > `.env`
- Xóa biến trùng lặp trong các file
- Verify `NODE_ENV` đang là `development` hay `production`

### 3. Production build lỗi

**Giải pháp:**
```bash
# Đảm bảo có file .env.production
cp .env.example .env.production

# Edit giá trị production
nano .env.production

# Build lại
npm run build
```

---

## 📚 Tài liệu tham khảo

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Next.js 15 Docs](https://nextjs.org/docs)
- Project Rules: `AGENTS.md`

---

**Last Updated:** 2025-01-08  
**Version:** 2.0 (Refactored)
