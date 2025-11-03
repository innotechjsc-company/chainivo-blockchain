"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Header Skeleton */}
        <div className="mb-8 text-center">
          <div className="h-12 w-96 bg-muted animate-pulse rounded-lg mx-auto mb-4"></div>
          <div className="h-6 w-2/3 bg-muted animate-pulse rounded-lg mx-auto"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="glass">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-20 bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <Card className="glass mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
              <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
              <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
            </div>
          </CardContent>
        </Card>

        {/* NFT Grid Skeleton */}
        <div className="mb-12">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="glass overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse"></div>
                <CardContent className="p-4 space-y-2">
                  <div className="h-5 w-3/4 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-1/2 bg-muted animate-pulse rounded"></div>
                  <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

