"use client";

import { useState } from "react";
import { useTransactionTracker } from "../../hooks/useTransactionTracker";

const TransactionList = () => {
  const {
    transactions,
    pendingTransactions,
    clearAllTransactions,
    clearCompletedTransactions,
  } = useTransactionTracker();
  const [expanded, setExpanded] = useState(false);

  if (transactions.length === 0) {
    return null;
  }

  // Format timestamp to human readable time
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Format status with color coding
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-500 bg-opacity-20 text-yellow-500 rounded text-xs">
            Pending
          </span>
        );
      case "mined":
        return (
          <span className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-500 rounded text-xs">
            Completed
          </span>
        );
      case "failed":
        return (
          <span className="px-2 py-1 bg-red-500 bg-opacity-20 text-red-500 rounded text-xs">
            Failed
          </span>
        );
      case "dropped":
        return (
          <span className="px-2 py-1 bg-gray-500 bg-opacity-20 text-gray-500 rounded text-xs">
            Dropped
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-500 bg-opacity-20 text-gray-500 rounded text-xs">
            {status}
          </span>
        );
    }
  };

  // Shortern transaction hash for display
  const shortenHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <div className="bg-[#1a1a2e] rounded-lg p-4 mt-4">
      {/* Header with Pending Count */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-white">Transactions</h2>
          {pendingTransactions.length > 0 && (
            <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
              {pendingTransactions.length} pending
            </span>
          )}
        </div>
        <button className="text-white opacity-70 hover:opacity-100">
          {expanded ? "▲" : "▼"}
        </button>
      </div>

      {/* Transaction List (Expandable) */}
      {expanded && (
        <div className="mt-3 space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.hash}
              className={`border border-gray-800 rounded-md p-3 ${
                tx.status === "pending" ? "bg-gray-900" : ""
              }`}
            >
              <div className="flex justify-between">
                <div className="text-gray-300 font-medium">
                  {tx.description}
                </div>
                {getStatusLabel(tx.status)}
              </div>

              <div className="text-gray-500 text-sm mt-1">
                <a
                  href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-400"
                >
                  {shortenHash(tx.hash)}
                </a>
                <span className="mx-2">•</span>
                <span>{formatTime(tx.timestamp)}</span>
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={clearCompletedTransactions}
              className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold py-1 px-2 rounded"
            >
              Clear Completed
            </button>
            <button
              onClick={clearAllTransactions}
              className="bg-red-900 hover:bg-red-800 text-white text-xs font-bold py-1 px-2 rounded"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
