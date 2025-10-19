'use client'

/**
 * API Demo Page
 * Demonstrates how to use the Axios API services
 */

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  authService, 
  walletService, 
  investmentService,
  nftService,
  missionService,
  notificationService,
  blockchainService,
  tokenManager
} from '@/api'
import type { 
  LoginRequest,
  SendTransactionRequest,
  CreateInvestmentRequest 
} from '@/api'

export default function ApiDemoPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleApiCall = async (
    name: string,
    apiCall: () => Promise<any>
  ) => {
    setLoading(true)
    setError(null)
    setResult('')
    
    try {
      console.log(`🚀 Calling ${name}...`)
      const response = await apiCall()
      setResult(JSON.stringify(response, null, 2))
      console.log(`✅ ${name} Success:`, response)
    } catch (err: any) {
      const errorMessage = err?.error?.message || err.message || 'Unknown error'
      setError(errorMessage)
      console.error(`❌ ${name} Error:`, err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">API Demo</h1>
        <p className="text-muted-foreground">
          Test all Axios API services - Note: These will fail without a real backend
        </p>
      </div>

      {/* Authentication Token Status */}
      <Card className="p-6 mb-6 bg-muted">
        <h2 className="text-xl font-bold mb-3">🔐 Authentication Status</h2>
        <div className="space-y-2">
          <p>
            <strong>Access Token:</strong>{' '}
            {tokenManager.getAccessToken() ? (
              <span className="text-green-600">✓ Present</span>
            ) : (
              <span className="text-red-600">✗ Not found</span>
            )}
          </p>
          <p>
            <strong>Refresh Token:</strong>{' '}
            {tokenManager.getRefreshToken() ? (
              <span className="text-green-600">✓ Present</span>
            ) : (
              <span className="text-red-600">✗ Not found</span>
            )}
          </p>
          <Button
            onClick={() => {
              tokenManager.clearTokens()
              window.location.reload()
            }}
            variant="outline"
            size="sm"
          >
            Clear Tokens
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auth Service */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">🔑 Auth Service</h2>
          <div className="space-y-2">
            <Button
              onClick={() => handleApiCall('Login', () => 
                authService.login({
                  email: 'demo@chainivo.com',
                  password: 'demo123'
                } as LoginRequest)
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Login (Demo User)
            </Button>
            <Button
              onClick={() => handleApiCall('Register', () =>
                authService.register({
                  email: 'newuser@chainivo.com',
                  username: 'newuser',
                  password: 'password123'
                })
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Register New User
            </Button>
            <Button
              onClick={() => handleApiCall('Get Profile', () =>
                authService.getProfile()
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Get Profile
            </Button>
            <Button
              onClick={() => handleApiCall('Logout', () =>
                authService.logout()
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Logout
            </Button>
          </div>
        </Card>

        {/* Wallet Service */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">💰 Wallet Service</h2>
          <div className="space-y-2">
            <Button
              onClick={() => handleApiCall('Get Balance', () =>
                walletService.getBalance()
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Get Balance
            </Button>
            <Button
              onClick={() => handleApiCall('Get Transactions', () =>
                walletService.getTransactions({ page: 1, limit: 10 })
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Get Transactions
            </Button>
            <Button
              onClick={() => handleApiCall('Send Transaction', () =>
                walletService.sendTransaction({
                  to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
                  amount: '1.5',
                  currency: 'CHAIN',
                  memo: 'Test transaction'
                } as SendTransactionRequest)
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Send Transaction
            </Button>
            <Button
              onClick={() => handleApiCall('Generate Address', () =>
                walletService.generateAddress('CHAIN')
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Generate Address
            </Button>
          </div>
        </Card>

        {/* Investment Service */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">📈 Investment Service</h2>
          <div className="space-y-2">
            <Button
              onClick={() => handleApiCall('Get Portfolio', () =>
                investmentService.getPortfolio()
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Get Portfolio
            </Button>
            <Button
              onClick={() => handleApiCall('Get Investments', () =>
                investmentService.getInvestments()
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Get All Investments
            </Button>
            <Button
              onClick={() => handleApiCall('Create Investment', () =>
                investmentService.createInvestment({
                  name: 'Bitcoin',
                  type: 'crypto',
                  amount: '1000',
                  currency: 'USD'
                } as CreateInvestmentRequest)
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Create Investment
            </Button>
            <Button
              onClick={() => handleApiCall('Get Performance', () =>
                investmentService.getPerformance({ period: 'month' })
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Get Performance
            </Button>
          </div>
        </Card>

        {/* NFT Service */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">🎨 NFT Service</h2>
          <div className="space-y-2">
            <Button
              onClick={() => handleApiCall('Browse NFTs', () =>
                nftService.getAllNFTs({ page: 1, limit: 20, sortBy: 'price' })
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Browse Marketplace
            </Button>
            <Button
              onClick={() => handleApiCall('Get My NFTs', () =>
                nftService.getUserNFTs()
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              My Collection
            </Button>
            <Button
              onClick={() => handleApiCall('Get NFT Detail', () =>
                nftService.getNFTDetail('nft-123')
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              NFT Details
            </Button>
            <Button
              onClick={() => handleApiCall('Buy NFT', () =>
                nftService.buyNFT('nft-123', { paymentMethod: 'wallet' })
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Buy NFT
            </Button>
          </div>
        </Card>

        {/* Mission Service */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">🎯 Mission Service</h2>
          <div className="space-y-2">
            <Button
              onClick={() => handleApiCall('Get Missions', () =>
                missionService.getAllMissions()
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Get All Missions
            </Button>
            <Button
              onClick={() => handleApiCall('Get Active Missions', () =>
                missionService.getActiveMissions()
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Active Missions
            </Button>
            <Button
              onClick={() => handleApiCall('Start Mission', () =>
                missionService.startMission('mission-123')
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Start Mission
            </Button>
            <Button
              onClick={() => handleApiCall('Get Daily Streak', () =>
                missionService.getDailyStreak()
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Daily Streak
            </Button>
          </div>
        </Card>

        {/* Notification Service */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">🔔 Notification Service</h2>
          <div className="space-y-2">
            <Button
              onClick={() => handleApiCall('Get Notifications', () =>
                notificationService.getAllNotifications({ page: 1, limit: 10 })
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Get Notifications
            </Button>
            <Button
              onClick={() => handleApiCall('Get Unread Count', () =>
                notificationService.getUnreadCount()
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Unread Count
            </Button>
            <Button
              onClick={() => handleApiCall('Mark as Read', () =>
                notificationService.markAsRead('notif-123')
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Mark as Read
            </Button>
            <Button
              onClick={() => handleApiCall('Mark All Read', () =>
                notificationService.markAllAsRead()
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Mark All Read
            </Button>
          </div>
        </Card>

        {/* Blockchain Service */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">⛓️ Blockchain Service</h2>
          <div className="space-y-2">
            <Button
              onClick={() => handleApiCall('Get Latest Blocks', () =>
                blockchainService.getLatestBlocks(10)
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Latest Blocks
            </Button>
            <Button
              onClick={() => handleApiCall('Get Block', () =>
                blockchainService.getBlock('12345')
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Get Block
            </Button>
            <Button
              onClick={() => handleApiCall('Get Network Stats', () =>
                blockchainService.getNetworkStats()
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Network Stats
            </Button>
            <Button
              onClick={() => handleApiCall('Get Gas Price', () =>
                blockchainService.getGasPrice()
              )}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              Gas Price
            </Button>
          </div>
        </Card>
      </div>

      {/* Result Display */}
      {(result || error) && (
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">
            {error ? '❌ Error' : '✅ Result'}
          </h2>
          <pre className={`p-4 rounded-lg overflow-auto max-h-96 ${
            error ? 'bg-red-100 text-red-900' : 'bg-muted'
          }`}>
            {error || result}
          </pre>
        </Card>
      )}

      {/* Loading Indicator */}
      {loading && (
        <Card className="p-6 mt-6 text-center">
          <p className="text-lg">🔄 Loading...</p>
        </Card>
      )}

      {/* Usage Instructions */}
      <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
        <h2 className="text-xl font-bold mb-4">📚 Usage Instructions</h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Note:</strong> All API calls will fail without a real backend server running.
          </p>
          <p>
            1. Set up your backend API server
          </p>
          <p>
            2. Update <code className="bg-white px-2 py-1 rounded">NEXT_PUBLIC_API_BASE_URL</code> in your <code className="bg-white px-2 py-1 rounded">.env.local</code>
          </p>
          <p>
            3. Open browser console (F12) to see detailed API logs
          </p>
          <p>
            4. Check the <code className="bg-white px-2 py-1 rounded">src/api/README.md</code> for complete documentation
          </p>
        </div>
      </Card>
    </div>
  )
}

