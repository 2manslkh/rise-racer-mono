import React, { useState } from "react";
import { useHotWallet } from "@/app/context/HotWalletContext";
import { shortenAddress } from "@/app/lib/address";
import { copyToClipboard } from "@/app/lib/copy";
import Image from "next/image";
import { useAccount, useSendTransaction, useWriteContract } from "wagmi"; // Assuming wagmi hooks are available via AppKit context
import { parseEther } from "ethers";
import toast from "react-hot-toast";

// --- PLACEHOLDER: Replace with actual contract details ---
const BINDING_CONTRACT_ADDRESS = "0x..."; // Replace with actual address
const BINDING_CONTRACT_ABI = [
  {
    name: "bindHotWallet", // Replace with actual function name if different
    type: "function",
    inputs: [{ name: "hotWalletAddress", type: "address" }], // Adjust params if needed
    outputs: [],
    stateMutability: "nonpayable",
  },
];
// --- END PLACEHOLDER ---

const HotWalletManager = () => {
  const {
    address: hotWalletAddress,
    isLoading: isHotWalletLoading,
    createHotWallet,
  } = useHotWallet();
  const { address: mainWalletAddress, isConnected } = useAccount(); // Get main wallet address
  const [topUpAmount, setTopUpAmount] = useState("");

  const {
    data: hash,
    isPending: isTxLoading,
    sendTransaction,
  } = useSendTransaction();
  const {
    writeContract,
    isPending: isBindLoading,
    error: bindError,
  } = useWriteContract();

  const handleCopyAddress = () => {
    if (hotWalletAddress) {
      copyToClipboard(hotWalletAddress);
    }
  };

  const handleTopUp = async () => {
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
    if (!mainWalletAddress || !hotWalletAddress) {
      toast.error("Main wallet or burner wallet not available.");
      return;
    }
    if (!BINDING_CONTRACT_ADDRESS || BINDING_CONTRACT_ADDRESS === "0x...") {
      toast.error("Binding contract details not configured.");
      console.error(
        "Placeholder contract details are still being used for binding."
      );
      return;
    }

    writeContract({
      address: BINDING_CONTRACT_ADDRESS as `0x${string}`,
      abi: BINDING_CONTRACT_ABI,
      functionName: "bindHotWallet", // Make sure this matches ABI
      args: [hotWalletAddress as `0x${string}`],
    });
    // Consider adding toast notifications for pending/success/error based on hook state
  };

  if (isHotWalletLoading) {
    return <div>Loading Hot Wallet...</div>;
  }

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
            Use this address to top up gas (RISE token on RISE Testnet).
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
              disabled={isTxLoading}
            />
            <button
              onClick={handleTopUp}
              disabled={isTxLoading || !isConnected || !topUpAmount}
              className="bg-[#5700A3] text-white py-1 px-3 rounded hover:bg-[#460082] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isTxLoading ? "Sending..." : "Top Up"}
            </button>
          </div>
          {/* Bind Section */}
          {isConnected && mainWalletAddress && (
            <button
              onClick={handleBind}
              disabled={isBindLoading}
              className="mt-2 w-full bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isBindLoading ? "Binding..." : "Bind Wallet to Main"}
            </button>
          )}
          {bindError && (
            <p className="text-red-500 text-xs mt-1">
              Error binding: {bindError.message}
            </p>
          )}
        </div>
      ) : (
        <button
          onClick={createHotWallet}
          className="mt-1 w-full bg-[#5700A3] text-white py-1 px-2 rounded hover:bg-[#460082] transition-colors text-sm"
        >
          Create Burner Wallet
        </button>
      )}
    </div>
  );
};

export default HotWalletManager;
