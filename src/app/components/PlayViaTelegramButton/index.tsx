"use client";

import React from "react";

type PlayViaTelegramButtonProps = Record<string, never>;

const PlayViaTelegramButton: React.FC<
  PlayViaTelegramButtonProps
> = (/*{ onClick }*/) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <button
        onClick={() => {
          // TODO: Implement Telegram linking/login functionality
          console.log("Play via Telegram button clicked");
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
