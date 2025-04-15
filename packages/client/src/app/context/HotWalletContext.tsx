"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { ethers } from "ethers";

interface HotWalletContextProps {
  hotWallet: ethers.Wallet | null;
  address: string | null;
  isLoading: boolean;
  loadHotWallet: (args: { address: string, message: string, signature: string }) => Promise<void>;
  disconnectHotWallet: () => void;
}

const HotWalletContext = createContext<HotWalletContextProps | undefined>(
  undefined
);

export const HotWalletProvider = ({ children }: { children: ReactNode }) => {
  const [hotWallet, setHotWallet] = useState<ethers.Wallet | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const disconnectHotWallet = () => {
    setHotWallet(null);
    setAddress(null);
  }

  const loadHotWallet = async (
    {
      address,
      message,
      signature
    }: any) => {
    setIsLoading(true);
    // POST request to https://xzojvcgeztikkdxqryko.supabase.co/functions/v1/hotwallet-bind
    const response = await fetch("https://xzojvcgeztikkdxqryko.supabase.co/functions/v1/hotwallet-bind", {
      method: "POST",
      body: JSON.stringify({ address, message, signature }),
    });
    const data = await response.json();
    if (data.pk && data.boundAddress) {
      const wallet = new ethers.Wallet(data.pk);
      setHotWallet(wallet);
      setAddress(data.boundAddress);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      throw new Error("Failed to load hot wallet");
    }
  };

  return (
    <HotWalletContext.Provider
      value={{ hotWallet, address, isLoading, loadHotWallet, disconnectHotWallet }}
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
