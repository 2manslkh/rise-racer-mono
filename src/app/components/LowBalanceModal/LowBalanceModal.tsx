import { FC, useState } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useToast } from "@/app/hooks/useToast";
import Image from "next/image"; // Import Image component
import { shortenAddress } from "@/app/lib/address"; // Import shortenAddress
import { Turnstile } from "@marsidev/react-turnstile";

interface LowBalanceModalProps {
  balance: bigint | undefined;
  hotWalletAddress: `0x${string}` | undefined;
  onFaucetSuccess?: () => void;
}

const LOW_BALANCE_THRESHOLD = 0.005; // ETH // Reverted to original threshold
const RISE_TESTNET_CHAIN_ID = 11155931; // Define target chain ID
const FAUCET_API_URL = "https://faucet-api.riselabs.xyz/faucet/request";
const TURNSTILE_SITE_KEY = "0x4AAAAAABDerdTw43kK5pDL";

const LowBalanceModal: FC<LowBalanceModalProps> = ({
  balance,
  hotWalletAddress,
  onFaucetSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(true); // Control visibility
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isFaucetLoading, setIsFaucetLoading] = useState(false);
  const toast = useToast(); // Initialize toast
  const { chainId, isConnected } = useAccount(); // Get network info

  const isLowBalance =
    balance !== undefined &&
    parseFloat(formatEther(balance)) < LOW_BALANCE_THRESHOLD;

  // Check if on the correct network
  const isOnCorrectNetwork = isConnected && chainId === RISE_TESTNET_CHAIN_ID;

  const handleClose = () => {
    setIsOpen(false);
  };

  const requestFaucetEth = async (token: string) => {
    if (!hotWalletAddress) {
      toast.error("Hot wallet address is missing.");
      return;
    }
    if (!token) {
      toast.error("CAPTCHA verification token is missing.");
      return;
    }

    setIsFaucetLoading(true);
    toast.show("Requesting ETH from faucet...");

    try {
      const response = await fetch(FAUCET_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: hotWalletAddress,
          turnstileToken: token,
          tokenSymbol: "ETH",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `Faucet request failed: ${response.statusText}`
        );
      }

      toast.success(
        result.message || "Faucet request successful! ETH incoming."
      );

      setTimeout(() => {
        onFaucetSuccess?.();
      }, 5000);
    } catch (error: unknown) {
      console.error("Faucet request error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Faucet request failed: ${errorMessage}`);
      setTurnstileToken(null);
    } finally {
      setIsFaucetLoading(false);
    }
  };

  if (!isLowBalance || !isOpen || !hotWalletAddress) {
    return null;
  }

  const statusMessage = isFaucetLoading
    ? "Requesting ETH..."
    : turnstileToken
      ? "Request Processing..."
      : "Verifying...";

  return (
    <>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-40 h-screen md:max-h-[750px]"></div>

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-[350px] h-content">
        <div
          className={`bg-white shadow-xl rounded-[12px] transition-all duration-500 ease-in-out origin-center ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
        >
          <div className="relative w-full h-full p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p
                className="font-zen text-white text-2xl relative"
                style={{
                  WebkitTextStroke: "1.5px #74007E",
                }}
              >
                Request Faucet ETH
              </p>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none p-1"
                disabled={isFaucetLoading}
              >
                &times;
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 mt-2">
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

            <div className="flex flex-col items-center gap-3">
              {isConnected && !isOnCorrectNetwork && (
                <p className="text-orange-600 text-xs text-center">
                  Your main wallet is not on RISE Testnet. This faucet request
                  will top up your hot wallet (
                  {shortenAddress(hotWalletAddress)}).
                </p>
              )}
              <Turnstile
                siteKey={TURNSTILE_SITE_KEY}
                onSuccess={(token: string) => {
                  setTurnstileToken(token);
                  requestFaucetEth(token);
                }}
                onExpire={() => {
                  setTurnstileToken(null);
                  toast.error("CAPTCHA expired. Please try again.");
                }}
                onError={() => toast.error("CAPTCHA verification failed.")}
              />
              <p className="text-sm text-gray-600 mt-2">{statusMessage}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LowBalanceModal;
