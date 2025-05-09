import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { initialPartsData } from "./data";
import PartItem from "./part";
import { getBalance, getDecimals } from "@/app/lib/rise-crystals";
import { useHotWallet } from "@/app/context/HotWalletContext";
import { ethers, parseEther } from "ethers";
import {
  PartType as CosmicPartType,
  upgradePart,
  // getEquippedPart, // Removed as it's no longer used
  // getPartData, // Removed as it's no longer used
  getShop,
  Shop,
} from "@/app/lib/cosmic-parts";
import {
  useTransactionTracker,
  TransactionCallback,
} from "@/app/hooks/useTransactionTracker";
import { PartType } from "./type"; // Try importing PartType from here
import { useToast } from "@/app/hooks/useToast";
import { getBlockExplorerUrl, LOOKUP_ENTITIES } from "@/app/lib/url";
import { riseTestnet } from "@/app/configuration/wagmi";

const RISE_CRYSTAL_ICON = "/rise_crystal.svg";

// Map from ShopV2 PartType to CosmicPartType
// const partTypeMap: { [key: string]: CosmicPartType } = {
//   Engine: CosmicPartType.ENGINE,
//   Turbo: CosmicPartType.TURBO,
//   Chassis: CosmicPartType.CHASSIS,
//   Wheels: CosmicPartType.WHEEL,
// };

const partTypeMapV2: { [key: string]: CosmicPartType } = {
  0: CosmicPartType.ENGINE,
  1: CosmicPartType.TURBO,
  2: CosmicPartType.CHASSIS,
  3: CosmicPartType.WHEEL,
};

// Define DisplayPart based on initialPartsData structure + dynamic fields
interface DisplayPart {
  id: string;
  type: PartType; // Use the imported PartType
  name: string;
  imageUrl?: string;
  baseVelocity: number;
  velocityMultiplier: number;
  // Dynamic fields updated from shopData
  currentLevel: number;
  upgradeCost: number;
}

const ShopV2 = () => {
  // --- State Management (Replace with global state) ---
  // const [parts, setParts] = useState<Part[]>();
  const [shopData, setShopData] = useState<Shop>();
  const [displayParts, setDisplayParts] = useState<DisplayPart[]>([]);
  const [riseCrystals, setRiseCrystals] = useState<string>("0"); // Example starting crystals
  const { hotWallet, incrementNonce, refreshPlayerInfo, getNonce } =
    useHotWallet();
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null); // Tracks which part is being upgraded
  const [txError, setTxError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { initiateTx, updateTx, removeTx } = useTransactionTracker();
  const toast = useToast();

  // --- Data Fetching Declarations First ---
  const refetchShopData = useCallback(async () => {
    if (!hotWallet || !hotWallet.provider || !hotWallet.address) {
      console.warn("Cannot refetch shop data: Missing wallet info.");
      return;
    }
    console.log("Refetching shop data after transaction mined...");
    try {
      const newShopData = await getShop(hotWallet.address, hotWallet.provider);
      console.log("🚀 | refetchShopData | newShopData:", newShopData);
      setShopData(newShopData);
      toast.success("Shop data updated!");
    } catch (error) {
      console.error("Failed to refetch shop data:", error);
      toast.error("Failed to update shop data after transaction.");
    }
  }, [hotWallet]);

  const fetchInitialShopData = useCallback(async () => {
    if (!hotWallet || !hotWallet.provider || !hotWallet.address) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const provider = hotWallet.provider as ethers.Provider;
      const address = hotWallet.address;
      const shopData = await getShop(address, provider);
      console.log("🚀 | fetchInitialShopData | shopData:", shopData);
      setShopData(shopData);

      // setParts(updatedParts);
    } catch (error) {
      console.error("Failed to fetch initial parts data:", error);
      toast.error("Failed to load parts data from blockchain");
    } finally {
      setIsLoading(false);
    }
  }, [hotWallet]);

  // --- Refs Initialized After Function Declarations ---
  // Create a ref to hold the latest refetchShopData function
  // Initialize with the function itself
  const refetchShopDataRef = useRef(refetchShopData);

  // --- Effects ---
  useEffect(() => {
    fetchInitialShopData();
  }, [fetchInitialShopData]);

  // Keep the ref updated with the latest refetchShopData function
  // useEffect(() => {
  //   refetchShopDataRef.current = refetchShopData;
  // }, [refetchShopData]);

  // Refresh balance after upgrade
  useEffect(() => {
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
  }, [isUpgrading, hotWallet]);

  // --- Effect to compute displayParts when shopData changes ---
  useEffect(() => {
    if (shopData) {
      console.log("Recalculating displayParts because shopData changed.");
      const newDisplayParts = initialPartsData.map((staticPart) => {
        let currentLevel = 0;
        let upgradeCost = 0;
        switch (staticPart.id) {
          case "0": // Engine
            currentLevel = Number(shopData.engineLevel);
            upgradeCost = Number(ethers.formatUnits(shopData.engineCost, 18));
            break;
          case "1": // Turbo
            currentLevel = Number(shopData.turboLevel);
            upgradeCost = Number(ethers.formatUnits(shopData.turboCost, 18));
            break;
          case "2": // Chassis
            currentLevel = Number(shopData.chassisLevel);
            upgradeCost = Number(ethers.formatUnits(shopData.chassisCost, 18));
            break;
          case "3": // Wheels
            currentLevel = Number(shopData.wheelLevel);
            upgradeCost = Number(ethers.formatUnits(shopData.wheelCost, 18));
            break;
        }
        // Combine static data with dynamic level and cost
        return {
          ...staticPart, // Spread static fields: id, type, name, imageUrl, baseVelocity, velocityMultiplier
          currentLevel,
          upgradeCost,
        };
      });
      setDisplayParts(newDisplayParts);
    }
  }, [shopData]); // Only re-run when shopData changes

  // --- Upgrade Handler ---
  const handleUpgrade = useCallback(
    async (partId: string) => {
      let placeholderHash: string | null = null;
      if (!hotWallet || !hotWallet.provider) {
        setTxError("Wallet not connected");
        return;
      }
      if (!shopData) {
        setTxError("Shop data not loaded yet.");
        return;
      }
      let cost = 0n;
      if (partId === "0") {
        cost = shopData.engineCost;
      } else if (partId === "1") {
        cost = shopData.turboCost;
      } else if (partId === "2") {
        cost = shopData.chassisCost;
      } else if (partId === "3") {
        cost = shopData.wheelCost;
      }

      if (parseEther(riseCrystals) >= cost) {
        setIsUpgrading(partId);
        setTxError(null);

        try {
          incrementNonce();
          const currentNonce = getNonce();
          const description = `Upgrade ${partId} #${currentNonce}`;
          placeholderHash = initiateTx(description);

          const txReceipt = await upgradePart(
            hotWallet,
            partTypeMapV2[partId],
            currentNonce
          );
          console.log("🚀 | txReceipt:", txReceipt);

          // Define callbacks for the transaction tracker
          const callbacks: TransactionCallback = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onMined: (receipt: any) => {
              console.log(
                `Transaction ${receipt.transactionHash} confirmed! Triggering shop refetch...`
              );
              // toast.success("Upgrade confirmed!");
              toast.transactionSuccess({
                message: "Upgrade confirmed!",
                link: getBlockExplorerUrl(
                  receipt.transactionHash,
                  riseTestnet.id,
                  LOOKUP_ENTITIES.TRANSACTION_HASH
                ),
                value: receipt.hash,
              });
            },
            onFailed: (error: Error) => {
              console.error(`Upgrade transaction failed:`, error);
              toast.error(`Upgrade failed: ${error.message}`);
              setTxError(`Upgrade failed: ${error.message}`);
            },
            onDropped: () => {
              console.warn(`Upgrade transaction dropped.`);
              toast.error("Upgrade transaction was dropped. Please try again.");
              setTxError("Upgrade transaction was dropped.");
            },
          };

          // Update the optimistic transaction with the receipt and callbacks
          if (placeholderHash) {
            updateTx(placeholderHash, txReceipt, callbacks);
            // Cooldown for 1 second to ensure the transaction is mined
            setTimeout(() => {
              refetchShopDataRef.current();
              setIsUpgrading(null);
              refreshPlayerInfo();
            }, 2500);

            placeholderHash = null;
          }

          // Update balance immediately (optimistic)
        } catch (error) {
          console.error("Error during upgrade process:", error);
          const errorMsg =
            error instanceof Error ? error.message : "Unknown error";
          // toast.error(`Upgrade error: ${errorMsg}`, { id: "upgrade-toast" });
          toast.error(`Upgrade error: ${errorMsg}`);
          setTxError(errorMsg);
          // If there was an error *before* updateTx, remove the placeholder
          if (placeholderHash) {
            removeTx(placeholderHash);
          }
        } finally {
        }
      } else {
        console.log(cost, parseEther(riseCrystals));
        setTxError("Not enough Rise Crystals");
        toast.error("Not enough Rise Crystals for upgrade");
      }
    },
    [
      hotWallet,
      riseCrystals,
      initiateTx,
      updateTx,
      removeTx,
      incrementNonce,
      getNonce,
      refreshPlayerInfo,
    ]
  );

  return (
    <div className="relative w-full h-full bg-[#2A004F] flex flex-col py-4 px-4 items-center gap-4 text-white shadow-lg">
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
      </div>

      <div className="relative w-full flex items-center justify-center gap-2 bg-black/30 py-2 rounded-lg">
        <span className="font-semibold text-lg">
          {(+riseCrystals).toFixed(2)}
        </span>
        <div className="relative w-6 h-6">
          <Image src={RISE_CRYSTAL_ICON} alt="Rise Crystals" layout="fill" />
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
        /* Upgrade List - Render using displayParts */
        <div
          className="relative w-full flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-900 gap-4 flex flex-col"
          style={{ maxHeight: "calc(100% - 80px)" }} // Adjust height as needed
        >
          {/* Map over the pre-calculated displayParts state */}
          {displayParts.map((part) => (
            <PartItem
              key={part.id}
              part={part} // Pass the combined part data
              onUpgrade={handleUpgrade}
              currentRiseCrystals={Number(riseCrystals)}
              cost={part.upgradeCost}
              isUpgrading={isUpgrading === part.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopV2;
