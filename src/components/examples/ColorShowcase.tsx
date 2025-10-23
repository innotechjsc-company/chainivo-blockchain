"use client"

import React from 'react'
import { 
  brandColors, 
  semanticColors, 
  cryptoColors,
  gradients,
  shadows,
  lighten,
  darken,
  withAlpha,
  generateColorPalette,
} from '@/config/colors'

/**
 * Component showcase để demo các màu trong hệ thống
 * Truy cập tại: /examples/colors
 */
export function ColorShowcase() {
  return (
    <div className="container mx-auto p-8 space-y-12">
      <div>
        <h1 className="text-4xl font-bold mb-2">Color System Showcase</h1>
        <p className="text-muted-foreground">
          Demo các màu và cách sử dụng trong dự án Chainivo Blockchain
        </p>
      </div>

      {/* Brand Colors */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Brand Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ColorCard
            title="Primary"
            color="bg-primary"
            textColor="text-primary-foreground"
            description="Màu chính của brand"
          />
          <ColorCard
            title="Secondary"
            color="bg-secondary"
            textColor="text-secondary-foreground"
            description="Màu phụ"
          />
          <ColorCard
            title="Accent"
            color="bg-accent"
            textColor="text-accent-foreground"
            description="Màu nhấn"
          />
        </div>
      </section>

      {/* Semantic Colors */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Semantic Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-lg" style={{ backgroundColor: semanticColors.success.DEFAULT }}>
            <h3 className="text-white font-semibold mb-2">Success</h3>
            <p className="text-white/90 text-sm">Thành công, xác nhận</p>
          </div>
          <div className="p-6 rounded-lg" style={{ backgroundColor: semanticColors.warning.DEFAULT }}>
            <h3 className="text-white font-semibold mb-2">Warning</h3>
            <p className="text-white/90 text-sm">Cảnh báo, chờ xử lý</p>
          </div>
          <div className="p-6 rounded-lg" style={{ backgroundColor: semanticColors.error.DEFAULT }}>
            <h3 className="text-white font-semibold mb-2">Error</h3>
            <p className="text-white/90 text-sm">Lỗi, thất bại</p>
          </div>
          <div className="p-6 rounded-lg" style={{ backgroundColor: semanticColors.info.DEFAULT }}>
            <h3 className="text-white font-semibold mb-2">Info</h3>
            <p className="text-white/90 text-sm">Thông tin</p>
          </div>
        </div>
      </section>

      {/* Crypto Colors */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Blockchain/Crypto Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold mb-3">Transaction Status</h3>
            <StatusBadge status="pending" label="Pending" />
            <StatusBadge status="confirmed" label="Confirmed" />
            <StatusBadge status="failed" label="Failed" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold mb-3">Price Movement</h3>
            <PriceBadge direction="up" value="+5.23%" />
            <PriceBadge direction="down" value="-2.45%" />
            <PriceBadge direction="neutral" value="0.00%" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold mb-3">Network</h3>
            <NetworkBadge network="mainnet" />
            <NetworkBadge network="testnet" />
            <NetworkBadge network="devnet" />
          </div>
        </div>
      </section>

      {/* Gradients */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Gradient Presets</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GradientCard gradient={gradients.primary} title="Primary Gradient" />
          <GradientCard gradient={gradients.crypto} title="Crypto Gradient" />
          <GradientCard gradient={gradients.gold} title="Gold Gradient" />
          <GradientCard gradient={gradients.success} title="Success Gradient" />
          <GradientCard gradient={gradients.warning} title="Warning Gradient" />
          <GradientCard gradient={gradients.error} title="Error Gradient" />
        </div>
      </section>

      {/* Shadows */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Shadow Presets</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ShadowCard shadow={shadows.sm} title="Small" />
          <ShadowCard shadow={shadows.DEFAULT} title="Default" />
          <ShadowCard shadow={shadows.md} title="Medium" />
          <ShadowCard shadow={shadows.lg} title="Large" />
          <ShadowCard shadow={shadows.xl} title="Extra Large" />
          <ShadowCard shadow={shadows['2xl']} title="2X Large" />
          <ShadowCard shadow={shadows.primaryGlow} title="Primary Glow" />
          <ShadowCard shadow={shadows.accentGlow} title="Accent Glow" />
        </div>
      </section>

      {/* Color Utilities */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Color Utilities</h2>
        <div className="space-y-4">
          <UtilityDemo />
        </div>
      </section>

      {/* Color Palette Generator */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Color Palette Generator</h2>
        <PaletteDemo />
      </section>
    </div>
  )
}

// Helper Components

function ColorCard({ 
  title, 
  color, 
  textColor, 
  description 
}: { 
  title: string
  color: string
  textColor: string
  description: string
}) {
  return (
    <div className={`${color} ${textColor} p-6 rounded-lg`}>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  )
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  const colors = {
    pending: cryptoColors.pending,
    confirmed: cryptoColors.confirmed,
    failed: cryptoColors.failed,
  }
  
  return (
    <div 
      className="inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium"
      style={{ backgroundColor: colors[status as keyof typeof colors] }}
    >
      {label}
    </div>
  )
}

function PriceBadge({ direction, value }: { direction: string; value: string }) {
  const colors = {
    up: cryptoColors.priceUp,
    down: cryptoColors.priceDown,
    neutral: cryptoColors.priceNeutral,
  }
  
  return (
    <div 
      className="inline-flex items-center px-3 py-1 rounded text-white text-sm font-medium"
      style={{ backgroundColor: colors[direction as keyof typeof colors] }}
    >
      {direction === 'up' && '↑ '}
      {direction === 'down' && '↓ '}
      {value}
    </div>
  )
}

function NetworkBadge({ network }: { network: string }) {
  const colors = {
    mainnet: cryptoColors.mainnet,
    testnet: cryptoColors.testnet,
    devnet: cryptoColors.devnet,
  }
  
  const labels = {
    mainnet: 'Mainnet',
    testnet: 'Testnet',
    devnet: 'Devnet',
  }
  
  return (
    <div 
      className="inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium"
      style={{ backgroundColor: colors[network as keyof typeof colors] }}
    >
      {labels[network as keyof typeof labels]}
    </div>
  )
}

function GradientCard({ gradient, title }: { gradient: string; title: string }) {
  return (
    <div 
      className="p-6 rounded-lg text-white"
      style={{ background: gradient }}
    >
      <h3 className="font-semibold">{title}</h3>
    </div>
  )
}

function ShadowCard({ shadow, title }: { shadow: string; title: string }) {
  return (
    <div 
      className="bg-background p-6 rounded-lg"
      style={{ boxShadow: shadow }}
    >
      <p className="text-sm font-medium text-center">{title}</p>
    </div>
  )
}

function UtilityDemo() {
  const baseColor = '240 5.9% 50%'
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <h3 className="font-semibold">Lighten & Darken</h3>
        <div className="flex gap-2">
          <div 
            className="flex-1 p-4 rounded text-white text-center text-sm"
            style={{ backgroundColor: `hsl(${darken(baseColor, 20)})` }}
          >
            Darken 20%
          </div>
          <div 
            className="flex-1 p-4 rounded text-white text-center text-sm"
            style={{ backgroundColor: `hsl(${baseColor})` }}
          >
            Base
          </div>
          <div 
            className="flex-1 p-4 rounded text-center text-sm"
            style={{ backgroundColor: `hsl(${lighten(baseColor, 20)})` }}
          >
            Lighten 20%
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="font-semibold">Alpha (Opacity)</h3>
        <div className="flex gap-2">
          <div 
            className="flex-1 p-4 rounded text-white text-center text-sm"
            style={{ backgroundColor: withAlpha(baseColor, 0.3) }}
          >
            30%
          </div>
          <div 
            className="flex-1 p-4 rounded text-white text-center text-sm"
            style={{ backgroundColor: withAlpha(baseColor, 0.6) }}
          >
            60%
          </div>
          <div 
            className="flex-1 p-4 rounded text-white text-center text-sm"
            style={{ backgroundColor: withAlpha(baseColor, 1) }}
          >
            100%
          </div>
        </div>
      </div>
    </div>
  )
}

function PaletteDemo() {
  const palette = generateColorPalette('217 91% 50%')
  
  return (
    <div className="grid grid-cols-11 gap-2">
      {Object.entries(palette).map(([shade, hsl]) => (
        <div key={shade} className="space-y-2">
          <div 
            className="h-20 rounded"
            style={{ backgroundColor: `hsl(${hsl})` }}
          />
          <p className="text-xs text-center text-muted-foreground">{shade}</p>
        </div>
      ))}
    </div>
  )
}

export default ColorShowcase

