import React from "react";

const Tutorial: React.FC = () => {
  return (
    <div className="bg-white shadow-xl rounded-[12px] p-4 max-w-md mx-auto mt-10">
      <h1
        className="font-zen text-purple-900 text-3xl relative mb-4"
        style={{
          WebkitTextStroke: "1.5px #74007E", // Matching the style from Settings
        }}
      >
        HOW TO PLAY
      </h1>
      <ul className="list-disc list-inside space-y-2 text-black text-inter text-lg">
        <li>Click on the screen to accelerate your racer.</li>
        <li>Want to go faster? Acquire RiseCrystals by staking ETH.</li>
        <li>
          Spend RiseCrystals to increase your acceleration power (Velocity per
          click).
        </li>
        <li>Become the fastest racer alive (Leaderboards).</li>
      </ul>
    </div>
  );
};

export default Tutorial;
