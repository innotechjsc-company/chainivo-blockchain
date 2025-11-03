"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Back Button Skeleton */}
        <div className="mb-6">
          <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Section Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted animate-pulse rounded-2xl"></div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="glass">
                <CardContent className="p-4">
                  <div className="h-8 w-16 bg-muted animate-pulse rounded mx-auto mb-2"></div>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded mx-auto"></div>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-4">
                  <div className="h-8 w-16 bg-muted animate-pulse rounded mx-auto mb-2"></div>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded mx-auto"></div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Details Section Skeleton */}
          <div className="space-y-6">
            {/* Title & Description */}
            <div>
              <div className="h-10 w-3/4 bg-muted animate-pulse rounded mb-4"></div>
              <div className="h-4 w-full bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-muted animate-pulse rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-muted animate-pulse rounded"></div>
            </div>

            {/* Price Card Skeleton */}
            <Card className="glass">
              <CardContent className="p-4">
                <div className="h-4 w-20 bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-10 w-32 bg-muted animate-pulse rounded mb-4"></div>
                <div className="h-4 w-24 bg-muted animate-pulse rounded mb-4"></div>
                <div className="h-12 w-full bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>

            {/* Attributes Skeleton */}
            <Card className="glass">
              <CardContent className="p-4">
                <div className="h-6 w-32 bg-muted animate-pulse rounded mb-4"></div>
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-20 bg-muted animate-pulse rounded-lg"
                    ></div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Metadata Skeleton */}
            <Card className="glass">
              <CardContent className="p-4">
                <div className="h-6 w-24 bg-muted animate-pulse rounded mb-4"></div>
                <div className="h-48 w-full bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comments Section Skeleton */}
        <Card className="glass">
          <CardContent className="p-6">
            <div className="h-8 w-32 bg-muted animate-pulse rounded mb-6"></div>
            <div className="space-y-4 mb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-b border-border/50 pb-4">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2"></div>
                  <div className="h-4 w-full bg-muted animate-pulse rounded mb-1"></div>
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                </div>
              ))}
            </div>
            <div className="h-24 w-full bg-muted animate-pulse rounded mb-3"></div>
            <div className="flex justify-end">
              <div className="h-10 w-24 bg-muted animate-pulse rounded"></div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

