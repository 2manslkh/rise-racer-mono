"use client";
import { useState, useEffect, useRef } from "react";
import { TransactionRecord } from "@/app/lib/transaction-tracker";

interface TransactionLogsProps {
  transactions: TransactionRecord[];
  address: string | null | undefined; // User's address to check login status
}

const TransactionLogs: React.FC<TransactionLogsProps> = ({
  transactions,
  address,
}) => {
  const [expanded, setExpanded] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Filter transactions older than 15 seconds and sort
  const recentSortedTransactions = [...transactions]
    .filter((tx) => Date.now() - tx.timestamp <= 15000) // Keep only last 15s
    .sort((a, b) => a.timestamp - b.timestamp); // Oldest first for display

  // Get transactions for the current view (compact or expanded)
  const visibleTransactions = expanded
    ? recentSortedTransactions
    : recentSortedTransactions.slice(-5);

  // Auto update the "seconds ago" display for transaction logs
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render every second to update time displays
      if (recentSortedTransactions.length > 0) {
        setForceUpdate((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [recentSortedTransactions.length]); // Depend on the filtered length

  // Scroll transaction log to bottom when new transactions come in or view changes
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [visibleTransactions, expanded]); // Depend on the visible transactions

  // Format a transaction message
  const formatTxMessage = (tx: TransactionRecord) => {
    const truncatedHash = `0x${tx.hash.slice(2, 6)}`;
    const blockNumber = tx.receipt?.blockNumber || "---";

    let timeDisplay;
    if (tx.status === "mined" && tx.minedTimestamp) {
      const confirmationTime = (tx.minedTimestamp - tx.timestamp) / 1000;
      timeDisplay = `${confirmationTime.toFixed(1)}s confirm`;
    } else {
      const timeSinceSent = ((Date.now() - tx.timestamp) / 1000).toFixed(1);
      timeDisplay = `${timeSinceSent}s`;
    }

    let status = "pending";
    if (tx.status === "mined") status = "mined";
    else if (tx.status === "failed") status = "failed";
    else if (tx.status === "dropped") status = "dropped";

    return (
      <div
        key={`${tx.hash}-${forceUpdate}`} // Include forceUpdate in key for re-render
        className="font-mono text-xs leading-tight mb-0 whitespace-nowrap"
      >
        <span className="text-white">
          Tx {truncatedHash} | {blockNumber} | {timeDisplay}
        </span>{" "}
        {tx.status !== "mined" && (
          <span className="text-white opacity-80">({status})</span>
        )}
      </div>
    );
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Only render if logged in and there are transactions to show
  if (!address || recentSortedTransactions.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-[140px] left-4 z-50">
      <div className="flex flex-col transition-all duration-300 px-2 py-1">
        <div
          ref={logRef}
          className="overflow-y-auto"
          style={{ maxHeight: expanded ? "10rem" : "8rem" }}
        >
          {visibleTransactions.map((tx) => formatTxMessage(tx))}
        </div>

        {!expanded && recentSortedTransactions.length > 5 && (
          <div
            className="text-center text-xs text-white mt-1 cursor-pointer opacity-70 hover:opacity-100"
            onClick={toggleExpanded}
          >
            + {recentSortedTransactions.length - 5} more
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionLogs;
