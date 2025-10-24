"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ScrollbarDemoPage() {
  const router = useRouter();

  const sampleData = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    description: `This is a sample item with some content to demonstrate the custom scrollbar. Item number ${
      i + 1
    } has some interesting details.`,
    status: i % 3 === 0 ? "active" : i % 3 === 1 ? "pending" : "completed",
  }));

  const notifications = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Notification ${i + 1}`,
    message: `This is a sample notification message. Notification ${
      i + 1
    } contains important information.`,
    time: `${i + 1} phút trước`,
    unread: i < 5,
  }));

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
              <span className="gradient-text">Custom Scrollbar Demo</span>
            </h1>
            <p className="text-muted-foreground">
              Các loại thanh scroll tùy chỉnh đẹp mắt
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Default Scrollbar */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="default">Default</Badge>
                  Scrollbar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 overflow-y-auto border rounded-lg p-4">
                  {sampleData.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 mb-2 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{item.title}</h4>
                        <Badge
                          variant={
                            item.status === "active"
                              ? "default"
                              : item.status === "pending"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Sử dụng scrollbar mặc định với gradient đẹp mắt
                </p>
              </CardContent>
            </Card>

            {/* Custom Scrollbar */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary">Custom</Badge>
                  Scrollbar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 overflow-y-auto custom-scrollbar border rounded-lg p-4">
                  {sampleData.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 mb-2 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{item.title}</h4>
                        <Badge
                          variant={
                            item.status === "active"
                              ? "default"
                              : item.status === "pending"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Scrollbar tùy chỉnh với kích thước nhỏ hơn
                </p>
              </CardContent>
            </Card>

            {/* Notification Scrollbar */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline">Notification</Badge>
                  Scrollbar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 overflow-y-auto notification-scrollbar border rounded-lg">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 hover:bg-accent cursor-pointer border-b border-border/50 ${
                        notif.unread ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-sm">{notif.title}</h4>
                        {notif.unread && (
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {notif.message}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {notif.time}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Scrollbar mỏng cho notifications
                </p>
              </CardContent>
            </Card>

            {/* Hidden Scrollbar */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="destructive">Hidden</Badge>
                  Scrollbar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 overflow-y-auto hide-scrollbar border rounded-lg p-4">
                  {sampleData.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 mb-2 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{item.title}</h4>
                        <Badge
                          variant={
                            item.status === "active"
                              ? "default"
                              : item.status === "pending"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Scrollbar ẩn nhưng vẫn có thể scroll
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Usage Examples */}
          <Card className="glass mt-8">
            <CardHeader>
              <CardTitle>Cách sử dụng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Default Scrollbar</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Tự động áp dụng cho tất cả elements có scroll
                </p>
                <code className="text-xs bg-muted p-2 rounded block">
                  {`<div className="overflow-y-auto">Content</div>`}
                </code>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Custom Scrollbar</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Scrollbar nhỏ hơn cho các elements cụ thể
                </p>
                <code className="text-xs bg-muted p-2 rounded block">
                  {`<div className="overflow-y-auto custom-scrollbar">Content</div>`}
                </code>
              </div>

              <div>
                <h4 className="font-semibold mb-2">
                  3. Notification Scrollbar
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Scrollbar mỏng cho notifications
                </p>
                <code className="text-xs bg-muted p-2 rounded block">
                  {`<div className="overflow-y-auto notification-scrollbar">Content</div>`}
                </code>
              </div>

              <div>
                <h4 className="font-semibold mb-2">4. Hidden Scrollbar</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Ẩn scrollbar nhưng vẫn có thể scroll
                </p>
                <code className="text-xs bg-muted p-2 rounded block">
                  {`<div className="overflow-y-auto hide-scrollbar">Content</div>`}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
