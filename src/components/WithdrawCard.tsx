import React from 'react';
import { Loader2, Shield, Banknote } from 'lucide-react';

interface WithdrawCardProps {
  onWithdraw: () => Promise<void>;
  isLoading: boolean;
  isOwner: boolean;
  totalBalance: string;
}

const WithdrawCard: React.FC<WithdrawCardProps> = ({
  onWithdraw,
  isLoading,
  isOwner,
  totalBalance,
}) => {
  if (!isOwner) {
    return (
      <div className="bg-gray-50 rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-300 rounded-full mb-4">
            <Shield className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-600 mb-2">Owner Only</h3>
          <p className="text-gray-500">Only the contract owner can withdraw funds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mb-4">
          <Banknote className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Withdraw Funds</h2>
        <p className="text-gray-600">Extract all collected funds from the contract</p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-6">
        <p className="text-sm font-medium text-gray-600 mb-1">Available Balance</p>
        <p className="text-2xl font-bold text-gray-800">{totalBalance} ETH</p>
      </div>

      <button
        onClick={onWithdraw}
        disabled={isLoading || totalBalance === '0.0'}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
          isLoading || totalBalance === '0.0'
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={20} />
            Withdrawing...
          </div>
        ) : (
          'Withdraw All Funds'
        )}
      </button>
    </div>
  );
};

export default WithdrawCard;