"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useHotWallet } from "../../context/HotWalletContext";
import {
  getLockupDuration,
  getStakeInfo,
  stakeETH,
  unstakeETH,
  StakeInfo,
} from "../../lib/staking";
import { useTransactionTracker } from "@/app/hooks/useTransactionTracker";

const Staking = () => {
  const {
    hotWallet,
    address,
    balance,
    refreshBalance,
    incrementNonce,
    getNonce,
  } = useHotWallet();
  const { initiateTx, updateTx } = useTransactionTracker();

  const [stakeAmount, setStakeAmount] = useState<string>("");

  const [lockupDuration, setLockupDuration] = useState<bigint>(BigInt(0));
  const [stakeInfo, setStakeInfo] = useState<StakeInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [totalStakedEth, setTotalStakedEth] = useState<string>("0");

  // Calculate estimated crystals based on input
  const estimatedCrystals = stakeAmount ? parseFloat(stakeAmount) * 1000000 : 0;

  useEffect(() => {
    if (address) {
      fetchStakingInfo();
    }
  }, [address]);

  const fetchStakingInfo = async () => {
    try {
      if (!hotWallet) return;

      const provider = hotWallet.provider as ethers.Provider;
      const [lockupValue] = await Promise.all([getLockupDuration(provider)]);

      setLockupDuration(lockupValue);

      if (address) {
        const [stakeInfoValue] = await Promise.all([
          getStakeInfo(address, provider),
        ]);

        setStakeInfo(stakeInfoValue);
        setTotalStakedEth(ethers.formatEther(stakeInfoValue.amount));
      }
    } catch (error) {
      console.error("Failed to fetch staking info:", error);
      setErrorMessage("Failed to fetch staking information");
    }
  };

  const handleStake = async () => {
    setIsLoading(true);
    setErrorMessage("");
    let placeholderHash: string | null = null;
    try {
      if (!hotWallet || !stakeAmount) {
        setErrorMessage("Please connect wallet and enter an amount");
        setIsLoading(false);
        return;
      }

      const amountInWei = ethers.parseEther(stakeAmount);

      if (amountInWei > balance) {
        setErrorMessage("Insufficient balance");
        setIsLoading(false);
        return;
      }

      incrementNonce();
      const currentNonce = getNonce();
      const description = `Stake ETH #${currentNonce}`;
      placeholderHash = initiateTx(description);

      const txReceipt = await stakeETH(hotWallet, amountInWei, currentNonce);

      // Update the optimistic transaction with the receipt and callbacks
      if (placeholderHash) {
        updateTx(placeholderHash, txReceipt);
        placeholderHash = null;
      }

      refreshBalance();
      await fetchStakingInfo();
      setStakeAmount("");
    } catch (error) {
      console.error("Staking failed:", error);
      setErrorMessage("Staking failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnstake = async () => {
    setIsLoading(true);
    setErrorMessage("");
    let placeholderHash: string | null = null;

    try {
      if (!hotWallet) {
        setErrorMessage("Please connect wallet");
        setIsLoading(false);
        return;
      }

      if (!stakeInfo || stakeInfo.amount === BigInt(0)) {
        setErrorMessage("You don't have any active stakes");
        setIsLoading(false);
        return;
      }

      // Check if lock period has ended
      const currentTime = BigInt(Math.floor(Date.now() / 1000));
      if (currentTime < stakeInfo.lockEndTime) {
        setErrorMessage(
          `Lockup period ends in ${formatTimeRemaining(stakeInfo.lockEndTime - currentTime)}`
        );
        setIsLoading(false);
        return;
      }

      incrementNonce();
      const currentNonce = getNonce();
      const description = `Stake ETH #${currentNonce}`;
      placeholderHash = initiateTx(description);

      const txReceipt = await unstakeETH(hotWallet, currentNonce);

      // Update the optimistic transaction with the receipt and callbacks
      if (placeholderHash) {
        updateTx(placeholderHash, txReceipt);
        placeholderHash = null;
      }

      refreshBalance();
      await fetchStakingInfo();
    } catch (error) {
      console.error("Unstaking failed:", error);
      setErrorMessage("Unstaking failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeRemaining = (seconds: bigint): string => {
    const days = seconds / BigInt(86400);
    const hours = (seconds % BigInt(86400)) / BigInt(3600);
    const minutes = (seconds % BigInt(3600)) / BigInt(60);

    return `${days.toString()}d ${hours.toString()}h ${minutes.toString()}m`;
  };

  return (
    <div className="bg-[#2A004F] w-full h-full flex flex-col p-3">
      <div className="text-white text-center mb-3">
        <p
          className="font-zen text-[26px] relative"
          style={{
            WebkitTextStroke: "1.5px #74007E",
          }}
        >
          STAKING
        </p>
        <div className="relative w-full bg-purple-900/30 border border-purple-800/50 rounded-lg py-2 px-3 mt-2 inline-block">
          <p className="text-sm font-medium">1 ETH = 1,000,000 Rise Crystals</p>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white p-2 rounded mb-3 text-sm">
          {errorMessage}
        </div>
      )}

      <div
        className="relative flex flex-col w-full overflow-y-auto"
        style={{ height: "calc(100% - 40px - 68px - 40px - 20px)" }}
      >
        {/* Current Staking Status */}
        <div className="rounded-lg p-3 mb-3 bg-purple-900/30 border border-purple-800/50">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-white">Current Stake</h2>
            <div className="bg-purple-800 rounded-full px-3 py-1 text-xs text-white">
              {stakeInfo && stakeInfo.amount > BigInt(0)
                ? "ACTIVE"
                : "INACTIVE"}
            </div>
          </div>
          {stakeInfo && stakeInfo.amount > BigInt(0) ? (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-white text-sm opacity-70">Amount:</span>
                <span className="text-white text-sm font-medium">
                  {totalStakedEth} ETH
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-white text-sm opacity-70">
                  Unlock Date:
                </span>
                <span className="text-white text-sm font-medium">
                  {new Date(
                    Number(stakeInfo.lockEndTime) * 1000
                  ).toLocaleDateString()}
                </span>
              </div>

              <button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-2 px-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleUnstake}
                disabled={
                  isLoading ||
                  BigInt(Math.floor(Date.now() / 1000)) < stakeInfo.lockEndTime
                }
              >
                {isLoading ? "Processing..." : "Unstake ETH"}
              </button>
              {BigInt(Math.floor(Date.now() / 1000)) <
                stakeInfo.lockEndTime && (
                <p className="text-xs text-white opacity-70 mt-1 text-center">
                  Locked until{" "}
                  {new Date(
                    Number(stakeInfo.lockEndTime) * 1000
                  ).toLocaleDateString()}
                </p>
              )}
            </div>
          ) : (
            <p className="text-white text-sm opacity-70">
              No active stake. Stake ETH to earn Rise Crystals instantly.
            </p>
          )}
        </div>

        {/* Staking Form */}
        <div className="bg-purple-900/30 border border-purple-800/50 rounded-lg p-3 mb-3">
          <h2 className="text-lg font-semibold text-white mb-2">Stake ETH</h2>
          <div className="mb-3">
            <div className="flex items-center">
              <input
                type="number"
                className="w-full bg-[#2A004F] text-white p-2 rounded-l text-sm"
                placeholder="0.0"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                step="0.01"
              />
              <button
                className="bg-[#2A004F] text-purple-400 font-semibold py-2 px-3 rounded-r text-sm"
                onClick={() => setStakeAmount(ethers.formatEther(balance))}
              >
                MAX
              </button>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-white opacity-50">
                Balance: {ethers.formatEther(balance)} ETH
              </span>
              <span className="text-xs text-purple-300">
                ≈ {estimatedCrystals.toLocaleString()} Crystals
              </span>
            </div>
          </div>
          <button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-2 px-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleStake}
            disabled={isLoading || !stakeAmount || !address}
          >
            {isLoading ? "Processing..." : "Stake ETH"}
          </button>
        </div>

        {/* Staking Info */}
        <div className="bg-purple-900/30 border border-purple-800/50 rounded-lg p-3 mb-3">
          <h2 className="text-lg font-semibold text-white mb-2">
            Staking Info
          </h2>
          <div className="grid grid-cols-2 gap-2 text-white text-xs">
            {/* Conversion Rate */}
            <span className="opacity-70">Conversion Rate:</span>
            <span className="font-medium">1 ETH = 1,000,000 Rise Crystals</span>

            <span className="opacity-70">Lockup Period:</span>
            <span className="font-medium">
              {Number(lockupDuration) / 86400} days
            </span>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-purple-900/30 border border-purple-800/50 rounded-lg p-3">
          <h2 className="text-lg font-semibold text-white mb-1">
            How It Works
          </h2>
          <ul className="text-white text-xs opacity-70 list-disc pl-4 space-y-1">
            <li>Stake ETH to instantly receive Rise Crystals</li>
            <li>1 ETH = 1,000,000 Rise Crystals</li>
            <li>
              Your ETH will be locked for {Number(lockupDuration) / 86400} days
            </li>
            <li>Unstake your ETH after the lock period ends</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Staking;
