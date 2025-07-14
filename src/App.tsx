import React, { useState, useEffect } from 'react';
import { Target, RefreshCw } from 'lucide-react';
import { useWallet } from './hooks/useWallet';
import { useContract } from './hooks/useContract';
import WalletConnection from './components/WalletConnection';
import FundingCard from './components/FundingCard';
import WithdrawCard from './components/WithdrawCard';
import StatusMessage from './components/StatusMessage';

interface StatusMessage {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

function App() {
  const { account, provider, signer, isConnected, isLoading: walletLoading, connectWallet, disconnectWallet } = useWallet();
  const { userContribution, totalBalance, isOwner, isLoading: contractLoading, fundContract, withdrawFunds, refreshData } = useContract(provider, signer, account);
  
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);

  const addStatusMessage = (type: StatusMessage['type'], message: string) => {
    const id = Date.now();
    setStatusMessages(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setStatusMessages(prev => prev.filter(msg => msg.id !== id));
    }, 5000);
  };

  const removeStatusMessage = (id: number) => {
    setStatusMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const handleFund = async (amount: string) => {
    try {
      setIsTransactionLoading(true);
      addStatusMessage('info', 'Processing your funding transaction...');
      await fundContract(amount);
      addStatusMessage('success', `Successfully funded ${amount} ETH!`);
    } catch (error: any) {
      console.error('Funding error:', error);
      let errorMessage = 'Transaction failed. Please try again.';
      
      if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled by user.';
      } else if (error.message.includes('Minimum USD')) {
        errorMessage = 'Minimum funding amount is $5 USD worth of ETH.';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient ETH balance in your wallet.';
      }
      
      addStatusMessage('error', errorMessage);
    } finally {
      setIsTransactionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setIsTransactionLoading(true);
      addStatusMessage('info', 'Processing withdrawal transaction...');
      await withdrawFunds();
      addStatusMessage('success', 'Successfully withdrew all funds!');
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      let errorMessage = 'Withdrawal failed. Please try again.';
      
      if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was cancelled by user.';
      } else if (error.message.includes('NotOwner')) {
        errorMessage = 'Only the contract owner can withdraw funds.';
      } else if (error.message.includes('Insufficient Balance')) {
        errorMessage = 'No funds available to withdraw.';
      }
      
      addStatusMessage('error', errorMessage);
    } finally {
      setIsTransactionLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      addStatusMessage('info', 'Refreshing contract data...');
      await refreshData();
      addStatusMessage('success', 'Data refreshed successfully!');
    } catch (error) {
      addStatusMessage('error', 'Failed to refresh data. Please try again.');
    }
  };

  useEffect(() => {
    if (account) {
      addStatusMessage('success', `Wallet connected: ${account.slice(0, 6)}...${account.slice(-4)}`);
    }
  }, [account]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Status Messages */}
      {statusMessages.map(msg => (
        <StatusMessage
          key={msg.id}
          type={msg.type}
          message={msg.message}
          onClose={() => removeStatusMessage(msg.id)}
        />
      ))}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CrowdFund Pro
                </h1>
                <p className="text-sm text-gray-600">Decentralized Crowdfunding Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {isConnected && (
                <button
                  onClick={handleRefresh}
                  disabled={contractLoading}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${contractLoading ? 'animate-spin' : ''}`} />
                  <span className="text-sm">Refresh</span>
                </button>
              )}
              
              <WalletConnection
                account={account}
                isConnected={isConnected}
                isLoading={walletLoading}
                onConnect={connectWallet}
                onDisconnect={disconnectWallet}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
                <Target className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome to CrowdFund Pro
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                A decentralized crowdfunding platform built on Ethereum Sepolia. Connect your wallet to start funding projects or withdraw your contributions.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Get Started</h3>
              <p className="text-gray-600 mb-6">
                Connect your MetaMask wallet to interact with the smart contract
              </p>
              <div className="flex justify-center">
                <WalletConnection
                  account={account}
                  isConnected={isConnected}
                  isLoading={walletLoading}
                  onConnect={connectWallet}
                  onDisconnect={disconnectWallet}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Project Info */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Innovative Tech Project
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Help us build the future with cutting-edge technology solutions. 
                  Your contribution will support research, development, and deployment of innovative features.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Contract Address</h3>
                  <p className="text-sm text-gray-600 font-mono break-all">
                    0x24DD76c70ead13ef9c3482A1920c96f2242dad33
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Minimum Funding</h3>
                  <p className="text-sm text-gray-600">$5 USD worth of ETH</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Network</h3>
                  <p className="text-sm text-gray-600">Ethereum Sepolia</p>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid lg:grid-cols-2 gap-8">
              <FundingCard
                onFund={handleFund}
                isLoading={isTransactionLoading}
                userContribution={userContribution}
                totalBalance={totalBalance}
              />
              
              <WithdrawCard
                onWithdraw={handleWithdraw}
                isLoading={isTransactionLoading}
                isOwner={isOwner}
                totalBalance={totalBalance}
              />
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">How It Works</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Connect Wallet</h4>
                  <p className="text-gray-600">Connect your MetaMask wallet to interact with the smart contract</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Fund Project</h4>
                  <p className="text-gray-600">Send ETH to support the project with a minimum of $5 USD</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">3</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Track Progress</h4>
                  <p className="text-gray-600">Monitor your contributions and the total amount raised</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;