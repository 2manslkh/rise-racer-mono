"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ethers } from "ethers";
import { riseTestnet } from "../configuration/wagmi";

export const MINIMUM_GAS = 100000000000000n;

interface HotWalletContextProps {
  hotWallet: ethers.Wallet | null;
  balance: bigint;
  address: string | null;
  isLoading: boolean;
  loadHotWallet: (args: {
    address: string;
    message: string;
    signature: string;
  }) => Promise<void>;
  disconnectHotWallet: () => void;
  updateBalance: (_balance: bigint) => void;
}

const HotWalletContext = createContext<HotWalletContextProps | undefined>(
  undefined
);

export const HotWalletProvider = ({ children }: { children: ReactNode }) => {
  const [hotWallet, setHotWallet] = useState<ethers.Wallet | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<bigint>(0n);

  const disconnectHotWallet = () => {
    setHotWallet(null);
    setAddress(null);
  };

  const loadHotWallet = async ({
    address,
    message,
    signature,
  }: {
    address: string;
    message: string;
    signature: string;
  }) => {
    setIsLoading(true);
    // POST request to https://xzojvcgeztikkdxqryko.supabase.co/functions/v1/hotwallet-bind
    const response = await fetch(
      "https://xzojvcgeztikkdxqryko.supabase.co/functions/v1/hotwallet-bind",
      {
        method: "POST",
        body: JSON.stringify({ address, message, signature }),
      }
    );
    const data = await response.json();
    if (data.pk && data.boundAddress) {
      const provider = new ethers.JsonRpcProvider(
        riseTestnet.rpcUrls.default.http[0]
      );
      const wallet = new ethers.Wallet(data.pk, provider);
      const balance = await provider.getBalance(data.boundAddress);
      setBalance(balance);
      setHotWallet(wallet);
      setAddress(data.boundAddress);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      throw new Error("Failed to load hot wallet");
    }
  };

  const updateBalance = (_balance: bigint) => {
    setBalance(_balance);
  };

  return (
    <HotWalletContext.Provider
      value={{
        hotWallet,
        balance,
        address,
        isLoading,
        loadHotWallet,
        disconnectHotWallet,
        updateBalance,
      }}
    >
      {children}
    </HotWalletContext.Provider>
  );
};

export const useHotWallet = () => {
  const context = useContext(HotWalletContext);
  if (context === undefined) {
    throw new Error("useHotWallet must be used within a HotWalletProvider");
  }
  return context;
};
