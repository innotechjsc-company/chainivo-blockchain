# Chainivo Blockchain

A modern blockchain project built with **Next.js 15**, **React 19**, **Tailwind CSS v4**, and **shadcn/ui**.

## 🚀 Tech Stack

- **Next.js 15.5.6** - React framework with App Router
- **React 19.1.0** - Latest React version
- **TypeScript 5** - Type safety
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Radix UI** - Accessible component primitives
- **Zustand 5.0.8** - Lightweight state management

## ✨ Features

- ✅ **Modern UI Components** - 14+ pre-configured shadcn/ui components
- ✅ **Dark Mode** - Built-in theme toggle with persistence
- ✅ **Fully Typed** - Complete TypeScript support
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Accessibility** - WCAG compliant components
- ✅ **Customizable** - Easy theme customization
- ✅ **State Management** - Zustand with TypeScript, persist & DevTools
- ✅ **6 Pre-configured Stores** - User, Wallet, Investment, NFT, Mission, Notification

## 📦 Installed shadcn/ui Components

- Avatar
- Badge
- Button
- Card
- Checkbox
- Dialog
- Dropdown Menu
- Input
- Label
- Select
- Sonner (Toast notifications)
- Switch
- Table
- Tabs

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Configure your environment variables in `.env.local`:
   - Set `ENVIRONMENT` to `development` or `production`
   - Update API URLs for your backend
   - Configure blockchain settings (network, RPC URLs, contract addresses)
   - Set up wallet addresses
   - Configure gas fees and defaults

**Environment Variables:**
- `ENVIRONMENT`: Set to `development` or `production`
- `API_BASE_URL_DEV/PROD`: Backend API URL
- `FRONTEND_BASE_URL_DEV/PROD`: Frontend URL
- `BLOCKCHAIN_*_DEV/PROD`: Blockchain configuration (network, chain ID, RPC URLs, etc.)
- `CAN_TOKEN_ADDRESS_DEV/PROD`: CAN token contract address
- `USDT_CONTRACT_ADDRESS_DEV/PROD`: USDT contract address
- `ADMIN_WALLET`: Admin wallet address
- `DEFAULT_GAS_FEE`: Default gas fee
- `DEFAULT_CURRENCY`: Default currency

See `.env.example` for all available configuration options.

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
# Build the project
npm run build

# Start production server
npm start
```

## 📖 Documentation

### State Management with Zustand

For detailed information about Zustand configuration and usage, see [ZUSTAND_GUIDE.md](./ZUSTAND_GUIDE.md).

**Quick Start:**
```typescript
import { useUser, useWallet } from '@/stores'

function MyComponent() {
  const user = useUser()
  const wallet = useWallet()
  
  return <div>Welcome, {user?.username}!</div>
}
```

**Demo:** Visit `/examples/zustand-demo` to see all stores in action.

### shadcn/ui Components

For detailed information about shadcn/ui setup and usage, see [SHADCN_SETUP.md](./SHADCN_SETUP.md).

### Adding New Components

```bash
# Add a single component
npx shadcn@latest add [component-name]

# Examples
npx shadcn@latest add form
npx shadcn@latest add calendar
npx shadcn@latest add data-table
```

### Available Components

Visit [shadcn/ui components](https://ui.shadcn.com/docs/components) to see all available components.

## 🎨 Customization

### Theme Colors

Edit `src/app/globals.css` to customize the color scheme:

```css
:root {
  --primary: 240 5.9% 10%;
  --secondary: 240 4.8% 95.9%;
  /* ... more variables */
}
```

Or use the [shadcn/ui Theme Generator](https://ui.shadcn.com/themes).

### Component Styling

Components can be customized using Tailwind classes:

```tsx
import { Button } from "@/components/ui/button";

<Button className="bg-gradient-to-r from-blue-500 to-purple-500">
  Custom Button
</Button>
```

## 📁 Project Structure

```
chainivo-blockchain/
├── src/
│   ├── app/
│   │   ├── examples/
│   │   │   ├── page.tsx           # Component examples
│   │   │   └── zustand-demo/      # Zustand demo page
│   │   ├── globals.css            # Global styles & theme variables
│   │   ├── layout.tsx             # Root layout with dark mode
│   │   └── page.tsx               # Home page
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── buttons/               # Custom button components
│   │   ├── inputs/                # Custom input components
│   │   └── theme-toggle.tsx       # Dark mode toggle
│   ├── stores/
│   │   ├── index.ts               # Store exports
│   │   ├── types.ts               # TypeScript types
│   │   ├── userStore.ts           # User authentication
│   │   ├── walletStore.ts         # Crypto wallet
│   │   ├── investmentStore.ts     # Portfolio management
│   │   ├── nftStore.ts            # NFT marketplace
│   │   ├── missionStore.ts        # Daily missions
│   │   ├── notificationStore.ts   # Notifications
│   │   └── README.md              # Quick reference
│   └── lib/
│       └── utils.ts               # Utility functions
├── components.json                # shadcn/ui configuration
├── ZUSTAND_GUIDE.md              # Zustand documentation
├── SHADCN_SETUP.md               # shadcn/ui setup guide
└── package.json
```

## 🔧 Configuration Files

- `components.json` - shadcn/ui configuration
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration
- `postcss.config.mjs` - PostCSS configuration

## 📚 Resources

### Official Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com)

### Useful Links
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [shadcn/ui Themes](https://ui.shadcn.com/themes)
- [shadcn/ui Blocks](https://ui.shadcn.com/blocks)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🚀 Deploy

### Vercel (Recommended)

The easiest way to deploy is using [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/chainivo-blockchain)

### Other Platforms

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for other deployment options.
