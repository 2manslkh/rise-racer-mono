"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ethers } from "ethers";

const HOT_WALLET_PRIVATE_KEY_STORAGE_KEY = "hotWalletPrivateKey";

interface HotWalletContextProps {
  hotWallet: ethers.Wallet | null;
  address: string | null;
  isLoading: boolean;
  createHotWallet: () => ethers.Wallet | null;
  loadHotWallet: () => void;
}

const HotWalletContext = createContext<HotWalletContextProps | undefined>(
  undefined
);

export const HotWalletProvider = ({ children }: { children: ReactNode }) => {
  const [hotWallet, setHotWallet] = useState<ethers.Wallet | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadHotWallet = () => {
    setIsLoading(true);
    const storedPrivateKey = localStorage.getItem(
      HOT_WALLET_PRIVATE_KEY_STORAGE_KEY
    );
    if (storedPrivateKey) {
      try {
        const wallet = new ethers.Wallet(storedPrivateKey);
        setHotWallet(wallet);
        setAddress(wallet.address);
        console.log("Hot wallet loaded from storage.");
      } catch (error) {
        console.error("Error loading hot wallet from storage:", error);
        localStorage.removeItem(HOT_WALLET_PRIVATE_KEY_STORAGE_KEY);
        setHotWallet(null);
        setAddress(null);
      }
    } else {
      setHotWallet(null);
      setAddress(null);
    }
    setIsLoading(false);
  };

  const createHotWallet = (): ethers.Wallet | null => {
    setIsLoading(true);
    try {
      const randomWallet = ethers.Wallet.createRandom();
      const newWallet = new ethers.Wallet(randomWallet.privateKey);

      localStorage.setItem(
        HOT_WALLET_PRIVATE_KEY_STORAGE_KEY,
        newWallet.privateKey
      );
      setHotWallet(newWallet);
      setAddress(newWallet.address);
      console.log("New hot wallet created and saved to local storage.");
      setIsLoading(false);
      return newWallet;
    } catch (error) {
      console.error("Error creating hot wallet:", error);
      setHotWallet(null);
      setAddress(null);
      setIsLoading(false);
      return null;
    }
  };

  useEffect(() => {
    // Load wallet on initial mount
    loadHotWallet();
  }, []);

  return (
    <HotWalletContext.Provider
      value={{ hotWallet, address, isLoading, createHotWallet, loadHotWallet }}
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
