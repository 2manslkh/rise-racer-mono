import { ethers, TransactionReceipt } from 'ethers';
import { ENVIRONMENT } from '../configuration/environment';
import { sendRawTransactionSync } from './transaction-utils';

// --- Contract ABI for Click ---
const riseRacerAddress = ENVIRONMENT.RISE_RACER_ADDRESS;


// --- Contract ABI for Rise Racer (Original - keep for other functions) ---
const riseRacerAbi = [{ "type": "constructor", "inputs": [{ "name": "_registry", "type": "address", "internalType": "contract Registry" }], "stateMutability": "nonpayable" }, { "type": "function", "name": "bindAddress", "inputs": [{ "name": "_boundAddress", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "click", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "getBaseClickPower", "inputs": [{ "name": "player", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "getBinderAddress", "inputs": [{ "name": "_boundAddress", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" }, { "type": "function", "name": "getBoundAddress", "inputs": [{ "name": "_binder", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" }, { "type": "function", "name": "getClickPower", "inputs": [{ "name": "player", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "getPlayerInfo", "inputs": [{ "name": "player", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "tuple", "internalType": "struct IRiseRacers.PlayerInfo", "components": [{ "name": "velocity", "type": "uint256", "internalType": "uint256" }, { "name": "currentStage", "type": "uint8", "internalType": "uint8" }, { "name": "currentUniverse", "type": "uint256", "internalType": "uint256" }, { "name": "totalClicks", "type": "uint256", "internalType": "uint256" }, { "name": "isStaking", "type": "bool", "internalType": "bool" }] }], "stateMutability": "view" }, { "type": "function", "name": "owner", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" }, { "type": "function", "name": "pause", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "paused", "inputs": [], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "view" }, { "type": "function", "name": "registry", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "contract Registry" }], "stateMutability": "view" }, { "type": "function", "name": "renounceOwnership", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "transferOwnership", "inputs": [{ "name": "newOwner", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "unpause", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }, { "type": "event", "name": "AddressBound", "inputs": [{ "name": "binder", "type": "address", "indexed": true, "internalType": "address" }, { "name": "boundAddress", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false }, { "type": "event", "name": "AddressUnbound", "inputs": [{ "name": "binder", "type": "address", "indexed": true, "internalType": "address" }, { "name": "boundAddress", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false }, { "type": "event", "name": "Click", "inputs": [{ "name": "player", "type": "address", "indexed": true, "internalType": "address" }, { "name": "velocityGained", "type": "uint256", "indexed": false, "internalType": "uint256" }, { "name": "newTotalVelocity", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false }, { "type": "event", "name": "MilestoneReached", "inputs": [{ "name": "player", "type": "address", "indexed": true, "internalType": "address" }, { "name": "milestoneId", "type": "uint256", "indexed": false, "internalType": "uint256" }, { "name": "milestoneName", "type": "string", "indexed": false, "internalType": "string" }], "anonymous": false }, { "type": "event", "name": "OwnershipTransferred", "inputs": [{ "name": "previousOwner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "newOwner", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false }, { "type": "event", "name": "Paused", "inputs": [{ "name": "account", "type": "address", "indexed": false, "internalType": "address" }], "anonymous": false }, { "type": "event", "name": "Unpaused", "inputs": [{ "name": "account", "type": "address", "indexed": false, "internalType": "address" }], "anonymous": false }, { "type": "error", "name": "EnforcedPause", "inputs": [] }, { "type": "error", "name": "ExpectedPause", "inputs": [] }, { "type": "error", "name": "OwnableInvalidOwner", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }] }, { "type": "error", "name": "OwnableUnauthorizedAccount", "inputs": [{ "name": "account", "type": "address", "internalType": "address" }] }, { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] }];

// --- Helper to get Rise Racer Contract Instance ---
// Assumes a browser environment with window.ethereum (e.g., MetaMask)
const getRiseRacerContract = async (signerOrProvider?: ethers.Signer | ethers.Provider): Promise<ethers.Contract> => {
    let provider: ethers.Provider;
    let signer: ethers.Signer | null = null;

    if (signerOrProvider) {
        // Check if it's a Signer instance (has getAddress method)
        if (
            typeof (signerOrProvider as ethers.Signer).getAddress === 'function'
        ) {
            signer = signerOrProvider as ethers.Signer;
            if (!signer.provider) {
                throw new Error("Signer must be connected to a Provider.");
            }
            provider = signer.provider;
        } else {
            provider = signerOrProvider as ethers.Provider;
        }
    } else {
        // Fallback or server-side scenario: Use a default provider (e.g., Infura, Alchemy)
        // Replace with your preferred provider setup
        console.warn("No signer/provider passed and window.ethereum not found. Using default provider.");
        // Example: provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
        // For now, we throw an error as a default provider isn't set up
        throw new Error("Provider configuration missing.");
    }

    // If a signer is available, use it; otherwise, use the provider for read-only access
    const contract = new ethers.Contract(riseRacerAddress, riseRacerAbi, signer ?? provider); // Use renamed constant
    return contract

};

/**
 * Gets the click power (velocity gained per click) for a specific player.
 * @param playerAddress The address of the player.
 * @param provider Optional: An ethers Provider for read-only access.
 * @returns A promise that resolves with the click power (as bigint).
 */
export const getVelocityPerClick = async (playerAddress: string, provider?: ethers.Provider): Promise<bigint> => {
    // Pass only the provider if available, otherwise let getRiseRacerContract handle default/signer logic
    const contract = await getRiseRacerContract(provider);
    return contract.getClickPower(playerAddress);
};

/**
 * Gets the current velocity of the specified player.
 * @param playerAddress The address of the player.
 * @param provider Optional: An ethers Provider for read-only access.
 * @returns A promise that resolves with the player's current velocity (as bigint).
 */
export const getCurrentVelocity = async (playerAddress: string, provider?: ethers.Provider): Promise<bigint> => {

    // Pass only the provider if available, otherwise let getRiseRacerContract handle default/signer logic
    const contract = await getRiseRacerContract(provider);
    const playerInfo = await contract.getPlayerInfo(playerAddress);
    // playerInfo structure: [velocity, currentUniverse, totalClicks, isStaking]
    return playerInfo[0]; // Return the velocity component
};

/**
 * Sends a 'click' transaction to the Rise Racer smart contract.
 * Requires a signer to send the transaction.
 * @param signer An ethers Signer instance to sign the transaction.
 * @param nonce The nonce to use for the transaction.
 * @returns A promise that resolves with the transaction hash.
 * 
 * @example
 * // Example usage with transaction tracker:
 * const txHash = await clickRace(signer, nonce);
 * // Track the transaction using the hash
 * const trackingId = trackTxByHash(txHash, "Race Click");
 */
export const clickRace = async (
    signer: ethers.Signer,
    nonce: number,
): Promise<TransactionReceipt> => {
    if (!signer.provider) {
        throw new Error("Signer must be connected to a Provider to send a transaction.");
    }
    const clickContract = new ethers.Contract(
        riseRacerAddress,
        riseRacerAbi,
        signer
    );

    const signedTx = await clickContract.click.populateTransaction(
        {
            nonce: nonce,
            gasLimit: 400000,
            chainId: ENVIRONMENT.CHAIN_ID,
            gasPrice: ENVIRONMENT.DEFAULT_GAS_PRICE
        }
    );

    const signedTxData = await signer.signTransaction(signedTx);

    const receipt = await sendRawTransactionSync(signer.provider as ethers.JsonRpcProvider, signedTxData);

    return receipt; // Return the transaction response
};

