import { ethers } from 'ethers';

const connectToMetaMask = async () => {
  if (!window.ethereum) {
    throw new Error('Please install MetaMask!');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);

  if (accounts.length > 0) {
    return accounts[0];
  } else {
    throw new Error('No accounts found');
  }
};

export default connectToMetaMask;