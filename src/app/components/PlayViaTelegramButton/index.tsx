"use client";

import { useHotWallet } from "@/app/context/HotWalletContext";
import { useTMA } from "@/app/context/TelegramContext";
import React from "react";

type PlayViaTelegramButtonProps = Record<string, never>;

const PlayViaTelegramButton: React.FC<
  PlayViaTelegramButtonProps
> = (/*{ onClick }*/) => {
  const { loadHotWallet } = useHotWallet();
  const { authenticate } = useTMA();
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <button
        onClick={async () => {
          // TODO: Implement Telegram linking/login functionality
          console.log("Play via Telegram button clicked");
          await authenticate();
          loadHotWallet();
        }}
        className="px-6 py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50"
      >
        Play via Telegram
      </button>
      <p className="mt-4 text-sm text-gray-400">Link your account to play.</p>
    </div>
  );
};

export default PlayViaTelegramButton;
