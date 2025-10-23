# Quy Tắc Thư Mục Screens

## Mục đích
Thư mục này chứa các screen components cấp cao đại diện cho các view hoặc trang hoàn chỉnh. Các screens được tạo nên từ nhiều components nhỏ hơn.

## Quy Tắc Chung
- **API:** Luôn dùng api từ thư mục `/api` - KHÔNG gọi API trực tiếp
- **Giao diện:** Luôn dùng giao diện từ TailwindCSS và Ant Design
- **Components:** Luôn import và tái sử dụng component có sẵn từ thư mục `/components`
- **Store:** Luôn dùng store từ thư mục `/store` cho global state
- **Hooks:** Luôn dùng custom hooks từ thư mục `/hooks` cho logic phức tạp
- **Services:** Luôn dùng services từ thư mục `/services` cho business logic
- **Types:** Import types từ thư mục `/types`
- **Utils:** Sử dụng utility functions từ thư mục `/utils`

## Cấu Trúc Screen
```
screens/
  FeatureScreen/
    index.tsx          # File giao diện chính của screen
    components/        # Components đặc thù cho screen này
      FeatureCard.tsx
      FeatureList.tsx
    hooks/            # Custom hooks đặc thù cho screen này
      useFeatureData.ts
      useFeatureFilter.ts
```

### index.tsx - File Chính
Đây là file giao diện chính của screen, chịu trách nhiệm:
1. **Fetch dữ liệu** thông qua custom hooks
2. **Quản lý state** cục bộ của screen
3. **Xử lý events** và logic điều khiển
4. **Compose UI** từ các components nhỏ hơn

```typescript
export const FeatureScreen = () => {
  // 1. Fetch dữ liệu qua hooks
  const { data, loading, error } = useFeatureData();
  
  // 2. State management cục bộ
  const [filter, setFilter] = useState('');
  
  // 3. Event handlers
  const handleAction = () => { /* ... */ };
  
  // 4. Compose UI
  return (
    <Layout>
      <Header />
      <FeatureContent data={data} loading={loading} />
      <Footer />
    </Layout>
  );
};
```

### components/ - Thư Mục Components
- Chứa các components được tách ra từ `index.tsx`
- Các components này CHỈ được sử dụng trong screen hiện tại
- Nếu component được dùng ở nhiều nơi, hãy chuyển sang `/components`
- Đặt tên rõ ràng theo chức năng: `FeatureCard.tsx`, `FeatureFilter.tsx`

### hooks/ - Thư Mục Hooks
- Chứa custom hooks được tách ra từ `index.tsx`
- Hooks xử lý logic phức tạp đặc thù cho screen này
- Nếu hook được dùng ở nhiều screen, hãy chuyển sang `/hooks`
- Đặt tên theo convention: `useFeatureName.ts`

## Nguyên Tắc Screen Components

### 1. Quan Hệ với /app (Next.js Routes)
- Screen components được import vào `/app` routes
- File `/app/page.tsx` nên là wrapper mỏng xung quanh screens
- Separation này giúp dễ test và có thể migrate framework

### 2. Tổ Chức Code
- Giữ screen tập trung vào **composition**, không phải implementation
- Delegate logic phức tạp xuống hooks và services
- Truyền data xuống child components qua props
- Handle loading và error states ở cấp screen

### 3. Data Fetching
- Sử dụng custom hooks từ `/hooks` để fetch data
- Import API functions từ `/api`
- KHÔNG call API trực tiếp trong component
- Handle các states: loading, error, success

### 4. State Management
- Local state: Dùng `useState` cho state đặc thù của screen
- Global state: Dùng store từ `/store` (auth, user preferences, etc.)
- Server state: Dùng custom hooks tích hợp với API layer

### 5. TypeScript
- Định nghĩa types rõ ràng cho props và state
- Import types từ `/types`
- Tránh dùng `any` - sử dụng `unknown` và type guards

### 6. Styling
- Sử dụng TailwindCSS cho styling
- Sử dụng Ant Design components khi phù hợp
- Tuân theo design system đã thiết lập
- Đảm bảo responsive design cho mọi screen size

## Best Practices

### ✅ NÊN
- Giữ screens đơn giản và tập trung vào composition
- Tách logic phức tạp ra custom hooks
- Tái sử dụng components từ `/components`
- Handle authentication/authorization ở cấp screen
- Implement skeleton screens cho loading states
- Thêm proper error boundaries
- Viết TypeScript type-safe
- Document các props và behaviors phức tạp

### ❌ KHÔNG NÊN
- Gọi API trực tiếp trong screen component
- Viết inline styles (dùng TailwindCSS)
- Copy-paste code - hãy tạo reusable components/hooks
- Để business logic trong component - chuyển sang services
- Import components từ screens khác (tạo shared component)
- Làm screens quá phức tạp (>300 lines)

## Testing
- Screens là đơn vị chính cho integration tests
- Mock API calls và hooks trong tests
- Test user flows và interactions
- Verify proper error handling và loading states

## SEO và Performance
- Implement proper metadata (khi dùng với `/app`)
- Optimize images và assets
- Lazy load components nặng khi cần
- Sử dụng React.memo cho components render nhiều
- Profile và optimize re-renders

## Accessibility
- Sử dụng semantic HTML
- Thêm ARIA attributes khi cần
- Đảm bảo keyboard navigation
- Test với screen readers
- Maintain proper heading hierarchy
