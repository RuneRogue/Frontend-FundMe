import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { FUNDME_ABI, FUNDME_CONTRACT_ADDRESS } from '../contracts/FundMe';

interface ContractState {
  contract: ethers.Contract | null;
  userContribution: string;
  totalBalance: string;
  isOwner: boolean;
  isLoading: boolean;
}

export const useContract = (provider: ethers.BrowserProvider | null, signer: ethers.JsonRpcSigner | null, account: string | null) => {
  const [contractState, setContractState] = useState<ContractState>({
    contract: null,
    userContribution: '0.0',
    totalBalance: '0.0',
    isOwner: false,
    isLoading: false,
  });

  const updateContractData = async (contract: ethers.Contract, userAccount: string) => {
    try {
      setContractState(prev => ({ ...prev, isLoading: true }));

      const [userContribution, totalBalance, owner] = await Promise.all([
        contract.getAddressToAmount(userAccount),
        provider?.getBalance(FUNDME_CONTRACT_ADDRESS),
        contract.getOwner(),
      ]);

      setContractState(prev => ({
        ...prev,
        userContribution: ethers.formatEther(userContribution),
        totalBalance: ethers.formatEther(totalBalance || '0'),
        isOwner: owner.toLowerCase() === userAccount.toLowerCase(),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error updating contract data:', error);
      setContractState(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    if (signer && account) {
      const contract = new ethers.Contract(FUNDME_CONTRACT_ADDRESS, FUNDME_ABI, signer);
      setContractState(prev => ({ ...prev, contract }));
      updateContractData(contract, account);
    } else {
      setContractState({
        contract: null,
        userContribution: '0.0',
        totalBalance: '0.0',
        isOwner: false,
        isLoading: false,
      });
    }
  }, [signer, account]);

  const fundContract = async (amount: string) => {
    if (!contractState.contract || !account) throw new Error('Contract not initialized');

    try {
      const tx = await contractState.contract.fund({
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      await updateContractData(contractState.contract, account);
      return tx;
    } catch (error) {
      console.error('Error funding contract:', error);
      throw error;
    }
  };

  const withdrawFunds = async () => {
    if (!contractState.contract || !account) throw new Error('Contract not initialized');

    try {
      const tx = await contractState.contract.cheaperWithdraw();
      await tx.wait();
      await updateContractData(contractState.contract, account);
      return tx;
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      throw error;
    }
  };

  const refreshData = async () => {
    if (contractState.contract && account) {
      await updateContractData(contractState.contract, account);
    }
  };

  return {
    ...contractState,
    fundContract,
    withdrawFunds,
    refreshData,
  };
};