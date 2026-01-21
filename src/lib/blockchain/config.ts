import { baseSepolia, base } from 'viem/chains';
import type { Chain } from 'viem';

// Environment-based chain selection
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '84532');
export const IS_TESTNET = CHAIN_ID === 84532;

// Chain configuration
export const activeChain: Chain = IS_TESTNET ? baseSepolia : base;

// Contract addresses
export const SMASH_VAULT_ADDRESS = process.env.NEXT_PUBLIC_SMASH_VAULT_ADDRESS as `0x${string}` | undefined;

// Token addresses on Base Sepolia
export const TOKEN_ADDRESSES = {
  USDC: (process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x036CbD53842c5426634e7929541eC2318f3dCF7e') as `0x${string}`,
} as const;

// Token metadata
export interface TokenInfo {
  symbol: string;
  name: string;
  address: `0x${string}` | null; // null for native ETH
  decimals: number;
  logoUrl?: string;
}

export const SUPPORTED_TOKENS: Record<string, TokenInfo> = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    address: null,
    decimals: 18,
    logoUrl: '/tokens/eth.svg',
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    address: TOKEN_ADDRESSES.USDC,
    decimals: 6,
    logoUrl: '/tokens/usdc.svg',
  },
};

// Block explorer
export const BLOCK_EXPLORER_URL = IS_TESTNET
  ? 'https://sepolia.basescan.org'
  : 'https://basescan.org';

export function getExplorerTxUrl(txHash: string): string {
  return `${BLOCK_EXPLORER_URL}/tx/${txHash}`;
}

export function getExplorerAddressUrl(address: string): string {
  return `${BLOCK_EXPLORER_URL}/address/${address}`;
}
