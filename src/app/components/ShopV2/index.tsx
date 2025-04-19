import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Part } from "./type";
import { initialPartsData, getUpgradeCost } from "./data";
import PartItem from "./part";

// TODO: Replace with actual state management (e.g., Zustand, Context API)
// TODO: Get actual RiseCrystals icon path
const RISE_CRYSTAL_ICON = "/rise_crystal.svg";

const ShopV2 = () => {
  // --- State Management (Replace with global state) ---
  const [parts, setParts] = useState<Part[]>(initialPartsData);
  const [riseCrystals, setRiseCrystals] = useState<number>(1000); // Example starting crystals
  // -----------------------------------------------------

  const handleUpgrade = useCallback(
    (partId: string) => {
      setParts((currentParts) => {
        const partIndex = currentParts.findIndex((p) => p.id === partId);
        if (partIndex === -1) return currentParts; // Part not found

        const partToUpgrade = currentParts[partIndex];
        const cost = getUpgradeCost(partToUpgrade);

        if (
          partToUpgrade.currentLevel < partToUpgrade.maxLevel &&
          riseCrystals >= cost
        ) {
          // Deduct cost
          setRiseCrystals((prevCrystals) => prevCrystals - cost);

          // Create updated part
          const updatedPart = {
            ...partToUpgrade,
            currentLevel: partToUpgrade.currentLevel + 1,
            // Optionally update name or other properties based on level
          };

          // Return new parts array with the updated part
          const newParts = [...currentParts];
          newParts[partIndex] = updatedPart;
          return newParts;
        } else {
          // Cannot upgrade (not enough crystals or max level)
          // TODO: Add user feedback (e.g., toast notification)
          console.log(
            "Cannot upgrade part:",
            partId,
            "Cost:",
            cost,
            "Balance:",
            riseCrystals
          );
          return currentParts; // No changes
        }
      });
    },
    [riseCrystals] // Dependency: re-create handler if crystal balance changes
  );

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-purple-800 to-indigo-900 flex flex-col py-4 px-2 items-center gap-4 text-white shadow-lg rounded-md">
      {/* Header */}
      <div className="relative w-full flex items-center justify-center px-3 border-b border-purple-600 pb-3 mb-2">
        <p
          className="font-bold text-3xl tracking-wider uppercase"
          style={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          Upgrade Bay
        </p>
        {/* Rise Crystal Display (Top Right) */}
        <div className="absolute top-0 right-2 flex items-center gap-2 bg-black/30 p-2 rounded-lg">
          <span className="font-semibold text-lg">
            {riseCrystals.toFixed(0)}
          </span>
          <div className="relative w-6 h-6">
            <Image src={RISE_CRYSTAL_ICON} alt="Rise Crystals" layout="fill" />
          </div>
        </div>
      </div>

      {/* Upgrade List */}
      <div
        className="relative w-full flex-1 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-900"
        style={{ maxHeight: "calc(100% - 80px)" }} // Adjust height as needed
      >
        {parts.map((part) => (
          <PartItem
            key={part.id}
            part={part}
            onUpgrade={handleUpgrade}
            currentRiseCrystals={riseCrystals}
          />
        ))}
      </div>
    </div>
  );
};

export default ShopV2;
