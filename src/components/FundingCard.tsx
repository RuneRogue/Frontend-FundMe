import React, { useState } from 'react';
import { DollarSign, Loader2, TrendingUp } from 'lucide-react';

interface FundingCardProps {
  onFund: (amount: string) => Promise<void>;
  isLoading: boolean;
  userContribution: string;
  totalBalance: string;
}

const FundingCard: React.FC<FundingCardProps> = ({
  onFund,
  isLoading,
  userContribution,
  totalBalance,
}) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && parseFloat(amount) > 0) {
      await onFund(amount);
      setAmount('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Fund the Project</h2>
        <p className="text-gray-600">Support our crowdfunding campaign with ETH</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-600 mb-1">Your Contribution</p>
          <p className="text-xl font-bold text-gray-800">{userContribution} ETH</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-600 mb-1">Total Raised</p>
          <p className="text-xl font-bold text-gray-800">{totalBalance} ETH</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Fund (ETH)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.01"
              step="0.001"
              min="0.001"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Minimum contribution: ~$5 USD</p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !amount}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            isLoading || !amount
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={20} />
              Processing...
            </div>
          ) : (
            'Fund Project'
          )}
        </button>
      </form>
    </div>
  );
};

export default FundingCard;