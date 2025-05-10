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
import { getPlayerInfo, PlayerInfoFull } from "../lib/rise-racer";
import { logError } from "../lib/error";
import { GetCurrentLevel } from "../lib/gameplaySettings";
import { getBalance as getRiseCrystalsBalance } from "../lib/rise-crystals";
import { useTMA } from "./TelegramContext";

export const MINIMUM_GAS = 1000000000000n;

export type User = {
  vehicle: number;
  currentLevel: number;
  currentProgress: number;
};

interface HotWalletContextProps {
  hotWallet: ethers.Wallet | null;
  balance: bigint;
  riseCrystalsBalance: bigint;
  address: string | null;
  isLoading: boolean;
  loadHotWallet: () => Promise<void>;
  refreshPlayerInfo: () => Promise<void>;
  disconnectHotWallet: () => void;
  nonce: number;
  incrementNonce: () => void;
  getNonce: () => number;
  currentVelocity: bigint | null;
  velocityPerClick: bigint | null;
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
  const [riseCrystalsBalance, setRiseCrystalsBalance] = useState<bigint>(0n);
  const [user, setUser] = useState<User>({
    vehicle: 1,
    currentLevel: 0,
    currentProgress: 0,
  });

  const { player } = useTMA();

  const disconnectHotWallet = () => {
    setHotWallet(null);
    setAddress(null);
    setCurrentVelocity(null);
    setVelocityPerClick(null);
  };

  const loadHotWallet = async () => {
    setIsLoading(true);
    const data = player;
    if (data && data.pk && data.boundAddress) {
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

      const initialNonce = await provider.getTransactionCount(wallet.address);

      // const initialNonce = await wallet.provider.getTransactionCount("pending");
      setNonce(initialNonce);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      throw new Error("Failed to load hot wallet");
    }
  };

  const refreshPlayerInfo = useCallback(async () => {
    if (address && hotWallet?.provider) {
      try {
        const player = (await getPlayerInfo(
          address,
          hotWallet.provider
        )) as PlayerInfoFull;

        setUser({
          vehicle: 1,
          currentLevel: GetCurrentLevel(Number(player.velocity)),
          currentProgress: Number(player.velocity),
        });
        setCurrentVelocity(player.velocity);
        setVelocityPerClick(player.clickPower);
        setRiseCrystalsBalance(player.riseCrystalBalance);
      } catch (error) {
        logError(error);
        console.error("Failed to refresh player info:", error);
      }
    }
  }, [address, hotWallet?.provider]);

  useEffect(() => {
    if (address) {
      refreshPlayerInfo();
    }
  }, [address, refreshPlayerInfo]);

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
        riseCrystalsBalance,
        address,
        isLoading,
        loadHotWallet,
        disconnectHotWallet,
        nonce,
        incrementNonce,
        getNonce,
        currentVelocity,
        velocityPerClick,
        refreshPlayerInfo,
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
