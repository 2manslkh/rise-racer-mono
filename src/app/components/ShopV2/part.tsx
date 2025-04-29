import React from "react";
import Image from "next/image";
import { Part } from "./type";
import { getCurrentVelocity } from "./data"; // Import new function

// TODO: Get actual RiseCrystals icon path
const RISE_CRYSTAL_ICON = "/rise_crystal.svg";

interface PartItemProps {
  part: Part;
  onUpgrade: (partId: string) => void;
  currentRiseCrystals: number; // Pass the current balance to disable button if needed
  cost: number;
  isUpgrading?: boolean; // Add loading state
}

const PartItem: React.FC<PartItemProps> = ({
  part,
  onUpgrade,
  currentRiseCrystals,
  cost,
  isUpgrading = false,
}) => {
  const currentVelocity = getCurrentVelocity(part);
  const canAfford = currentRiseCrystals >= cost;

  const handleUpgradeClick = () => {
    if (canAfford && !isUpgrading) {
      onUpgrade(part.id);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-purple-900/30 border border-purple-800/50 rounded-lg shadow">
      <div className="flex items-center gap-3">
        <div>
          <p className="font-bold text-lg text-white">{part.name}</p>
          <p className="text-sm text-purple-300">Level: {part.currentLevel}</p>
          <p className="text-xs text-gray-300 mt-1">
            Velocity: {currentVelocity.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <button
          onClick={handleUpgradeClick}
          disabled={!canAfford || isUpgrading}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded text-white font-semibold transition-colors duration-200 min-w-[120px] ${
            isUpgrading
              ? "bg-purple-500 cursor-wait"
              : canAfford
                ? "bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
                : "bg-purple-700/50 opacity-70 cursor-not-allowed"
          }`}
        >
          {isUpgrading ? (
            <span>Upgrading...</span>
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
