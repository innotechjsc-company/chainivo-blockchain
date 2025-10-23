# Quy Tắc Code (Coding Rules) cho thư mục này

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
