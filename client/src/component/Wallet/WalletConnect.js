import React, { useState, useEffect } from "react";
import "../Navbar/Navbar.css";

const WalletConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [userAccount, setUserAccount] = useState('');
  const [ethBalance, setEthBalance] = useState(0);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ 
          method: "eth_requestAccounts" 
        });
        setIsConnected(true);
        setUserAccount(accounts[0]);
        getAccountBalance(accounts[0]);
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          setUserAccount(accounts[0]);
          getAccountBalance(accounts[0]);
        });
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      alert("Please install MetaMask to use this feature!");
    }
  };

  const getAccountBalance = async (account) => {
    try {
      const balance = await window.ethereum.request({ 
        method: "eth_getBalance", 
        params: [account, "latest"] 
      });
      // Convert hex balance to decimal and format to ETH
      const ethValue = parseInt(balance, 16) / 1e18;
      setEthBalance(parseFloat(ethValue.toFixed(4)));
    } catch (error) {
      console.error("Error getting balance", error);
    }
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Initialize if MetaMask is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ 
            method: "eth_accounts" 
          });
          if (accounts.length > 0) {
            setIsConnected(true);
            setUserAccount(accounts[0]);
            getAccountBalance(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking connection", error);
        }
      }
    };
    
    checkConnection();
  }, []);

  return (
    <div className="wallet-wrapper">
      {isConnected ? (
        <div className="wallet-info">
          <span className="wallet-dot"></span>
          <span className="wallet-address">{formatAddress(userAccount)}</span>
          <span className="wallet-divider">|</span>
          <span className="wallet-balance">{ethBalance} ETH</span>
        </div>
      ) : (
        <button 
          className="connect-button" 
          onClick={connectWallet}
          aria-label="Connect wallet"
        >
          Connect
        </button>
      )}
    </div>
  );
};

export default WalletConnect;