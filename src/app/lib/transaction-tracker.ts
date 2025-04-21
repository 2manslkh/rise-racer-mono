import { ethers } from "ethers";

type TransactionStatus = "pending" | "mined" | "failed" | "dropped";

interface TransactionRecord {
    hash: string;
    description: string;
    status: TransactionStatus;
    timestamp: number; // Time the transaction was added/sent
    minedTimestamp?: number; // Time the transaction was confirmed
    receipt?: ethers.TransactionReceipt;
    error?: Error;
}

interface TransactionCallback {
    onMined?: (receipt: ethers.TransactionReceipt) => void;
    onFailed?: (error: Error) => void;
    onDropped?: () => void;
}

class TransactionTracker {
    private transactions: Record<string, TransactionRecord> = {};
    private callbacks: Record<string, TransactionCallback> = {};
    private provider: ethers.Provider | ethers.WebSocketProvider | null = null;
    private webSocketProvider: ethers.WebSocketProvider | null = null;
    private pollingInterval: number = 250; // 5 seconds by default
    private storageKey: string = "rise_tx_tracker";
    private pollingTimer: NodeJS.Timeout | null = null;
    private isWebSocketProvider: boolean = false; // Flag for provider type

    constructor(provider?: ethers.Provider | ethers.WebSocketProvider, pollingInterval?: number) {
        if (provider) {
            this.setProvider(provider);
        }

        if (pollingInterval) {
            this.pollingInterval = pollingInterval;
        }

        // Load persisted transactions from storage
        this.loadFromStorage();
    }

    /**
     * Set the provider to use for transaction tracking
     * @param provider An ethers Provider instance (can be WebSocketProvider)
     */
    public setProvider(provider: ethers.Provider | ethers.WebSocketProvider): void {
        // Disconnect previous provider if it was a WebSocket
        if (this.provider && this.isWebSocketProvider) {
            try {
                (this.provider as ethers.WebSocketProvider).destroy();
            } catch (e) { console.warn("Error destroying previous WebSocket provider:", e); }
        }

        this.provider = provider;
        // Check if it's a WebSocketProvider by checking for the destroy method
        this.isWebSocketProvider = typeof (provider as ethers.WebSocketProvider).destroy === 'function';

        console.log(`TransactionTracker using ${this.isWebSocketProvider ? 'WebSocket' : 'HTTP'} provider.`);

        // Start polling (or re-start if provider changed)
        this.startPolling();
    }

    /**
     * Track a transaction and add it to the tracking system
     * @param tx The transaction response from sending a transaction
     * @param description Optional description of the transaction
     * @param callbacks Optional callbacks for transaction events
     * @returns The transaction hash
     */
    public track(
        tx: ethers.ContractTransactionResponse,
        description: string = "Transaction",
        callbacks?: TransactionCallback
    ): string {
        const txRecord: TransactionRecord = {
            hash: tx.hash,
            description,
            status: "pending",
            timestamp: Date.now(),
        };

        this.transactions[tx.hash] = txRecord;

        if (callbacks) {
            this.callbacks[tx.hash] = callbacks;
        }

        // Persist to storage
        this.saveToStorage();

        // Start polling if not already polling
        if (this.provider && !this.pollingTimer) {
            this.startPolling();
        }

        // Set up the one-time listener for this transaction
        tx.wait().then(
            (receipt) => {
                this.updateTransactionStatus(tx.hash, "mined", receipt || undefined);
            },
            (error) => {
                this.updateTransactionStatus(tx.hash, "failed", undefined, error);
            }
        );

        return tx.hash;
    }

    /**
     * Get all transactions being tracked
     * @returns Array of transaction records
     */
    public getAllTransactions(): TransactionRecord[] {
        const allTransactions = Object.values(this.transactions);
        // Sort by timestamp (newest first) and limit to most recent 20
        return allTransactions
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 20);
    }

    /**
     * Get pending transactions
     * @returns Array of pending transaction records
     */
    public getPendingTransactions(): TransactionRecord[] {
        return Object.values(this.transactions).filter(
            (tx) => tx.status === "pending"
        );
    }

    /**
     * Get a specific transaction by hash
     * @param hash The transaction hash
     * @returns The transaction record or undefined if not found
     */
    public getTransaction(hash: string): TransactionRecord | undefined {
        return this.transactions[hash];
    }

    /**
     * Clear all transactions from tracker
     */
    public clearAll(): void {
        this.transactions = {};
        this.callbacks = {};
        this.saveToStorage();

        if (this.pollingTimer) {
            clearInterval(this.pollingTimer);
            this.pollingTimer = null;
        }
    }

    /**
     * Clear completed transactions (mined, failed, dropped)
     */
    public clearCompleted(): void {
        const pendingTxs: Record<string, TransactionRecord> = {};
        const pendingCallbacks: Record<string, TransactionCallback> = {};

        Object.entries(this.transactions).forEach(([hash, tx]) => {
            if (tx.status === "pending") {
                pendingTxs[hash] = tx;
                if (this.callbacks[hash]) {
                    pendingCallbacks[hash] = this.callbacks[hash];
                }
            }
        });

        this.transactions = pendingTxs;
        this.callbacks = pendingCallbacks;
        this.saveToStorage();

        // Stop polling if no pending transactions
        if (Object.keys(pendingTxs).length === 0 && this.pollingTimer) {
            clearInterval(this.pollingTimer);
            this.pollingTimer = null;
        }
    }

    /**
     * Immediately adds a transaction with a placeholder hash and 'pending' status.
     * Returns the placeholder hash used.
     */
    public initiatePendingTransaction(description: string): string {
        const placeholderHash = `-----${Date.now()}-${Math.random()}`;
        const txRecord: TransactionRecord = {
            hash: placeholderHash,
            description,
            status: "pending",
            timestamp: Date.now(),
        };
        this.transactions[placeholderHash] = txRecord;
        this.saveToStorage();
        // Trigger state update in hook if needed (e.g., by calling a passed callback or relying on polling)
        return placeholderHash;
    }

    /**
     * Updates a pending transaction (identified by placeholderHash) with the real transaction details.
     */
    public updatePendingTransaction(
        placeholderHash: string,
        tx: ethers.ContractTransactionResponse,
        callbacks?: TransactionCallback
    ): void {
        const existingRecord = this.transactions[placeholderHash];
        if (!existingRecord || existingRecord.status !== 'pending') {
            console.warn(`Optimistic transaction ${placeholderHash} not found or not pending.`);
            // Optionally, still track the real transaction if placeholder is missing
            // this.track(tx, existingRecord?.description || 'Transaction', callbacks);
            return;
        }

        // Remove the placeholder entry
        delete this.transactions[placeholderHash];

        // Add the real transaction entry
        const realHash = tx.hash;
        const txRecord: TransactionRecord = {
            ...existingRecord, // Keep original description and timestamp
            hash: realHash,
            status: "pending", // Still pending until confirmed
            minedTimestamp: undefined, // Reset just in case
            receipt: undefined,
            error: undefined,
        };
        this.transactions[realHash] = txRecord;

        // Associate callbacks with the real hash
        if (callbacks) {
            this.callbacks[realHash] = callbacks;
        }
        // Also copy callbacks from placeholder if they existed (might not be needed with current setup)
        // if (this.callbacks[placeholderHash]) {
        //     this.callbacks[realHash] = this.callbacks[placeholderHash];
        //     delete this.callbacks[placeholderHash];
        // }

        // Save changes
        this.saveToStorage();

        // Start polling if needed
        if (this.provider && !this.pollingTimer) {
            this.startPolling();
        }

        // Set up the listener for the *real* transaction
        tx.wait(0).then(
            (receipt) => {
                this.updateTransactionStatus(realHash, "mined", receipt || undefined);
            },
            (error) => {
                // Check if it's an ethers error with specific codes
                if (error && typeof error === 'object' && 'code' in error) {
                    const ethersError = error as { code: string; reason?: string }; // Type assertion

                    if (ethersError.code === 'TRANSACTION_REPLACED') {
                        if (ethersError.reason === 'cancelled') {
                            this.updateTransactionStatus(realHash, "dropped", undefined, error as Error);
                        } else { // 'replaced' or other reasons
                            this.updateTransactionStatus(realHash, "dropped", undefined, error as Error);
                        }
                    } else {
                        // Handle other ethers errors or general errors
                        this.updateTransactionStatus(realHash, "failed", undefined, error as Error);
                    }
                } else {
                    // Handle non-ethers errors or errors without a code
                    this.updateTransactionStatus(realHash, "failed", undefined, error as Error);
                }
            }
        );
    }

    /**
     * Removes a transaction record using its (placeholder) hash.
     */
    public removePendingTransaction(placeholderHash: string): void {
        if (this.transactions[placeholderHash]) {
            delete this.transactions[placeholderHash];
            // Remove associated callbacks if any
            if (this.callbacks[placeholderHash]) {
                delete this.callbacks[placeholderHash];
            }
            this.saveToStorage();
        } else {
            console.warn(`Attempted to remove non-existent pending transaction: ${placeholderHash}`);
        }
    }

    /**
     * Removes a single transaction record by its hash.
     * @param hash The hash of the transaction to remove.
     */
    private removeTransaction(hash: string): void {
        if (this.transactions[hash]) {
            delete this.transactions[hash];
            if (this.callbacks[hash]) {
                delete this.callbacks[hash];
            }
            this.saveToStorage(); // Persist the removal
            console.log(`Transaction ${hash} automatically removed after completion.`);
        }
    }

    private updateTransactionStatus(
        hash: string,
        status: TransactionStatus,
        receipt?: ethers.TransactionReceipt,
        error?: Error
    ): void {
        const tx = this.transactions[hash];
        // Prevent duplicate updates if status is already terminal
        if (!tx || (tx.status !== 'pending')) {
            console.log(`Skipping update for ${hash}: current status ${tx?.status}, new status ${status}`);
            return;
        }

        console.log(`Updating transaction ${hash} to status: ${status}`);
        tx.status = status;

        if (receipt) {
            tx.receipt = receipt;
        }
        if (status === "mined") {
            tx.minedTimestamp = Date.now(); // Record confirmation time
        }

        if (error) {
            tx.error = error;
        }

        // Persist changes
        this.saveToStorage(); // Ensure updated record is saved

        // Trigger callbacks
        const callback = this.callbacks[hash];
        if (callback) {
            if (status === "mined" && callback.onMined && receipt) {
                callback.onMined(receipt);
            } else if (status === "failed" && callback.onFailed && error) {
                callback.onFailed(error);
            } else if (status === "dropped" && callback.onDropped) {
                callback.onDropped();
            }
        }

        // Schedule removal after 8 seconds for terminal states
        if (status === "mined" || status === "failed" || status === "dropped") {
            setTimeout(() => {
                this.removeTransaction(hash);
            }, 8000); // 8 seconds
        }
    }

    private async checkPendingTransactions(): Promise<void> {
        if (!this.provider) return;
        console.log("🚀 | TransactionTracker | checkPendingTransactions | this.provider:", this.provider)

        const pendingTxs = this.getPendingTransactions();

        if (pendingTxs.length === 0) {
            if (this.pollingTimer) {
                clearInterval(this.pollingTimer);
                this.pollingTimer = null;
            }
            return;
        }

        // Check each pending transaction
        for (const tx of pendingTxs) {
            try {
                const receipt = await this.provider.getTransactionReceipt(tx.hash);

                if (receipt) {
                    // Transaction has been mined
                    if (receipt.status === 0) {
                        // Transaction failed on-chain
                        this.updateTransactionStatus(tx.hash, "failed", receipt);
                    } else {
                        // Transaction succeeded
                        this.updateTransactionStatus(tx.hash, "mined", receipt);

                        // Fetch and log the current block number for context
                        console.log(`Transaction ${tx.hash} mined in block #${receipt.blockNumber}`);
                    }
                } else {
                    // Still pending, check if it might have been dropped
                    // This is a simple heuristic - in a production system, you might
                    // want more sophisticated detection of dropped transactions
                    const timestamp = tx.timestamp;
                    const now = Date.now();

                    // If pending for more than 10 minutes, consider it dropped
                    if (now - timestamp > 10 * 60 * 1000) {
                        this.updateTransactionStatus(tx.hash, "dropped");
                    }
                }
            } catch (error) {
                console.error(`Error checking transaction ${tx.hash}:`, error);
            }
        }
    }

    private startPolling(): void {
        if (this.pollingTimer) {
            clearInterval(this.pollingTimer);
        }

        this.pollingTimer = setInterval(() => {
            this.checkPendingTransactions();
        }, this.pollingInterval);

        // Also check immediately
        this.checkPendingTransactions();
    }

    private saveToStorage(): void {
        if (typeof window === "undefined") return;

        // Get all transactions and limit to 20 most recent ones
        const allTransactions = Object.values(this.transactions)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 20);

        // Convert back to record object
        const limitedTransactions: Record<string, TransactionRecord> = {};
        allTransactions.forEach(tx => {
            limitedTransactions[tx.hash] = tx;
        });

        // Update the transactions object
        this.transactions = limitedTransactions;

        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.transactions));
        } catch (error) {
            console.error("Failed to save transactions to storage:", error);
        }
    }

    private loadFromStorage(): void {
        if (typeof window !== "undefined") {
            try {
                const storedData = localStorage.getItem(this.storageKey);
                if (storedData) {
                    const parsedData = JSON.parse(storedData) as Omit<TransactionRecord, "receipt">[];

                    parsedData.forEach(tx => {
                        this.transactions[tx.hash] = {
                            ...tx,
                            // Rehydrate as pending if it was still pending when saved
                            status: tx.status === "pending" ? "pending" : tx.status
                        };
                    });

                    // Start polling if we have pending transactions
                    if (this.provider && this.getPendingTransactions().length > 0) {
                        this.startPolling();
                    }
                }
            } catch (error) {
                console.error("Failed to load transactions from storage:", error);
            }
        }
    }

    /** Gets the current provider instance (internal use or for testing) */
    public getProvider(): ethers.Provider | ethers.WebSocketProvider | null {
        return this.provider;
    }
}

// Create a singleton instance
let instance: TransactionTracker | null = null;
let webSocketProviderInstance: ethers.WebSocketProvider | null = null; // Hold the WebSocket provider

/**
 * Get the transaction tracker instance.
 * Initializes with a WebSocketProvider if the URL is available.
 * @param wsUrl Optional WebSocket URL. If provided, ensures the tracker uses it.
 * @param pollingInterval Optional polling interval in milliseconds
 * @returns The transaction tracker instance
 */
export const getTransactionTracker = (
    wsUrl?: string,
    pollingInterval?: number
): TransactionTracker => {
    let webSocketProviderChanged = false;
    let newWebSocketProvider: ethers.WebSocketProvider | null = null;

    // --- Step 1: Determine if WebSocket provider needs creation/update --- 
    if (wsUrl && typeof window !== 'undefined') {
        if (!webSocketProviderInstance || (webSocketProviderInstance.websocket as WebSocket).url !== wsUrl) {
            try {
                // Ensure old provider is destroyed if URL changes or it exists
                if (webSocketProviderInstance) webSocketProviderInstance.destroy();

                newWebSocketProvider = new ethers.WebSocketProvider(wsUrl);
                console.log("Created/Recreated WebSocketProvider instance.");
                webSocketProviderChanged = true;

                // Attach listeners (casting internal websocket to standard WebSocket)
                const ws = newWebSocketProvider.websocket as WebSocket;
                ws.onopen = () => console.log('WS Opened');
                ws.onclose = (event: CloseEvent) => console.log('WS Closed:', event.code, event.reason);
                ws.onerror = (err) => console.error('WS Error:', err);

                webSocketProviderInstance = newWebSocketProvider; // Update the singleton reference

            } catch (e) {
                console.error("Failed to create/recreate WebSocketProvider:", e);
                webSocketProviderInstance = null; // Reset on failure
                newWebSocketProvider = null;
                webSocketProviderChanged = false; // Failed to change
            }
        }
    }

    // --- Step 2: Manage TransactionTracker instance --- 
    if (!instance) {
        // Create tracker instance, using the new WS provider if available, otherwise undefined
        instance = new TransactionTracker(newWebSocketProvider ?? undefined, pollingInterval);
        console.log("Created new TransactionTracker instance.");
    } else if (webSocketProviderChanged && newWebSocketProvider) {
        // If tracker instance exists and WS provider was successfully changed, update the tracker's provider
        instance.setProvider(newWebSocketProvider);
        console.log("Updated existing TransactionTracker instance with new WebSocketProvider.");
    } else if (webSocketProviderInstance && !webSocketProviderChanged && !instance.getProvider()) {
        // Edge case: Instance exists, WS URL matches, but tracker has no provider (e.g. initial load failed?)
        // Try setting the existing WS provider.
        instance.setProvider(webSocketProviderInstance);
        console.log("Set existing WebSocketProvider on TransactionTracker instance that lacked one.")
    }

    return instance;
};

/**
 * Standard: Track a transaction after it has been sent.
 */
export const trackTransaction = (
    tx: ethers.ContractTransactionResponse,
    description?: string,
    callbacks?: TransactionCallback
): string => {
    return getTransactionTracker().track(tx, description, callbacks);
};

/**
 * Optimistic: Immediately add a pending transaction placeholder.
 */
export const initiatePendingTransaction = (description: string): string => {
    return getTransactionTracker().initiatePendingTransaction(description);
};

/**
 * Optimistic: Update a placeholder transaction with the real transaction details.
 */
export const updatePendingTransaction = (
    placeholderHash: string,
    tx: ethers.ContractTransactionResponse,
    callbacks?: TransactionCallback
): void => {
    getTransactionTracker().updatePendingTransaction(placeholderHash, tx, callbacks);
};

/**
 * Optimistic: Remove a placeholder transaction.
 */
export const removePendingTransaction = (placeholderHash: string): void => {
    getTransactionTracker().removePendingTransaction(placeholderHash);
};

export type { TransactionStatus, TransactionRecord, TransactionCallback }; 