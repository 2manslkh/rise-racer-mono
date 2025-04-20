import { FC, useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount, usePublicClient, useSendTransaction } from "wagmi";
import { useToast } from "@/app/hooks/useToast";
import Image from "next/image"; // Import Image component
import { shortenAddress } from "@/app/lib/address"; // Import shortenAddress
import { getBlockExplorerUrl, LOOKUP_ENTITIES } from "@/app/lib/url";

interface LowBalanceModalProps {
  balance: bigint | undefined;
  hotWalletAddress: `0x${string}` | undefined;
}

const LOW_BALANCE_THRESHOLD = 0.005; // ETH // Reverted to original threshold
const RISE_TESTNET_CHAIN_ID = 11155931; // Define target chain ID

const LowBalanceModal: FC<LowBalanceModalProps> = ({
  balance,
  hotWalletAddress,
}) => {
  const publicClient = usePublicClient();
  const [isOpen, setIsOpen] = useState(true); // Control visibility
  const [topUpAmount, setTopUpAmount] = useState(""); // State for input
  const toast = useToast(); // Initialize toast
  const { address: mainWalletAddress, chainId, isConnected } = useAccount(); // Get main wallet address and network info
  const { sendTransaction, isPending: isTxLoading } = useSendTransaction(); // Get transaction function and loading state

  const isLowBalance =
    balance !== undefined &&
    parseFloat(formatEther(balance)) < LOW_BALANCE_THRESHOLD;

  // Check if on the correct network
  const isOnCorrectNetwork = isConnected && chainId === RISE_TESTNET_CHAIN_ID;

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleTopUp = () => {
    if (!isOnCorrectNetwork) {
      toast.error("Please connect wallet to RISE Testnet to top up.");
      return;
    }
    if (!sendTransaction || !hotWalletAddress || !topUpAmount) {
      toast.error("Missing required information for top-up.");
      return;
    }

    let amountWei: bigint;
    try {
      amountWei = parseEther(topUpAmount);
    } catch {
      toast.error("Invalid amount entered.");
      return;
    }

    if (amountWei <= BigInt(0)) {
      toast.error("Please enter an amount greater than 0.");
      return;
    }

    sendTransaction(
      {
        to: hotWalletAddress,
        value: amountWei,
      },
      {
        onSuccess: (txnHash) => {
          const waitPromise = publicClient!.waitForTransactionReceipt({
            hash: txnHash,
          });

          toast.transactionPromise(waitPromise, {
            loading: "Sending Transaction",
            success: () => ({
              message: "Top-up confirmed!",
              link: getBlockExplorerUrl(
                txnHash,
                RISE_TESTNET_CHAIN_ID,
                LOOKUP_ENTITIES.TRANSACTION_HASH
              ),
              value: txnHash,
            }),
            error: (err) => `Transaction failed: ${err.message}`,
          });
          setTopUpAmount(""); // Clear input on success
          // Maybe close the modal or refresh balance here?
          // handleClose();
        },
        onError: (error) => {
          toast.error(`Transaction failed: ${error.message}`);
        },
      }
    );
  };

  if (!isLowBalance || !isOpen || !hotWalletAddress) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-40 h-screen"
        onClick={handleClose} // Close on backdrop click
      ></div>

      {/* Modal Content */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-56px)] max-w-md">
        <div
          className={`bg-white shadow-xl rounded-[12px] transition-all duration-500 ease-in-out origin-center ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
        >
          <div className="relative w-full h-full p-4 flex flex-col gap-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <p
                className="font-zen text-white text-2xl relative"
                style={{
                  WebkitTextStroke: "1.5px #74007E",
                }}
              >
                Top up hot wallet
              </p>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none p-1"
              >
                &times;
              </button>
            </div>

            {/* Visual Transfer Section */}
            <div className="flex items-start justify-center gap-8 mt-2">
              {/* Main Wallet */}
              <div className="flex flex-col items-center text-center">
                <Image
                  src="/wallet-1.svg"
                  alt="Main Wallet"
                  width={40}
                  height={40}
                />
                <p className="text-xs text-black mt-1 font-medium">
                  Main Wallet
                </p>
                <p className="text-xs text-gray-600">
                  {mainWalletAddress ? shortenAddress(mainWalletAddress) : "-"}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex h-full justify-center items-center my-auto">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.293 5.29297L12.586 6.00008L18.586 12.0001L12.586 18.0001L13.293 18.7072L19.293 12.7072C19.683 12.3162 19.683 11.6841 19.293 11.293L13.293 5.29297Z"
                    fill="#6B7280"
                  />
                  <path
                    d="M5 12.75C4.58579 12.75 4.25 12.4142 4.25 12C4.25 11.5858 4.58579 11.25 5 11.25L19 11.25C19.4142 11.25 19.75 11.5858 19.75 12C19.75 12.4142 19.4142 12.75 19 12.75L5 12.75Z"
                    fill="#6B7280"
                  />
                </svg>
              </div>

              {/* Hot Wallet */}
              <div className="flex flex-col items-center text-center">
                <Image
                  src="/wallet-2.svg"
                  alt="Hot Wallet"
                  width={40}
                  height={40}
                />
                <p className="text-xs text-black mt-1 font-medium">
                  Hot Wallet
                </p>
                <p className="text-xs text-gray-600">
                  {shortenAddress(hotWalletAddress)}
                </p>
                <p className="text-xs text-red-600 font-semibold">
                  (Low:{" "}
                  {balance !== undefined
                    ? formatEther(balance).slice(0, 5)
                    : "?"}{" "}
                  ETH)
                </p>
              </div>
            </div>

            {/* Top Up Input and Button */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="topUpAmountInput"
                className="text-sm font-medium text-black"
              >
                Amount to send (ETH):
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="topUpAmountInput"
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder={`Min ${LOW_BALANCE_THRESHOLD} ETH recommended`}
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
                  className="bg-[#5700A3] text-white py-1 px-3 rounded hover:bg-[#460082] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                >
                  {isTxLoading ? "Sending..." : "Send ETH"}
                </button>
              </div>
              {/* Network Warning Message */}
              {isConnected && !isOnCorrectNetwork && (
                <p className="text-orange-600 text-xs mt-1">
                  Please switch your main wallet to RISE Testnet to proceed.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LowBalanceModal;
