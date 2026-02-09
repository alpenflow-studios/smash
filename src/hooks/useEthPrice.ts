'use client';

import { useState, useEffect, useCallback } from 'react';
import { ETH_USD_FALLBACK_PRICE } from '@/lib/constants';

type PriceResponse = {
  price: number;
  source: 'coinbase' | 'fallback';
  timestamp: number;
};

type UseEthPriceResult = {
  price: number;
  isLoading: boolean;
  error: string | null;
  source: 'coinbase' | 'fallback';
  refetch: () => Promise<void>;
};

const REFETCH_INTERVAL_MS = 60_000; // Refetch every 60 seconds

export function useEthPrice(): UseEthPriceResult {
  const [price, setPrice] = useState<number>(ETH_USD_FALLBACK_PRICE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'coinbase' | 'fallback'>('fallback');

  const fetchPrice = useCallback(async () => {
    try {
      const response = await fetch('/api/price');

      if (!response.ok) {
        throw new Error(`Price API error: ${response.status}`);
      }

      const data: PriceResponse = await response.json();
      setPrice(data.price);
      setSource(data.source);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch ETH price:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch price');
      // Keep using current price (fallback or last known)
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrice();

    const interval = setInterval(fetchPrice, REFETCH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchPrice]);

  return {
    price,
    isLoading,
    error,
    source,
    refetch: fetchPrice,
  };
}
