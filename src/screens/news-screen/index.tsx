"use client";
import { useEffect } from "react";
import { useAppSelector } from "@/stores";
import { useNewsData } from "./hooks/useNewsData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsCard } from "./components/NewsCard";
import "./news-screen.css";
import { useRouter } from "next/navigation";

export const NewsScreen = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.user);
  const router = useRouter();
  // Custom hooks
  const { allNews, loading, filterByType, getEventStatus } = useNewsData();

  // Handle navigation - copy y hệt logic từ component gốc
  const handleNavigate = (id: string) => {
    // TODO: Implement navigation to news detail page
    router.push(`/news/${id}`);
  };

  // Copy y hệt logic từ component gốc
  useEffect(() => {
    if (!isAuthenticated) {
      // TODO: Redirect to auth page
      console.log("User not authenticated, redirecting to auth...");
    }
  }, [isAuthenticated]);

  // Copy y hệt loading state từ component gốc
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Copy y hệt main content từ component gốc
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Tin tức & Sự kiện
          </h1>
          <p className="text-xl text-muted-foreground">
            Cập nhật tin tức mới nhất và các sự kiện sắp tới
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="news">Tin tức</TabsTrigger>
            <TabsTrigger value="notification">Thông báo</TabsTrigger>
            <TabsTrigger value="event">Sự kiện</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allNews.map((item) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  onNavigate={handleNavigate}
                  getEventStatus={getEventStatus}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="news" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterByType("news").map((item) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  onNavigate={handleNavigate}
                  getEventStatus={getEventStatus}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notification" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterByType("notification").map((item) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  onNavigate={handleNavigate}
                  getEventStatus={getEventStatus}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="event" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterByType("event").map((item) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  onNavigate={handleNavigate}
                  getEventStatus={getEventStatus}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {allNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Chưa có tin tức nào</p>
          </div>
        )}
      </main>
    </div>
  );
};
