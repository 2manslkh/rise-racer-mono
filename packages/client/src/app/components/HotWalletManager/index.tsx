import React, { useState } from "react";
import { useHotWallet } from "@/app/context/HotWalletContext";
import { shortenAddress } from "@/app/lib/address";
import { copyToClipboard } from "@/app/lib/copy";
import Image from "next/image";
import { useAccount, useSendTransaction, useSignMessage } from "wagmi"; // Assuming wagmi hooks are available via AppKit context
import { parseEther } from "ethers";
import toast from "react-hot-toast";

// Define the target Chain ID
const RISE_TESTNET_CHAIN_ID = 11155931;
const message = "Login to Rise Racers"

const HotWalletManager = () => {
  const {
    address: hotWalletAddress,
    isLoading: isHotWalletLoading,
    loadHotWallet,
  } = useHotWallet();
  const { address: mainWalletAddress, isConnected, chainId } = useAccount();
  const [topUpAmount, setTopUpAmount] = useState("");
  const {signMessage} = useSignMessage()
  const {
    data: hash,
    isPending: isTxLoading,
    sendTransaction,
  } = useSendTransaction();

  // Check if the connected wallet is on the correct network
  const isOnCorrectNetwork = isConnected && chainId === RISE_TESTNET_CHAIN_ID;

  const handleCopyAddress = () => {
    if (hotWalletAddress) {
      copyToClipboard(hotWalletAddress);
    }
  };

  const handleTopUp = async () => {
    // Add network check
    if (!isOnCorrectNetwork) {
      toast.error("Please connect to RISE Testnet to top up.");
      return;
    }
    if (!sendTransaction || !hotWalletAddress || !topUpAmount) return;
    const amountWei = parseEther(topUpAmount);
    if (amountWei <= BigInt(0)) {
      toast.error("Please enter a valid amount > 0");
      return;
    }

    sendTransaction({
      to: hotWalletAddress as `0x${string}`,
      value: amountWei,
    });
    // Consider adding toast notifications for pending/success/error based on `hash`, `isTxLoading`, etc.
    // Maybe clear input: setTopUpAmount("");
  };

  const handleBind = async () => {
    // Add network check
    if (!isOnCorrectNetwork) {
      toast.error("Please connect to RISE Testnet to bind.");
      return;
    }
    if (!mainWalletAddress) {
      toast.error("Main wallet not connected.");
      return;
    }
    signMessage({message: message},{onSuccess: async (data) => {
      try {
        await loadHotWallet({address: mainWalletAddress, message, signature: data})
      } catch (error) {
        toast.error("Error binding hot wallet");
      }
    }
    })
  };


  return (
    <div className="relative w-full flex flex-col gap-2 border-t border-gray-200 pt-2 mt-2">
      {/* Wallet Info and Copy */}
      <div className="relative w-full flex items-center gap-2 justify-between">
        <p className="text-black text-inter font-bold text-lg">
          Burner Wallet
          {hotWalletAddress && (
            <span className="font-normal ml-1">
              ({shortenAddress(hotWalletAddress)})
            </span>
          )}
        </p>
        {hotWalletAddress && (
          <button
            className="relative w-5 h-5 text-gray-500 hover:text-black transition-colors"
            onClick={handleCopyAddress}
            title="Copy Address"
          >
            <Image src={"/Copy.svg"} alt="Copy" fill />
          </button>
        )}
      </div>

      {/* Create or Show Actions */}
      {hotWalletAddress ? (
        <div className="flex flex-col gap-2 text-sm">
          <p className="text-black text-inter">
            Use this address to top up gas (ETH on RISE Testnet).
          </p>
          {/* Top Up Section */}
          <div className="flex items-center gap-2 mt-1">
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Amount (ETH)"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              className="flex-grow px-2 py-1 border border-gray-300 rounded text-black text-sm focus:outline-none focus:ring-1 focus:ring-[#5700A3]"
              disabled={isTxLoading || !isOnCorrectNetwork}
            />
            <button
              onClick={handleTopUp}
              disabled={
                isTxLoading ||
                !isConnected ||
                !topUpAmount ||
                !isOnCorrectNetwork
              }
              className="bg-[#5700A3] text-white py-1 px-3 rounded hover:bg-[#460082] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isTxLoading ? "Sending..." : "Top Up"}
            </button>
          </div>
          {/* Network Warning Message */}
          {isConnected && !isOnCorrectNetwork && (
            <p className="text-orange-600 text-xs mt-1">
              Please switch your wallet to RISE Testnet to proceed.
            </p>
          )}
          {/* {bindError && (
            <p className="text-red-500 text-xs mt-1">
              Error binding: {bindError.message}
            </p>
          )} */}
        </div>
      ) : (
        isHotWalletLoading ? <div>Loading...</div> :
        <button
          onClick={() => handleBind()}
          className="mt-1 w-full bg-[#5700A3] text-white py-1 px-2 rounded hover:bg-[#460082] transition-colors text-sm"
        >
        Login
        </button>
      )}
    </div>
  );
};

export default HotWalletManager;
