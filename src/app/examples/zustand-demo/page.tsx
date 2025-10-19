'use client'

import { useEffect } from 'react'
import { Button, Badge } from '@/components'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  useUserStore,
  useUser,
  useWalletStore,
  useWallet,
  useInvestmentStore,
  usePortfolioSummary,
  useMissionStore,
  useActiveMissions,
  useDailyStreak,
  useNotificationStore,
  useUnreadCount,
} from '@/stores'
import type { Investment } from '@/stores'

export default function ZustandDemo() {
  const { login, logout, isAuthenticated, isLoading: userLoading } = useUserStore()
  const user = useUser()

  const { connectWallet, disconnectWallet, sendCrypto } = useWalletStore()
  const wallet = useWallet()

  const { addInvestment, fetchInvestments } = useInvestmentStore()
  const { totalValue, totalProfitLoss, investmentCount } = usePortfolioSummary()

  const { fetchMissions, completeMission, updateProgress } = useMissionStore()
  const activeMissions = useActiveMissions()
  const dailyStreak = useDailyStreak()

  const { addNotification, markAllAsRead } = useNotificationStore()
  const unreadCount = useUnreadCount()

  // Demo: Auto-fetch missions on mount
  useEffect(() => {
    fetchMissions()
  }, [fetchMissions])

  // Demo: Login function
  const handleLogin = async () => {
    await login('demo@chainivo.com', 'password123')
    addNotification({
      type: 'success',
      title: 'Logged In',
      message: 'Successfully logged into your account',
    })
  }

  // Demo: Connect wallet
  const handleConnectWallet = async () => {
    await connectWallet('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8')
    addNotification({
      type: 'success',
      title: 'Wallet Connected',
      message: 'Your wallet has been connected successfully',
    })
  }

  // Demo: Add investment
  const handleAddInvestment = async () => {
    const newInvestment: Omit<Investment, 'id'> = {
      name: 'Bitcoin',
      symbol: 'BTC',
      amount: 1000,
      currentValue: 1050,
      profitLoss: 50,
      profitLossPercentage: 5,
      investedAt: new Date(),
    }
    await addInvestment(newInvestment)
    addNotification({
      type: 'success',
      title: 'Investment Added',
      message: 'Successfully invested in Bitcoin',
    })
  }

  // Demo: Complete mission
  const handleCompleteMission = (missionId: string) => {
    completeMission(missionId)
    addNotification({
      type: 'success',
      title: 'Mission Completed',
      message: 'You have completed a mission!',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Zustand State Management Demo
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Demonstrating Zustand v5.0.8 with TypeScript, Middleware & Best Practices
          </p>
          <Badge variant="default" className="text-sm">
            6 Stores Configured
          </Badge>
        </div>

        {/* Notification Bar */}
        {unreadCount > 0 && (
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="default">{unreadCount}</Badge>
                <span className="text-sm font-medium">Unread Notifications</span>
              </div>
              <Button size="sm" onClick={markAllAsRead}>
                Mark All as Read
              </Button>
            </CardContent>
          </Card>
        )}

        {/* User Store Demo */}
        <Card>
          <CardHeader>
            <CardTitle>1. User Store - Authentication</CardTitle>
            <CardDescription>
              Manages user authentication with persisted state and async actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isAuthenticated ? (
              <div className="space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Not logged in
                </p>
                <Button
                  onClick={handleLogin}
                  disabled={userLoading}
                >
                  {userLoading ? 'Loading...' : 'Demo Login'}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Authenticated</Badge>
                  <span className="text-sm font-medium">{user?.email}</span>
                </div>
                <Button onClick={logout} variant="outline">
                  Logout
                </Button>
              </div>
            )}
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 p-3 rounded">
              State persisted to localStorage: user-storage
            </div>
          </CardContent>
        </Card>

        {/* Wallet Store Demo */}
        <Card>
          <CardHeader>
            <CardTitle>2. Wallet Store - Crypto Wallet</CardTitle>
            <CardDescription>
              Manages wallet connection and transactions with history tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!wallet ? (
              <div className="space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  No wallet connected
                </p>
                <Button onClick={handleConnectWallet}>
                  Connect Demo Wallet
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Connected</Badge>
                    <span className="text-sm font-mono">{wallet.address.slice(0, 10)}...</span>
                  </div>
                  <div className="text-lg font-bold">
                    {wallet.balance} {wallet.currency}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={disconnectWallet} variant="outline">
                    Disconnect
                  </Button>
                  <Button
                    onClick={() => sendCrypto('0x123...', 10, 'ETH')}
                    variant="outline"
                  >
                    Send Demo Transaction
                  </Button>
                </div>
              </div>
            )}
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 p-3 rounded">
              State persisted to localStorage: wallet-storage
            </div>
          </CardContent>
        </Card>

        {/* Investment Store Demo */}
        <Card>
          <CardHeader>
            <CardTitle>3. Investment Store - Portfolio Management</CardTitle>
            <CardDescription>
              Manages investments with auto-calculated totals and profit/loss tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Total Value
                </div>
                <div className="text-2xl font-bold">${totalValue}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Profit/Loss
                </div>
                <div className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${totalProfitLoss}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Investments
                </div>
                <div className="text-2xl font-bold">{investmentCount}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddInvestment}>
                Add Demo Investment
              </Button>
              <Button onClick={fetchInvestments} variant="outline">
                Refresh Portfolio
              </Button>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 p-3 rounded">
              Auto-calculated totals • Persisted to localStorage: investment-storage
            </div>
          </CardContent>
        </Card>

        {/* Mission Store Demo */}
        <Card>
          <CardHeader>
            <CardTitle>4. Mission Store - Daily Missions</CardTitle>
            <CardDescription>
              Manages daily missions with streak tracking and reward system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Daily Streak
                </div>
                <div className="text-2xl font-bold">{dailyStreak} days</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Active Missions
                </div>
                <div className="text-2xl font-bold">{activeMissions.length}</div>
              </div>
            </div>

            {activeMissions.length > 0 && (
              <div className="space-y-2">
                {activeMissions.slice(0, 3).map((mission) => (
                  <div
                    key={mission.id}
                    className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{mission.title}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        Progress: {mission.progress}/{mission.target}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleCompleteMission(mission.id)}
                      disabled={mission.completed}
                    >
                      {mission.completed ? 'Completed' : 'Complete'}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button onClick={fetchMissions} variant="outline">
              Refresh Missions
            </Button>

            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 p-3 rounded">
              State persisted to localStorage: mission-storage
            </div>
          </CardContent>
        </Card>

        {/* Store Features */}
        <Card>
          <CardHeader>
            <CardTitle>✨ Key Features Implemented</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">✅ Middleware</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Persist (localStorage)</li>
                  <li>• DevTools (Redux integration)</li>
                  <li>• Custom logging support</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">✅ TypeScript</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Full type safety</li>
                  <li>• Interface definitions</li>
                  <li>• Typed actions & selectors</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">✅ Performance</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Optimized selectors</li>
                  <li>• Minimal re-renders</li>
                  <li>• Partial state subscription</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">✅ Best Practices</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Async action handling</li>
                  <li>• Error state management</li>
                  <li>• Loading states</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-600 dark:text-slate-400">
          <p>Zustand v5.0.8 • Next.js 15 App Router • TypeScript 5</p>
          <p className="mt-2">
            Open Redux DevTools to inspect store state and actions
          </p>
        </div>
      </div>
    </div>
  )
}

