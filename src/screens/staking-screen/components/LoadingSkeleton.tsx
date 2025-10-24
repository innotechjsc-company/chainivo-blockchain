"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section Skeleton */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <div className="h-8 w-48 bg-muted animate-pulse rounded-full mx-auto"></div>
          </div>
          <div className="h-16 w-96 bg-muted animate-pulse rounded-lg mx-auto mb-4"></div>
          <div className="h-6 w-2/3 bg-muted animate-pulse rounded-lg mx-auto"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-primary/20">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="space-y-8">
          <div className="flex justify-center">
            <div className="h-12 w-96 bg-muted animate-pulse rounded-lg"></div>
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-primary/30">
              <CardHeader>
                <div className="h-48 bg-muted animate-pulse rounded-t-lg"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-16 bg-muted animate-pulse rounded-lg"></div>
                <div className="h-12 bg-muted animate-pulse rounded-lg"></div>
                <div className="h-20 bg-muted animate-pulse rounded-lg"></div>
                <div className="h-12 bg-muted animate-pulse rounded-lg"></div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <div className="h-6 w-48 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-64 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-12">
                  <div className="h-16 w-16 bg-muted animate-pulse rounded-full mx-auto mb-4"></div>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded mx-auto mb-2"></div>
                  <div className="h-3 w-48 bg-muted animate-pulse rounded mx-auto"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Section Skeleton */}
        <Card className="mt-8 border-primary/20">
          <CardHeader>
            <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-muted animate-pulse rounded-full"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
                      <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <div
                            key={j}
                            className="h-3 w-full bg-muted animate-pulse rounded"
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-20 bg-muted animate-pulse rounded-lg"></div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
