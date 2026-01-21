import { createPublicClient, http, type PublicClient } from 'viem';
import { activeChain } from './config';

// Public client for reading blockchain state
export const publicClient: PublicClient = createPublicClient({
  chain: activeChain,
  transport: http(),
});

// Helper to get ETH balance
export async function getEthBalance(address: `0x${string}`): Promise<bigint> {
  return publicClient.getBalance({ address });
}

// Helper to wait for transaction receipt
export async function waitForTransaction(hash: `0x${string}`) {
  return publicClient.waitForTransactionReceipt({ hash });
}

// Helper to get current block number
export async function getCurrentBlockNumber(): Promise<bigint> {
  return publicClient.getBlockNumber();
}
