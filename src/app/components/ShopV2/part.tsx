import React from "react";
import Image from "next/image";
import { Part } from "./type";
import { getUpgradeCost, getCurrentVelocity } from "./data"; // Import new function

// TODO: Get actual RiseCrystals icon path
const RISE_CRYSTAL_ICON = "/rise_crystal.svg";

interface PartItemProps {
  part: Part;
  onUpgrade: (partId: string) => void;
  currentRiseCrystals: number; // Pass the current balance to disable button if needed
}

const PartItem: React.FC<PartItemProps> = ({
  part,
  onUpgrade,
  currentRiseCrystals,
}) => {
  const cost = getUpgradeCost(part);
  const currentVelocity = getCurrentVelocity(part);
  const canAfford = currentRiseCrystals >= cost;
  const isMaxLevel = part.currentLevel >= part.maxLevel;

  const handleUpgradeClick = () => {
    if (!isMaxLevel && canAfford) {
      onUpgrade(part.id);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-purple-100 rounded-lg shadow mb-2">
      <div className="flex items-center gap-3">
        <div>
          <p className="font-bold text-lg text-purple-800">{part.name}</p>
          <p className="text-sm text-purple-600">Level: {part.currentLevel}</p>
          <p className="text-xs text-gray-500 mt-1">
            Base Velocity: {currentVelocity.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Velocity Multiplier: {part.velocityMultiplier.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <button
          onClick={handleUpgradeClick}
          disabled={isMaxLevel || !canAfford}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded text-white font-semibold transition-colors duration-200 min-w-[120px] ${
            isMaxLevel
              ? "bg-gray-500 cursor-not-allowed"
              : canAfford
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-purple-400 opacity-70 cursor-not-allowed"
          }`}
        >
          {isMaxLevel ? (
            <span>Max Level</span>
          ) : (
            <>
              <span>Upgrade</span>
              <span className="font-bold">{cost.toFixed(0)}</span>
              <div className="relative w-5 h-5">
                <Image src={RISE_CRYSTAL_ICON} alt="" layout="fill" />
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PartItem;
