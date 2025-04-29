import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import {
    getTransactionTracker,
    trackTransaction,
    trackTransactionByHash,
    initiatePendingTransaction,
    updatePendingTransaction,
    removePendingTransaction,
    TransactionRecord,
    TransactionCallback,
} from "../lib/transaction-tracker";
import { useToast } from "./useToast";

export type TransactionState = "idle" | "pending" | "success" | "error";

interface UseTransactionTrackerResult {
    trackTx: (
        tx: ethers.ContractTransactionResponse,
        description?: string
    ) => string;
    trackTxByHash: (
        txHash: string,
        description?: string
    ) => string;
    initiateTx: (description: string) => string;
    updateTx: (
        placeholderHash: string,
        txOrHash: ethers.ContractTransactionResponse | ethers.TransactionReceipt | string,
        callbacks?: TransactionCallback
    ) => void;
    removeTx: (placeholderHash: string) => void;
    transactions: TransactionRecord[];
    pendingTransactions: TransactionRecord[];
    clearAllTransactions: () => void;
    clearCompletedTransactions: () => void;
}

/**
 * A hook for tracking blockchain transactions, supporting optimistic updates.
 * @returns Methods for tracking and querying transactions
 */
export const useTransactionTracker = (): UseTransactionTrackerResult => {
    const toast = useToast();
    const [transactions, setTransactions] = useState<TransactionRecord[]>([]);

    // Poll for transaction updates (this now just reads from the singleton tracker)
    useEffect(() => {
        const fetchTransactions = () => {
            // Get tracker instance (implicitly initialized with WS provider elsewhere)
            const tracker = getTransactionTracker();
            const allTx = tracker.getAllTransactions(); // Already sorted & limited by tracker
            setTransactions(allTx);
        };

        // Initial fetch
        fetchTransactions();

        // Set up polling
        const intervalId = setInterval(fetchTransactions, 50); // Keep polling interval reasonable

        // Clean up
        return () => clearInterval(intervalId);
    }, []);

    // Track a transaction with default notifications
    const trackTx = useCallback(
        (
            tx: ethers.ContractTransactionResponse,
            description: string = "Transaction"
        ): string => {
            // Default callbacks with toast notifications
            const callbacks: TransactionCallback = {
                onFailed: (error) => {
                    toast.error(`${description} failed: ${error.message}`);
                },
                onDropped: () => {
                    toast.error(`${description} was dropped from the network`);
                },
            };

            // Track the transaction
            return trackTransaction(tx, description, callbacks);
        },
        [toast]
    );

    // Track a transaction by hash (for use with sendRawTransactionSync)
    const trackTxByHash = useCallback(
        (
            txHash: string,
            description: string = "Transaction"
        ): string => {
            // Default callbacks with toast notifications
            const callbacks: TransactionCallback = {
                onFailed: (error) => {
                    toast.error(`${description} failed: ${error.message}`);
                },
                onDropped: () => {
                    toast.error(`${description} was dropped from the network`);
                },
            };

            // Track the transaction by hash
            return trackTransactionByHash(txHash, description, callbacks);
        },
        [toast]
    );

    // Optimistic Tracking
    const initiateTx = useCallback((description: string): string => {
        return initiatePendingTransaction(description);
    }, []);

    const updateTx = useCallback(
        (
            placeholderHash: string,
            txOrHash: ethers.ContractTransactionResponse | ethers.TransactionReceipt | string,
            callbacks?: TransactionCallback
        ) => {
            updatePendingTransaction(placeholderHash, txOrHash, callbacks);
        },
        []
    );

    const removeTx = useCallback((placeholderHash: string) => {
        removePendingTransaction(placeholderHash);
    }, []);

    const clearAllTransactions = useCallback(() => {
        const tracker = getTransactionTracker();
        tracker.clearAll();
        setTransactions([]);
    }, []);

    const clearCompletedTransactions = useCallback(() => {
        const tracker = getTransactionTracker();
        tracker.clearCompleted();
        setTransactions(tracker.getAllTransactions());
    }, []);

    const pendingTransactions = transactions.filter(
        (tx) => tx.status === "pending"
    );

    return {
        trackTx,
        trackTxByHash,
        initiateTx,
        updateTx,
        removeTx,
        transactions,
        pendingTransactions,
        clearAllTransactions,
        clearCompletedTransactions,
    };
};

// Export the type for use in other components
export type { TransactionCallback }; 