"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { ethers } from "ethers";
import { riseTestnet } from "../configuration/wagmi";
import { getCurrentVelocity, getVelocityPerClick } from "../lib/rise-racer";
import { logError } from "../lib/error";

export const MINIMUM_GAS = 1000000000000n;

export type User = {
  vehicle: number;
  currentLevel: number;
  currentProgress: number;
};

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
  refreshBalance: () => void;
  nonce: number;
  incrementNonce: () => void;
  getNonce: () => number;
  currentVelocity: bigint | null;
  velocityPerClick: bigint | null;
  isFetchingVelocity: boolean;
  fetchVelocityData: () => Promise<void>;
  user: User;
  wsProvider: ethers.WebSocketProvider | null;
}

const HotWalletContext = createContext<HotWalletContextProps | undefined>(
  undefined
);

export const HotWalletProvider = ({ children }: { children: ReactNode }) => {
  const [hotWallet, setHotWallet] = useState<ethers.Wallet | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<bigint>(0n);
  const [nonce, setNonce] = useState<number>(0);
  const [currentVelocity, setCurrentVelocity] = useState<bigint | null>(null);
  const [velocityPerClick, setVelocityPerClick] = useState<bigint | null>(null);
  const [wsProvider, setWsProvider] = useState<ethers.WebSocketProvider | null>(
    null
  );
  const [isFetchingVelocity, setIsFetchingVelocity] = useState(false);
  const [user, setUser] = useState<User>({
    vehicle: 1,
    currentLevel: 1,
    currentProgress: 5,
  });

  const disconnectHotWallet = () => {
    setHotWallet(null);
    setAddress(null);
    setCurrentVelocity(null);
    setVelocityPerClick(null);
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
      const wsProvider = new ethers.WebSocketProvider(
        riseTestnet.rpcUrls.default.webSocket[0]
      );
      const wallet = new ethers.Wallet(data.pk, provider);
      const balance = await provider.getBalance(data.boundAddress);
      setBalance(balance);
      setHotWallet(wallet);
      setWsProvider(wsProvider);
      setAddress(data.boundAddress);

      const initialNonce = await wallet.getNonce("pending");
      console.log("🚀 | HotWalletProvider | initialNonce:", initialNonce);
      setNonce(initialNonce);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      throw new Error("Failed to load hot wallet");
    }
  };

  const refreshBalance = async () => {
    if (address && hotWallet?.provider) {
      try {
        const currentBalance = await hotWallet.provider.getBalance(address);
        setBalance(currentBalance);
      } catch (error) {
        logError(error);
        console.error("Failed to refresh balance:", error);
      }
    }
  };

  const fetchVelocityData = useCallback(async () => {
    if (address && hotWallet?.provider) {
      setIsFetchingVelocity(true);
      try {
        const [fetchedVelocity, fetchedVpc] = await Promise.all([
          getCurrentVelocity(address, hotWallet.provider),
          getVelocityPerClick(address, hotWallet.provider),
        ]);

        setUser({
          vehicle: 1,
          currentLevel: 1,
          currentProgress: Number(fetchedVelocity),
        });
        setCurrentVelocity(fetchedVelocity);
        setVelocityPerClick(fetchedVpc);
      } catch (error) {
        logError(error);
        console.error("Failed to fetch velocity data:", error);
        setCurrentVelocity(null);
        setVelocityPerClick(null);
      } finally {
        setIsFetchingVelocity(false);
      }
    } else {
      setCurrentVelocity(null);
      setVelocityPerClick(null);
    }
  }, [address, hotWallet?.provider]);

  useEffect(() => {
    if (address) {
      refreshBalance();
      fetchVelocityData();
    }
  }, [address, fetchVelocityData]);

  const incrementNonce = () => {
    setNonce((prevNonce) => prevNonce + 1);
  };

  const getNonce = () => {
    return nonce;
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
        refreshBalance,
        nonce,
        incrementNonce,
        getNonce,
        currentVelocity,
        velocityPerClick,
        isFetchingVelocity,
        fetchVelocityData,
        user,
        wsProvider,
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
