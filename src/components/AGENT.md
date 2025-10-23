# Quy Tắc Thư Mục Components

## Mục Đích

Thư mục này chứa các reusable React components được tổ chức theo feature/domain.

## Cấu Trúc

- Các thư mục chứa các component được nhóm theo tính năng hoặc loại: `buttons/`, `inputs/`, `ui/`
- Các component độc lập: `index.ts`, `theme-toggle.tsx`

## Hướng Dẫn

### Tạo Component

1. Nhóm các components liên quan trong feature folders
2. Sử dụng PascalCase cho component files: `ComponentName.tsx`
3. Export components dưới dạng named exports khi có thể
4. Giữ components tập trung vào single responsibility

### TypeScript

- Định nghĩa prop interfaces một cách rõ ràng
- Sử dụng `React.FC<Props>` hoặc functional component syntax
- Tránh `any` types - sử dụng `unknown` và type guards nếu cần
- Export prop types để tái sử dụng

### Styling

- Sử dụng TailwindCSS cho styling
- Sử dứng Ant Design components khi phù hợp
- Tuân theo class naming conventions có sẵn
- Co-locate styles với components khi phù hợp

### Quản Lý State

- Sử dụng local state cho component-specific data
- Sử dụng global store (xem `/store`) cho shared application state
- Tận dụng custom hooks (xem `/hooks`) cho logic phức tạp

### Tích Hợp API

- Import API functions từ `/api`
- Xử lý loading, error, và success states
- Sử dứng custom hooks cho data fetching khi có thể
- KHÔNG bao giờ gọi API trực tiếp - luôn qua API layer

### Best Practices

- Giữ components nhỏ và composable
- Tách reusable logic ra custom hooks
- Sử dụng tên component và prop có ý nghĩa
- Thêm comments cho logic phức tạp
- Xử lý edge cases và loading states
- Làm components accessible (ARIA attributes, semantic HTML)
- Memoize expensive computations với useMemo/useCallback khi cần

### Quy Ước Bổ Sung

- ✅ **NÊN**: Tạo components tái sử dụng được (DRY principle)
- ✅ **NÊN**: Sử dụng PropTypes hoặc TypeScript interfaces
- ✅ **NÊN**: Giữ components dưới 200 lines of code
- ❌ **KHÔNG**: Truyền quá nhiều props (tối đa 7-8 props)
- ✅ **NÊN**: Sử dụng composition thay vì inheritance
- ✅ **NÊN**: Implement error boundaries cho components phức tạp
- ❌ **KHÔNG**: Lưu sensitive data trong component state
- ✅ **NÊN**: Test components với React Testing Library
- ✅ **NÊN**: Sử dụng default props cho optional props
