import { NextResponse } from 'next/server';
import { config } from '@/api/config';

export async function GET() {
  return NextResponse.json({
    message: 'Environment Variables Test',
    config: {
      ENVIRONMENT: config.ENVIRONMENT,
      API_BASE_URL: config.API_BASE_URL,
      FRONTEND_BASE_URL: config.FRONTEND_BASE_URL,
      BLOCKCHAIN: config.BLOCKCHAIN,
      WALLET_ADDRESSES: config.WALLET_ADDRESSES,
      DEFAULTS: config.DEFAULTS,
    },
    rawEnv: {
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
      NEXT_PUBLIC_BLOCKCHAIN_NETWORK: process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK,
      NEXT_PUBLIC_BLOCKCHAIN_CHAIN_ID: process.env.NEXT_PUBLIC_BLOCKCHAIN_CHAIN_ID,
      allNextPublicKeys: Object.keys(process.env)
        .filter(k => k.startsWith('NEXT_PUBLIC_'))
        .sort(),
    },
  }, { status: 200 });
}
