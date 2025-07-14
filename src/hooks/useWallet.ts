import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletState {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  isConnected: boolean;
  isLoading: boolean;
  chainId: number | null;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    account: null,
    provider: null,
    signer: null,
    isConnected: false,
    isLoading: false,
    chainId: null,
  });

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask is required to use this app');
      return;
    }

    try {
      setWalletState(prev => ({ ...prev, isLoading: true }));

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      setWalletState({
        account: accounts[0],
        provider,
        signer,
        isConnected: true,
        isLoading: false,
        chainId: Number(network.chainId),
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setWalletState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      account: null,
      provider: null,
      signer: null,
      isConnected: false,
      isLoading: false,
      chainId: null,
    });
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== walletState.account) {
        setWalletState(prev => ({ ...prev, account: accounts[0] }));
      }
    };

    const handleChainChanged = (chainId: string) => {
      setWalletState(prev => ({ ...prev, chainId: parseInt(chainId, 16) }));
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          connectWallet();
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
  };
};