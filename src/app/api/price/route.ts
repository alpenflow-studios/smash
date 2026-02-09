import { NextResponse } from 'next/server';
import { ETH_USD_FALLBACK_PRICE } from '@/lib/constants';

type CoinbaseResponse = {
  data: {
    amount: string;
    base: string;
    currency: string;
  };
};

export async function GET() {
  try {
    const response = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/spot', {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Coinbase API error: ${response.status}`);
    }

    const data: CoinbaseResponse = await response.json();
    const price = parseFloat(data.data.amount);

    if (isNaN(price) || price <= 0) {
      throw new Error('Invalid price data');
    }

    return NextResponse.json({
      price,
      source: 'coinbase',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Price fetch error:', error);

    // Return fallback price on error
    return NextResponse.json({
      price: ETH_USD_FALLBACK_PRICE,
      source: 'fallback',
      timestamp: Date.now(),
    });
  }
}
