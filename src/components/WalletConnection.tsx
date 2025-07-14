import React from 'react';
import { Wallet, LogOut, AlertCircle } from 'lucide-react';

interface WalletConnectionProps {
  account: string | null;
  isConnected: boolean;
  isLoading: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({
  account,
  isConnected,
  isLoading,
  onConnect,
  onDisconnect,
}) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!window.ethereum) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
        <AlertCircle size={20} />
        <span className="text-sm">MetaMask not detected</span>
      </div>
    );
  }

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium">{formatAddress(account)}</span>
        </div>
        <button
          onClick={onDisconnect}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span className="text-sm">Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={isLoading}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
        isLoading
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
      }`}
    >
      <Wallet size={20} />
      {isLoading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};

export default WalletConnection;