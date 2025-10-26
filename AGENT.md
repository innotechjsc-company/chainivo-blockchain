# Quy Tắc Code (Coding Rules) cho Dự án Của Tôi

## 1. Quy Tắc Chung

- **Ngôn ngữ:** TypeScript.
- **Thụt lề (Indentation):** Dùng 2 khoảng trắng (spaces), không dùng tabs.
- **Dấu chấm phẩy (Semicolons):** Bắt buộc sử dụng ở cuối mỗi câu lệnh.
- **Dấu nháy (Quotes):** Dùng dấu nháy đơn (`"`) thay vì nháy kép (`'`) cho tất cả chuỗi, trừ khi chuỗi đó chứa dấu nháy kép.
- **Thư viện (Package):** Không được tự cài thêm thư viện. nếu cần cài thêm thì phải có sự cho phép.

## 2. Quy Tắc Đặt Tên (Naming Conventions)

- **Biến (Variables):** `camelCase`.
- **Hằng số (Constants):** `UPPER_SNAKE_CASE` (ví dụ: `const MAX_COUNT = 10;`).
- **Hàm (Functions):** `camelCase`.
- **Components (React):** `PascalCase` (ví dụ: `MyButton.tsx`).
- **Tên tệp (Files):** `kebab-case` (ví dụ: `user-profile.tsx`), ngoại trừ tệp component chính phải là `PascalCase`.
- **Tên thư mục (Folder):** `kebab-case` (ví dụ: `home-screen`)

## 3. Quy Tắc React

- **Components:** Luôn dùng Function Components với React Hooks. Không dùng Class Components.
- **Props:** Định nghĩa kiểu (type) cho props bằng `interface` hoặc `type` của TypeScript.
- **Imports:**
  - Sắp xếp import: `react` -> thư viện bên ngoài (npm) -> import nội bộ (alias `@/`) -> import tương đối (`./`, `../`).
  - Tránh dùng `export default`. Ưu tiên `export const`.

## 4. Cấu Trúc Thư Mục (Folder Structure)

```
src/
├── app/                   # Next.js App Router pages
├── api/                   # Call api from server
├── components/            # Reusable UI components
│   ├── ui/                # Basic UI components (buttons, inputs, etc.)
│   ├── layout/            # Layout components (header, footer, sidebar)
│   ├── home/              # Home page specific components
│   ├── auction/           # Auction related components
│   ├── auth/              # Authentication components
│   ├── chatbot/           # Chatbot components
│   ├── demands/           # Demand related components
│   ├── notifications/     # Notification components
│   ├── profile/           # User profile components
│   ├── search/            # Search related components
│   ├── technologies/      # Technology related components
│   └── admin/             # Admin specific components
├── screens/               # Page-level components and screens
├── config/                # config color, theme...
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries and configurations
├── services/              # API services and external integrations
├── store/                 # State management (Redux, Zustand, etc.)
├── styles/                # Global styles and CSS files
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── constants/             # Application constants
```

### Quy Tắc Cấu Trúc Thư Mục:

- **components/**: Chứa các component có thể tái sử dụng, được tổ chức theo chức năng
- **screens/**: Chứa các component cấp trang, thường là các màn hình chính của ứng dụng
- **hooks/**: Chứa các custom hooks để tái sử dụng logic
- **lib/**: Chứa các thư viện tiện ích và cấu hình (API config, theme, etc.)
- **services/**: Chứa các service để gọi API và tích hợp bên ngoài
- **store/**: Quản lý state toàn cục của ứng dụng
- **types/**: Định nghĩa các kiểu dữ liệu TypeScript
- **utils/**: Các hàm tiện ích và helper functions
- **constants/**: Các hằng số của ứng dụng
