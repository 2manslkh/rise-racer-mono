import { ethers } from 'ethers';

// --- Contract ABI for Click ---
const riseRacerAddress = "0xcA9Dca22c8528Ff3b8a9F67165fa1F7Cc7ef40d7"


// --- Contract ABI for Rise Racer (Original - keep for other functions) ---
const riseRacerAbi = [
    {
        "inputs": [
            {
                "internalType": "contract Registry",
                "name": "_registry",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "EnforcedPause",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ExpectedPause",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "binder",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "boundAddress",
                "type": "address"
            }
        ],
        "name": "AddressBound",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "binder",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "boundAddress",
                "type": "address"
            }
        ],
        "name": "AddressUnbound",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "velocityGained",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newTotalVelocity",
                "type": "uint256"
            }
        ],
        "name": "Click",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "milestoneId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "milestoneName",
                "type": "string"
            }
        ],
        "name": "MilestoneReached",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Unpaused",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_boundAddress",
                "type": "address"
            }
        ],
        "name": "bindAddress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "click",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "player",
                "type": "address"
            }
        ],
        "name": "getBaseClickPower",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_boundAddress",
                "type": "address"
            }
        ],
        "name": "getBinderAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_binder",
                "type": "address"
            }
        ],
        "name": "getBoundAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "player",
                "type": "address"
            }
        ],
        "name": "getClickPower",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "player",
                "type": "address"
            }
        ],
        "name": "getPlayerInfo",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "velocity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentUniverse",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalClicks",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isStaking",
                        "type": "bool"
                    }
                ],
                "internalType": "struct IRiseRacers.PlayerInfo",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "registry",
        "outputs": [
            {
                "internalType": "contract Registry",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

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
    console.log("🚀 | getCurrentVelocity | playerInfo:", playerInfo)
    // playerInfo structure: [velocity, currentUniverse, totalClicks, isStaking]
    return playerInfo[0]; // Return the velocity component
};

/**
 * Sends a 'click' transaction to the Rise Racer smart contract.
 * Requires a signer to send the transaction.
 * @param signer An ethers Signer instance to sign the transaction.
 * @param nonce The nonce to use for the transaction.
 * @returns A promise that resolves with the transaction response.
 */
export const clickRace = async (
    signer: ethers.Signer,
    nonce: number
): Promise<ethers.ContractTransactionResponse> => { // Removed options, added nonce directly
    if (!signer.provider) {
        throw new Error("Signer must be connected to a Provider to send a transaction.");
    }
    // Use specific click contract details
    const clickContract = new ethers.Contract(
        riseRacerAddress,
        riseRacerAbi,
        signer
    );
    // Pass nonce and gasLimit
    const tx = await clickContract.click({ nonce: nonce, gasLimit: 200000 }); // Added nonce and gasLimit
    return tx;
};

// Potential additional functions based on ABI:
// - getBaseClickPower(playerAddress, provider?)
// - getPlayerInfo(playerAddress, provider?) // Might return the full struct
// - bindAddress(boundAddress, signer)
// - getBinderAddress(boundAddress, provider?)
// - getBoundAddress(binder, provider?)
// - pause(signer)
// - unpause(signer)
// - owner(provider?)
// - paused(provider?)
// - etc.
