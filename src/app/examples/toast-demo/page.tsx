"use client";

import { useState } from "react";
import { ToastService } from "@/services";
import { Button } from "@/components/buttons";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ToastDemoPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Simulate async operation
  const simulateAsync = (success = true, delay = 2000) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (success) {
          resolve({ data: "Success data", count: 42 });
        } else {
          reject(new Error("Operation failed"));
        }
      }, delay);
    });
  };

  // Simulate API call
  const simulateApiCall = (success = true) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (success) {
          resolve({ status: 200, data: { message: "Success" } });
        } else {
          const error: any = new Error("API Error");
          error.response = {
            data: {
              message: "Failed to process request",
              details: "Server error occurred",
            },
            statusText: "Internal Server Error",
          };
          reject(error);
        }
      }, 1500);
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Toast Service Demo</h1>
        <p className="text-muted-foreground">
          Interactive examples demonstrating all ToastService features
        </p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="utils">Utils</TabsTrigger>
        </TabsList>

        {/* Basic Toasts */}
        <TabsContent value="basic">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Basic Toast Types</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button
                onClick={() =>
                  ToastService.message("This is a default message")
                }
              >
                Default Message
              </Button>

              <Button
                onClick={() =>
                  ToastService.success("Operation completed successfully!")
                }
              >
                Success Toast
              </Button>

              <Button
                onClick={() => ToastService.error("Something went wrong!")}
              >
                Error Toast
              </Button>

              <Button
                onClick={() =>
                  ToastService.warning("Please be careful with this action")
                }
              >
                Warning Toast
              </Button>

              <Button onClick={() => ToastService.info("New update available")}>
                Info Toast
              </Button>

              <Button
                onClick={() => {
                  const id = ToastService.loading("Processing...");
                  setTimeout(() => {
                    ToastService.dismiss(id);
                    ToastService.success("Done!");
                  }, 3000);
                }}
              >
                Loading Toast
              </Button>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Code Example:</h3>
              <pre className="text-sm overflow-x-auto">
                {`ToastService.success('Operation completed!')
ToastService.error('Something went wrong!')
ToastService.warning('Please be careful')
ToastService.info('New update available')
ToastService.loading('Processing...')`}
              </pre>
            </div>
          </Card>
        </TabsContent>

        {/* Advanced Toasts */}
        <TabsContent value="advanced">
          <div className="space-y-6">
            {/* With Description */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Toast with Description
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() =>
                    ToastService.success("Profile Updated", {
                      description:
                        "Your profile changes have been saved successfully",
                    })
                  }
                >
                  Success with Description
                </Button>

                <Button
                  onClick={() =>
                    ToastService.error("Upload Failed", {
                      description:
                        "The file size exceeds the maximum limit of 10MB",
                    })
                  }
                >
                  Error with Description
                </Button>
              </div>
            </Card>

            {/* With Action Buttons */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Toast with Action Buttons
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() =>
                    ToastService.successWithAction(
                      "File deleted",
                      "Undo",
                      () => {
                        ToastService.info("Undo action triggered");
                      }
                    )
                  }
                >
                  Success with Action
                </Button>

                <Button
                  onClick={() =>
                    ToastService.errorWithRetry("Connection failed", () => {
                      ToastService.loading("Retrying...");
                      setTimeout(() => {
                        ToastService.dismiss();
                        ToastService.success("Connected!");
                      }, 2000);
                    })
                  }
                >
                  Error with Retry
                </Button>

                <Button
                  onClick={() =>
                    ToastService.confirm(
                      "Delete this item?",
                      () => {
                        ToastService.success("Item deleted");
                      },
                      () => {
                        ToastService.info("Cancelled");
                      }
                    )
                  }
                >
                  Confirmation Dialog
                </Button>
              </div>
            </Card>

            {/* Promise Toast */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Promise Toast</h2>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => {
                    ToastService.promise(simulateAsync(true), {
                      loading: "Fetching data...",
                      success: (data: any) => `Loaded ${data.count} items`,
                      error: (err) => `Error: ${err.message}`,
                    });
                  }}
                >
                  Promise Success
                </Button>

                <Button
                  onClick={() => {
                    ToastService.promise(simulateAsync(false), {
                      loading: "Processing request...",
                      success: "Request completed",
                      error: (err) => `Failed: ${err.message}`,
                    });
                  }}
                >
                  Promise Error
                </Button>
              </div>

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Code Example:</h3>
                <pre className="text-sm overflow-x-auto">
                  {`ToastService.promise(fetchData(), {
  loading: 'Loading...',
  success: (data) => \`Loaded \${data.length} items\`,
  error: (err) => \`Error: \${err.message}\`
})`}
                </pre>
              </div>
            </Card>

            {/* Custom Duration & Position */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Custom Duration & Position
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  onClick={() =>
                    ToastService.success("Quick message", {
                      duration: 1000,
                    })
                  }
                >
                  1 Second
                </Button>

                <Button
                  onClick={() =>
                    ToastService.info("Normal duration", {
                      duration: 4000,
                    })
                  }
                >
                  4 Seconds
                </Button>

                <Button
                  onClick={() =>
                    ToastService.success("Long message", {
                      duration: 10000,
                    })
                  }
                >
                  10 Seconds
                </Button>

                <Button
                  onClick={() =>
                    ToastService.success("Top Left", {
                      position: "top-left",
                    })
                  }
                >
                  Top Left
                </Button>

                <Button
                  onClick={() =>
                    ToastService.success("Top Center", {
                      position: "top-center",
                    })
                  }
                >
                  Top Center
                </Button>

                <Button
                  onClick={() =>
                    ToastService.success("Bottom Right", {
                      position: "bottom-right",
                    })
                  }
                >
                  Bottom Right
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* API Integration */}
        <TabsContent value="api">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              API Integration Helpers
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={async () => {
                  try {
                    await simulateApiCall(true);
                    ToastService.apiSuccess("User created successfully");
                  } catch (error) {
                    ToastService.apiError(error);
                  }
                }}
              >
                API Success
              </Button>

              <Button
                onClick={async () => {
                  try {
                    await simulateApiCall(false);
                    ToastService.apiSuccess();
                  } catch (error) {
                    ToastService.apiError(error, "Failed to save data");
                  }
                }}
              >
                API Error
              </Button>

              <Button onClick={() => ToastService.networkError()}>
                Network Error
              </Button>

              <Button onClick={() => ToastService.unauthorized()}>
                Unauthorized
              </Button>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Code Example:</h3>
              <pre className="text-sm overflow-x-auto">
                {`try {
  await api.post('/users', data)
  ToastService.apiSuccess('User created')
} catch (error) {
  ToastService.apiError(error)
}`}
              </pre>
            </div>
          </Card>
        </TabsContent>

        {/* Blockchain */}
        <TabsContent value="blockchain">
          <div className="space-y-6">
            {/* Wallet */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Wallet Operations</h2>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() =>
                    ToastService.walletConnected(
                      "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1"
                    )
                  }
                >
                  Wallet Connected
                </Button>

                <Button onClick={() => ToastService.walletDisconnected()}>
                  Wallet Disconnected
                </Button>
              </div>
            </Card>

            {/* Transactions */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Transaction Notifications
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => {
                    const txHash =
                      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
                    const id = ToastService.transactionPending(txHash);

                    // Simulate transaction confirmation
                    setTimeout(() => {
                      ToastService.dismiss(id);
                      ToastService.transactionSuccess(txHash);
                    }, 4000);
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Simulate Transaction"}
                </Button>

                <Button
                  onClick={() =>
                    ToastService.transactionError(
                      "Transaction reverted: insufficient funds"
                    )
                  }
                >
                  Transaction Error
                </Button>
              </div>

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Code Example:</h3>
                <pre className="text-sm overflow-x-auto">
                  {`const tx = await contract.transfer(to, amount)
const id = ToastService.transactionPending(tx.hash)

await tx.wait()
ToastService.dismiss(id)
ToastService.transactionSuccess(tx.hash)`}
                </pre>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Utility Methods */}
        <TabsContent value="utils">
          <div className="space-y-6">
            {/* File Upload */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">File Upload</h2>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => {
                    const fileName = "document.pdf";
                    const id = ToastService.uploadProgress(fileName);

                    setTimeout(() => {
                      ToastService.dismiss(id);
                      ToastService.uploadSuccess(fileName);
                    }, 3000);
                  }}
                >
                  Upload Success
                </Button>

                <Button
                  onClick={() =>
                    ToastService.uploadError("image.jpg", "File size too large")
                  }
                >
                  Upload Error
                </Button>
              </div>
            </Card>

            {/* Copy to Clipboard */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Copy to Clipboard</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1"
                    readOnly
                    className="flex-1 px-3 py-2 border rounded"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1"
                      );
                      ToastService.copied("Address");
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </Card>

            {/* Dismiss Controls */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Dismiss Controls</h2>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => {
                    ToastService.success("Toast 1");
                    ToastService.info("Toast 2");
                    ToastService.warning("Toast 3");
                  }}
                >
                  Show Multiple Toasts
                </Button>

                <Button onClick={() => ToastService.dismissAll()}>
                  Dismiss All Toasts
                </Button>

                <Button
                  onClick={() => {
                    const id = ToastService.loading(
                      "This will dismiss in 2 seconds"
                    );
                    setTimeout(() => ToastService.dismiss(id), 2000);
                  }}
                >
                  Dismiss Specific Toast
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Documentation Link */}
      <Card className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <h3 className="text-xl font-semibold mb-2">📚 Full Documentation</h3>
        <p className="text-muted-foreground mb-4">
          Check out the complete documentation for advanced usage, API
          reference, and best practices.
        </p>
        <a
          href="https://github.com/your-org/chainivo-blockchain/tree/main/src/services"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          View Documentation →
        </a>
      </Card>
    </div>
  );
}
