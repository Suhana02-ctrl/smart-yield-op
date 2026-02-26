/**
 * WalletConnect Component
 * Manages MetaMask wallet connection using ethers.js
 */

import React, { useState } from 'react';
import { BrowserProvider } from 'ethers';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

export default function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Connect to MetaMask wallet
   */
  const connectWallet = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install it to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please try again.');
      }

      const userAddress = accounts[0];

      // Verify with ethers.js provider (optional, for future use)
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const connectedAddress = await signer.getAddress();

      setAccount(userAddress);
      onConnect(userAddress);

      console.log('✓ Wallet connected:', userAddress);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Wallet connection error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Disconnect wallet
   */
  const disconnectWallet = () => {
    setAccount(null);
    setError(null);
    onDisconnect();
    console.log('✓ Wallet disconnected');
  };

  /**
   * Format address to shortened version (0x1234...abcd)
   */
  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="wallet-connect-container">
      {!account ? (
        <div className="wallet-connect-idle">
          <button
            onClick={connectWallet}
            disabled={isLoading}
            className="btn-connect-wallet"
          >
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </button>

          {error && <div className="wallet-error">{error}</div>}
        </div>
      ) : (
        <div className="wallet-connect-active">
          <div className="wallet-address">
            <span className="wallet-label">Connected:</span>
            <span className="wallet-value">{formatAddress(account)}</span>
          </div>

          <button onClick={disconnectWallet} className="btn-disconnect-wallet">
            Disconnect
          </button>
        </div>
      )}

      <style jsx>{`
        .wallet-connect-container {
          padding: 16px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: #f9f9f9;
        }

        .wallet-connect-idle,
        .wallet-connect-active {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .wallet-connect-active {
          justify-content: space-between;
          background: #f0f9ff;
          border: 1px solid #bfdbfe;
          padding: 12px;
          border-radius: 6px;
        }

        .wallet-address {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .wallet-label {
          font-size: 12px;
          color: #666;
          font-weight: 500;
          text-transform: uppercase;
        }

        .wallet-value {
          font-size: 14px;
          font-weight: 600;
          font-family: 'Courier New', monospace;
          color: #1e40af;
        }

        .btn-connect-wallet,
        .btn-disconnect-wallet {
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-connect-wallet {
          background: #3b82f6;
          color: white;
        }

        .btn-connect-wallet:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .btn-connect-wallet:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-disconnect-wallet {
          background: #ef4444;
          color: white;
          padding: 8px 12px;
          font-size: 12px;
        }

        .btn-disconnect-wallet:hover {
          background: #dc2626;
        }

        .wallet-error {
          color: #dc2626;
          font-size: 13px;
          padding: 8px;
          background: #fee2e2;
          border-radius: 4px;
          border-left: 3px solid #dc2626;
        }
      `}</style>
    </div>
  );
}

// Extend window interface for ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on?: (event: string, callback: (...args: any[]) => void) => void;
      removeListener?: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}
