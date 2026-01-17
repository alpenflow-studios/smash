import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { ethers } from 'ethers';

export class WalletService {
  private sdk: CoinbaseWalletSDK;
  private provider: ethers.BrowserProvider | null;
  private ethereum: any;

  constructor() {
    this.sdk = new CoinbaseWalletSDK({
      appName: 'Base Smart Wallet Demo',
      appLogoUrl: 'https://base.org/logo.png'
    });
    this.provider = null;
  }

  async connect() {
    try {
      this.ethereum = this.sdk.makeWeb3Provider();
      const accounts = await this.ethereum.request({ method: 'eth_requestAccounts' });
      this.provider = new ethers.BrowserProvider(this.ethereum);
      return accounts[0];
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.ethereum) {
      await this.ethereum.disconnect();
    }
  }

  async getBalance(address: string) {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  async sendTransaction(to: string, amount: string) {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }
    const signer = await this.provider.getSigner();
    const tx = await signer.sendTransaction({
      to,
      value: ethers.parseEther(amount)
    });
    return tx;
  }
}

// Export a singleton instance
export const walletService = new WalletService();
