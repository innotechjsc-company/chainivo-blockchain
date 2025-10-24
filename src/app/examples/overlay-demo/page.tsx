"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const overlayTypes = [
  {
    name: "Basic Overlay",
    description: "Black gradient overlay",
    overlay: "bg-gradient-to-br from-black/40 to-black/60",
    color: "text-white",
  },
  {
    name: "Primary Overlay",
    description: "Primary color overlay",
    overlay: "bg-gradient-to-br from-primary/40 to-primary/20",
    color: "text-white",
  },
  {
    name: "Secondary Overlay",
    description: "Secondary color overlay",
    overlay: "bg-gradient-to-br from-secondary/40 to-secondary/20",
    color: "text-white",
  },
  {
    name: "Accent Overlay",
    description: "Accent color overlay",
    overlay: "bg-gradient-to-br from-accent/40 to-accent/20",
    color: "text-white",
  },
  {
    name: "Multi-layer Overlay",
    description: "Black + Color overlay",
    overlay: "bg-gradient-to-br from-black/30 to-black/50",
    colorOverlay: "bg-gradient-to-br from-primary/30 to-secondary/30",
    color: "text-white",
  },
  {
    name: "Gradient Overlay",
    description: "Custom gradient overlay",
    overlay:
      "bg-gradient-to-br from-blue-500/40 via-purple-500/30 to-pink-500/40",
    color: "text-white",
  },
];

const rarityOverlays = [
  {
    name: "Common Box",
    rarity: "Common",
    color: "from-gray-500 to-gray-700",
    overlay: "bg-gradient-to-br from-gray-500/30 to-gray-700/30",
  },
  {
    name: "Rare Box",
    rarity: "Rare",
    color: "from-blue-500 to-purple-600",
    overlay: "bg-gradient-to-br from-blue-500/30 to-purple-600/30",
  },
  {
    name: "Legendary Box",
    rarity: "Legendary",
    color: "from-yellow-400 to-red-600",
    overlay: "bg-gradient-to-br from-yellow-400/30 to-red-600/30",
  },
];

export default function OverlayDemoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-12">
        <Button
          variant="ghost"
          onClick={() => router.push("/examples")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Overlay Demo</span>
            </h1>
            <p className="text-muted-foreground">
              Các loại lớp phủ màu khác nhau trên background ảnh
            </p>
          </div>

          {/* Basic Overlay Types */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Các loại Overlay cơ bản</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {overlayTypes.map((overlay, index) => (
                <Card key={index} className="glass">
                  <CardHeader>
                    <CardTitle className="text-lg">{overlay.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="relative h-48 rounded-lg overflow-hidden mb-4"
                      style={{
                        backgroundImage: `url('/nft-box.jpg')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      {/* Base overlay */}
                      <div
                        className={`absolute inset-0 ${overlay.overlay}`}
                      ></div>

                      {/* Additional color overlay if exists */}
                      {overlay.colorOverlay && (
                        <div
                          className={`absolute inset-0 ${overlay.colorOverlay}`}
                        ></div>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package
                          className={`w-16 h-16 ${overlay.color} drop-shadow-lg`}
                        />
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge variant="secondary" className="backdrop-blur-sm">
                          {overlay.description}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {overlay.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Rarity-based Overlays */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Overlay theo Rarity</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rarityOverlays.map((box, index) => (
                <Card key={index} className="glass">
                  <CardHeader>
                    <CardTitle className="text-lg">{box.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="relative h-48 rounded-lg overflow-hidden mb-4"
                      style={{
                        backgroundImage: `url('/nft-box.jpg')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      {/* Base black overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60"></div>

                      {/* Rarity color overlay */}
                      <div className={`absolute inset-0 ${box.overlay}`}></div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="w-16 h-16 text-white drop-shadow-lg" />
                      </div>

                      <div className="absolute top-4 right-4">
                        <Badge variant="outline" className="backdrop-blur-sm">
                          {box.rarity}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {box.rarity} tier với overlay màu tương ứng
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Advanced Overlay Examples */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Overlay nâng cao</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Animated Overlay */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Animated Overlay</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="relative h-48 rounded-lg overflow-hidden mb-4 group"
                    style={{
                      backgroundImage: `url('/nft-box.jpg')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 group-hover:from-primary/60 group-hover:to-secondary/60 transition-all duration-300"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="w-16 h-16 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Overlay với hover animation
                  </p>
                </CardContent>
              </Card>

              {/* Multi-layer Overlay */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Multi-layer Overlay</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="relative h-48 rounded-lg overflow-hidden mb-4"
                    style={{
                      backgroundImage: `url('/nft-box.jpg')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    {/* Layer 1: Base black overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50"></div>

                    {/* Layer 2: Color overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30"></div>

                    {/* Layer 3: Accent overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="w-16 h-16 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Nhiều lớp overlay chồng lên nhau
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Usage Examples */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-4">
                Cách sử dụng Overlay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Basic Black Overlay</h4>
                <code className="text-xs bg-muted p-2 rounded block">
                  {`<div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60"></div>`}
                </code>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Color Overlay</h4>
                <code className="text-xs bg-muted p-2 rounded block">
                  {`<div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-primary/20"></div>`}
                </code>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. Multi-layer Overlay</h4>
                <code className="text-xs bg-muted p-2 rounded block">
                  {`<div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50"></div>
<div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30"></div>`}
                </code>
              </div>

              <div>
                <h4 className="font-semibold mb-2">4. Dynamic Overlay</h4>
                <code className="text-xs bg-muted p-2 rounded block">
                  {`<div className={\`absolute inset-0 \${
                    index === 0 ? 'bg-gradient-to-br from-primary/40 to-primary/20' :
                    index === 1 ? 'bg-gradient-to-br from-secondary/40 to-secondary/20' :
                    'bg-gradient-to-br from-accent/40 to-accent/20'
                  }\`}></div>`}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
