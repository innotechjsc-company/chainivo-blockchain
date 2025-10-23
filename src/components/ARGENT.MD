# Quy Tắc Code (Coding Rules) cho Dự án Của Tôi

## 1. Quy Tắc Chung

- **Ngôn ngữ:** TypeScript.
- **Thụt lề (Indentation):** Dùng 2 khoảng trắng (spaces), không dùng tabs.
- **Dấu chấm phẩy (Semicolons):** Bắt buộc sử dụng ở cuối mỗi câu lệnh.
- **Dấu nháy (Quotes):** Dùng dấu nháy đơn (`'`) thay vì nháy kép (`"`) cho tất cả chuỗi, trừ khi chuỗi đó chứa dấu nháy đơn.

## 2. Quy Tắc Đặt Tên (Naming Conventions)

- **Biến (Variables):** `camelCase`.
- **Hằng số (Constants):** `UPPER_SNAKE_CASE` (ví dụ: `const MAX_COUNT = 10;`).
- **Hàm (Functions):** `camelCase`.
- **Components (React):** `PascalCase` (ví dụ: `MyButton.tsx`).
- **Tên tệp (Files):** `kebab-case` (ví dụ: `user-profile.tsx`), ngoại trừ tệp component chính phải là `PascalCase`.

## 3. Quy Tắc React

- **Components:** Luôn dùng Function Components với React Hooks. Không dùng Class Components.
- **Props:** Định nghĩa kiểu (type) cho props bằng `interface` hoặc `type` của TypeScript.
- **Imports:**
  - Sắp xếp import: `react` -> thư viện bên ngoài (npm) -> import nội bộ (alias `@/`) -> import tương đối (`./`, `../`).
  - Tránh dùng `export default`. Ưu tiên `export const`.

## 4 . Quy tắc css :

- \*\*Chuyển đổi tất cả biến của các thành phần của thư viện ui đang sử dụng sang thư viện shadui tương ứng với giao diện cần chuyển đổi
- \*\*Không cài thêm thư viện mới vào mà chỉ sử dụng các component shadui trong thư mục /Users/huy/Documents/code/chanivo-blockchain/chainivo-blockchain/src/components/ui
- \*\*Không tạo mới code hay tự viết code mới mà chỉ chuyển đổi giao diện đang có
- chỉ sử dụng các component trong thư mục /Users/huy/Documents/code/chanivo-blockchain/chainivo-blockchain/src/components/ui chứ không được install các thư viện Progress của shadcn/ui
- màu sắc của component này sẽ giữ nguyên và không thay đổi
-
