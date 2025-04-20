"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useHotWallet } from "../../context/HotWalletContext";
import {
  getBalance,
  getSymbol,
  getDecimals,
  transfer,
} from "../../lib/rise-crystals";

const RiseCrystals = () => {
  const { hotWallet, address } = useHotWallet();

  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [formattedBalance, setFormattedBalance] = useState<string>("0");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [recentTransactions, setRecentTransactions] = useState<
    Array<{
      hash: string;
      amount: string;
      recipient: string;
      timestamp: number;
    }>
  >([]);

  useEffect(() => {
    if (address) {
      fetchTokenInfo();
    }
  }, [address]);

  const fetchTokenInfo = async () => {
    try {
      if (!hotWallet) return;

      const provider = hotWallet.provider as ethers.Provider;

      // Get token information in separate calls to avoid unused variable warning
      const symbol = await getSymbol(provider);
      const decimals = await getDecimals(provider);
      const balanceValue = address
        ? await getBalance(address, provider)
        : BigInt(0);

      setTokenSymbol(symbol);
      setTokenDecimals(decimals);
      setBalance(balanceValue);
      setFormattedBalance(ethers.formatUnits(balanceValue, decimals));

      // Try to load recent transactions from local storage
      try {
        const storedTxs = localStorage.getItem(`riseCrystals_txs_${address}`);
        if (storedTxs) {
          setRecentTransactions(JSON.parse(storedTxs));
        }
      } catch (error) {
        console.error("Failed to load transactions from storage:", error);
      }
    } catch (error) {
      console.error("Failed to fetch token info:", error);
      setErrorMessage("Failed to fetch token information");
    }
  };

  const handleTransfer = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (!hotWallet || !recipientAddress) {
        setErrorMessage("Please connect wallet and enter a recipient address");
        setIsLoading(false);
        return;
      }

      if (!ethers.isAddress(recipientAddress)) {
        setErrorMessage("Invalid recipient address");
        setIsLoading(false);
        return;
      }

      if (!transferAmount || parseFloat(transferAmount) <= 0) {
        setErrorMessage("Please enter a valid amount");
        setIsLoading(false);
        return;
      }

      const amountInWei = ethers.parseUnits(transferAmount, tokenDecimals);

      if (amountInWei > balance) {
        setErrorMessage("Insufficient balance");
        setIsLoading(false);
        return;
      }

      const tx = await transfer(hotWallet, recipientAddress, amountInWei);
      const receipt = await tx.wait();

      if (receipt) {
        // Save transaction to recent transactions
        const newTx = {
          hash: tx.hash,
          amount: transferAmount,
          recipient: recipientAddress,
          timestamp: Date.now(),
        };

        const updatedTxs = [newTx, ...recentTransactions.slice(0, 4)];
        setRecentTransactions(updatedTxs);

        // Store in local storage
        try {
          localStorage.setItem(
            `riseCrystals_txs_${address}`,
            JSON.stringify(updatedTxs)
          );
        } catch (error) {
          console.error("Failed to store transaction:", error);
        }

        setSuccessMessage(`Successfully sent ${transferAmount} ${tokenSymbol}`);
        await fetchTokenInfo();
        setTransferAmount("");
        setRecipientAddress("");
      }
    } catch (error) {
      console.error("Transfer failed:", error);
      setErrorMessage("Transfer failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (address: string): string => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-[#1C0033] w-full h-full flex flex-col p-3 overflow-y-auto">
      <div className="text-white text-center mb-3">
        <p
          className="font-zen text-[26px] relative"
          style={{
            WebkitTextStroke: "1.5px #74007E",
          }}
        >
          RISE CRYSTALS
        </p>
        <div className="bg-purple-700 bg-opacity-30 rounded-lg py-2 px-3 mt-2 inline-block">
          <p className="text-sm font-medium">1 ETH = 1,000,000 Rise Crystals</p>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white p-2 rounded mb-3 text-sm">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-500 bg-opacity-20 border border-green-500 text-white p-2 rounded mb-3 text-sm">
          {successMessage}
        </div>
      )}

      {/* Token Balance */}
      <div className="bg-[#29004D] rounded-lg p-3 mb-3">
        <h2 className="text-lg font-semibold text-white mb-2">Your Balance</h2>
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm opacity-70">
            Total {tokenSymbol}:
          </span>
          <span className="text-white text-lg font-bold">
            {parseFloat(formattedBalance).toLocaleString()}
          </span>
        </div>
        <div className="h-2 bg-[#3D0066] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
            style={{ width: "100%" }}
          ></div>
        </div>
        <div className="mt-3 text-center">
          <p className="text-white text-xs opacity-70">
            Earned from staking or received from other users
          </p>
        </div>
      </div>

      {/* Transfer Form */}
      <div className="bg-[#29004D] rounded-lg p-3 mb-3">
        <h2 className="text-lg font-semibold text-white mb-2">
          Send {tokenSymbol}
        </h2>
        <div className="mb-3">
          <label className="block text-white text-xs mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            className="w-full bg-[#3D0066] text-white p-2 rounded text-sm"
            placeholder="0x..."
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block text-white text-xs mb-1">
            Amount ({tokenSymbol})
          </label>
          <div className="flex items-center">
            <input
              type="number"
              className="w-full bg-[#3D0066] text-white p-2 rounded-l text-sm"
              placeholder="0.0"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              step="0.01"
              min="0"
            />
            <button
              className="bg-[#3D0066] text-purple-400 font-semibold py-2 px-3 rounded-r text-sm"
              onClick={() => setTransferAmount(formattedBalance)}
            >
              MAX
            </button>
          </div>
          <p className="text-xs text-white opacity-50 mt-1">
            Balance: {parseFloat(formattedBalance).toLocaleString()}{" "}
            {tokenSymbol}
          </p>
        </div>
        <button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-2 px-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleTransfer}
          disabled={
            isLoading || !transferAmount || !recipientAddress || !address
          }
        >
          {isLoading ? "Processing..." : `Send ${tokenSymbol}`}
        </button>
      </div>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <div className="bg-[#29004D] rounded-lg p-3 mb-3">
          <h2 className="text-lg font-semibold text-white mb-2">
            Recent Transactions
          </h2>
          <div className="space-y-2">
            {recentTransactions.map((tx, index) => (
              <div
                key={index}
                className="bg-[#3D0066] bg-opacity-40 rounded p-2 text-xs"
              >
                <div className="flex justify-between mb-1">
                  <span className="text-white opacity-70">To:</span>
                  <span className="text-white">
                    {formatAddress(tx.recipient)}
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-white opacity-70">Amount:</span>
                  <span className="text-white">
                    {parseFloat(tx.amount).toLocaleString()} {tokenSymbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white opacity-70">Date:</span>
                  <span className="text-white">{formatDate(tx.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What are Rise Crystals */}
      <div className="bg-[#29004D] rounded-lg p-3">
        <h2 className="text-lg font-semibold text-white mb-1">
          What are Rise Crystals?
        </h2>
        <ul className="text-white text-xs opacity-70 list-disc pl-4 space-y-1">
          <li>Rise Crystals are the in-game currency of the Rise ecosystem</li>
          <li>
            Earn Rise Crystals by staking ETH (1 ETH = 1,000,000 Crystals)
          </li>
          <li>Use Rise Crystals to purchase in-game items and upgrades</li>
          <li>Transfer Rise Crystals to other players</li>
        </ul>
      </div>
    </div>
  );
};

export default RiseCrystals;
