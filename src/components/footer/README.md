# Footer Component

## Mô tả

Component Footer được tách ra từ Footer.tsx gốc, sử dụng shadcn/ui và tuân thủ quy tắc AGENT.md.

## Cấu trúc

```
src/components/footer/
├── components/
│   ├── FooterBrand.tsx      # Brand section với logo và mô tả
│   ├── FooterSection.tsx    # Section với links
│   ├── SocialLinks.tsx      # Social media links
│   └── FooterBottom.tsx     # Copyright và legal links
├── hooks/
│   └── useFooterData.ts     # Data management hook
├── index.tsx                # Main Footer component
├── footer.css              # Custom styles
└── README.md               # Documentation
```

## Sử dụng

```tsx
import { Footer } from "@/components/footer";

export default function Layout() {
  return (
    <div>
      {/* Your content */}
      <Footer />
    </div>
  );
}
```

## Tính năng

- **Responsive Design**: Tự động điều chỉnh layout theo screen size
- **Glass Morphism**: Copy y hệt glass effects từ component gốc
- **Gradient Text**: Copy y hệt gradient text styling
- **Hover Effects**: Copy y hệt hover animations
- **Accessibility**: Focus states và keyboard navigation
- **Type Safety**: Full TypeScript support

## Data Structure

- **Brand**: Logo, name, description
- **Sections**: Title và links array
- **Social Links**: Social media links với icons
- **Bottom**: Copyright và legal links

## Styling

- Copy y hệt từ Footer.tsx gốc
- Glass morphism effects
- Gradient text
- Hover animations
- Responsive grid layout
