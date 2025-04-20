import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Part } from "./type";
import { initialPartsData, getUpgradeCost } from "./data";
import PartItem from "./part";
import { getBalance, getDecimals } from "@/app/lib/rise-crystals";
import { useHotWallet } from "@/app/context/HotWalletContext";
import { ethers } from "ethers";
import {
  PartType as CosmicPartType,
  upgradePart,
  getEquippedPart,
  getPartData,
} from "@/app/lib/cosmic-parts";
import toast from "react-hot-toast";

const RISE_CRYSTAL_ICON = "/rise_crystal.svg";

// Map from CosmicPartType to ShopV2 PartType
const reversePartTypeMap = {
  [CosmicPartType.ENGINE]: "Engine",
  [CosmicPartType.TURBO]: "Turbo",
  [CosmicPartType.CHASSIS]: "Chassis",
  [CosmicPartType.WHEEL]: "Wheels",
};

const ShopV2 = () => {
  // --- State Management (Replace with global state) ---
  const [parts, setParts] = useState<Part[]>(initialPartsData);
  const [riseCrystals, setRiseCrystals] = useState<string>("0"); // Example starting crystals
  const { hotWallet, incrementNonce, nonce } = useHotWallet();
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null); // Tracks which part is being upgraded
  const [txError, setTxError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // -----------------------------------------------------

  // Fetch wallet balance and token decimals on component mount
  useEffect(() => {
    const fetchRiseCrystalsBalance = async () => {
      if (!hotWallet || !hotWallet.provider) return;

      try {
        const provider = hotWallet.provider as ethers.Provider;
        if (!hotWallet.address) return;

        const balance = await getBalance(hotWallet.address, provider);
        const decimals = await getDecimals(provider);

        // Format the balance
        const formatted = ethers.formatUnits(balance, decimals);
        setRiseCrystals(formatted);
      } catch (error) {
        console.error("Failed to fetch Rise Crystals balance:", error);
      }
    };

    fetchRiseCrystalsBalance();
  }, [hotWallet]);

  // Fetch the current parts data from the blockchain
  useEffect(() => {
    const fetchPartsData = async () => {
      if (!hotWallet || !hotWallet.provider || !hotWallet.address) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const provider = hotWallet.provider as ethers.Provider;
        const address = hotWallet.address;

        // Create a copy of the initial parts data
        const updatedParts = [...initialPartsData];

        // Fetch equipped parts for each part type
        for (const partType of Object.values(CosmicPartType)) {
          // Skip non-numeric values (enum can have both string and numeric keys)
          if (isNaN(Number(partType))) continue;

          try {
            // Get the token ID of the equipped part for this type
            const tokenId = await getEquippedPart(
              address,
              Number(partType),
              provider
            );

            // If tokenId is 0, there's no equipped part for this type
            if (tokenId === 0n) continue;

            // Get the part data for this token ID
            const partData = await getPartData(tokenId, provider);

            // Find the corresponding part in our local state
            const shopPartType = reversePartTypeMap[partData.partType];
            const partIndex = updatedParts.findIndex(
              (p) => p.type === shopPartType
            );

            if (partIndex !== -1) {
              // Update the part with the current level from the blockchain
              updatedParts[partIndex] = {
                ...updatedParts[partIndex],
                currentLevel: partData.level,
              };
            }
          } catch (error) {
            console.error(
              `Failed to fetch part data for type ${partType}:`,
              error
            );
          }
        }

        // Update the state with the fetched part levels
        setParts(updatedParts);
      } catch (error) {
        console.error("Failed to fetch parts data:", error);
        toast.error("Failed to load parts data from blockchain");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartsData();
  }, [hotWallet]);

  // Refresh balance after upgrade
  useEffect(() => {
    if (!isUpgrading) {
      const fetchBalance = async () => {
        if (!hotWallet || !hotWallet.provider || !hotWallet.address) return;

        try {
          const provider = hotWallet.provider as ethers.Provider;
          const balance = await getBalance(hotWallet.address, provider);
          const decimals = await getDecimals(provider);

          // Format the balance
          const formatted = ethers.formatUnits(balance, decimals);
          setRiseCrystals(formatted);
        } catch (error) {
          console.error("Failed to refresh balance:", error);
        }
      };

      fetchBalance();
    }
  }, [isUpgrading, hotWallet]);

  // Refresh part levels after an upgrade
  useEffect(() => {
    if (!isUpgrading && hotWallet && hotWallet.provider && hotWallet.address) {
      const fetchPartLevels = async () => {
        try {
          const provider = hotWallet.provider as ethers.Provider;
          const address = hotWallet.address!;

          // Create a copy of the current parts data
          const updatedParts = [...parts];

          // Fetch equipped parts for each part type
          for (const partType of Object.values(CosmicPartType)) {
            // Skip non-numeric values
            if (isNaN(Number(partType))) continue;

            try {
              // Get the token ID of the equipped part for this type
              const tokenId = await getEquippedPart(
                address,
                Number(partType),
                provider
              );

              // If tokenId is 0, there's no equipped part for this type
              if (tokenId === 0n) continue;

              // Get the part data for this token ID
              const partData = await getPartData(tokenId, provider);

              // Find the corresponding part in our local state
              const shopPartType = reversePartTypeMap[partData.partType];
              const partIndex = updatedParts.findIndex(
                (p) => p.type === shopPartType
              );

              if (partIndex !== -1) {
                // Update the part with the current level from the blockchain
                updatedParts[partIndex] = {
                  ...updatedParts[partIndex],
                  currentLevel: partData.level,
                };
              }
            } catch (error) {
              console.error(
                `Failed to refresh part data for type ${partType}:`,
                error
              );
            }
          }

          // Update the state with the refreshed part levels
          setParts(updatedParts);
        } catch (error) {
          console.error("Failed to refresh parts data:", error);
        }
      };

      fetchPartLevels();
    }
  }, [isUpgrading, hotWallet, parts]);

  const handleUpgrade = useCallback(
    async (partId: string) => {
      console.log("🚀 | partId:", partId);
      if (!hotWallet || !hotWallet.provider) {
        setTxError("Wallet not connected");
        return;
      }

      const partIndex = parts.findIndex((p) => p.id === partId);
      if (partIndex === -1) return; // Part not found

      console.log("🚀 | partIndex:", partIndex);
      const partToUpgrade = parts[partIndex];
      const cost = getUpgradeCost(partToUpgrade);
      console.log("🚀 | partToUpgrade:", partToUpgrade);

      if (Number(riseCrystals) >= cost) {
        setIsUpgrading(partId);
        setTxError(null);

        try {
          // Map the shop part type to the contract's part type enum
          try {
            // Call the contract upgrade function
            toast.loading(`Upgrading ${partToUpgrade.name}...`, {
              id: "upgrade-toast",
            });

            // Call the contract to upgrade the part
            incrementNonce();
            const tx = await upgradePart(hotWallet, partIndex, nonce);

            // Wait for transaction to complete
            const receipt = await tx.wait();

            if (receipt && receipt.status === 1) {
              // Transaction successful, update UI state
              toast.success(
                `${partToUpgrade.name} upgraded to level ${partToUpgrade.currentLevel + 1}!`,
                { id: "upgrade-toast" }
              );

              // Note: We don't need to manually update the part level here anymore
              // as the useEffect hook will fetch the updated level from the blockchain
            } else {
              toast.error("Transaction failed", { id: "upgrade-toast" });
              setTxError("Transaction failed");
            }
          } catch (signerError) {
            console.error("Failed to get signer:", signerError);
            toast.error("Unable to sign transaction", { id: "upgrade-toast" });
            setTxError(
              "Unable to sign transaction: " +
                (signerError instanceof Error
                  ? signerError.message
                  : String(signerError))
            );
          }
        } catch (error) {
          console.error("Error upgrading part:", error);
          toast.error(
            `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            { id: "upgrade-toast" }
          );
          setTxError(error instanceof Error ? error.message : "Unknown error");
        } finally {
          setIsUpgrading(null);
        }
      } else {
        // Cannot upgrade (not enough crystals)
        setTxError("Not enough Rise Crystals");
      }
    },
    [hotWallet, parts, riseCrystals]
  );

  return (
    <div className="relative w-full h-full bg-[#2A004F] flex flex-col py-4 px-2 items-center gap-4 text-white shadow-lg">
      {/* Header */}
      <div className="relative w-full flex items-center justify-center px-3">
        <p
          className="font-zen text-white text-[26px] relative"
          style={{
            WebkitTextStroke: "1.5px #74007E",
          }}
        >
          SHOP
        </p>
        {/* Rise Crystal Display (Top Right) */}
        <div className="absolute top-0 right-2 flex items-center gap-2 bg-black/30 p-2 rounded-lg">
          <span className="font-semibold text-lg">{riseCrystals}</span>
          <div className="relative w-6 h-6">
            <Image src={RISE_CRYSTAL_ICON} alt="Rise Crystals" layout="fill" />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {txError && (
        <div className="w-full max-h-32 overflow-scroll bg-red-600/20 border border-red-600 rounded-md p-2 text-sm text-white">
          {txError}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          <span className="ml-2">Loading parts data...</span>
        </div>
      ) : (
        /* Upgrade List */
        <div
          className="relative w-full flex-1 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-900 gap-4 flex flex-col"
          style={{ maxHeight: "calc(100% - 80px)" }} // Adjust height as needed
        >
          {parts.map((part) => (
            <PartItem
              key={part.id}
              part={part}
              onUpgrade={handleUpgrade}
              currentRiseCrystals={Number(riseCrystals)}
              isUpgrading={isUpgrading === part.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopV2;
