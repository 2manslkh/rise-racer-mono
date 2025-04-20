import { ethers } from 'ethers';
import { ENVIRONMENT } from '../configuration/environment';
import { trackTransaction } from "./transaction-tracker";

// --- Cosmic Parts Contract Address ---
const cosmicPartAddress = ENVIRONMENT.COSMIC_PART_ADDRESS;

// --- Cosmic Parts Contract ABI ---
const cosmicPartAbi = [{ "type": "constructor", "inputs": [{ "name": "_registryAddress", "type": "address", "internalType": "address" }], "stateMutability": "nonpayable" }, { "type": "function", "name": "CHASSIS_BASE_COST", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "CHASSIS_BASE_VELOCITY", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "CHASSIS_GROWTH_FACTOR", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "DECIMAL_SCALE", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "ENGINE_BASE_COST", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "ENGINE_BASE_VELOCITY", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "ENGINE_GROWTH_FACTOR", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "TURBO_BASE_COST", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "TURBO_BASE_VELOCITY", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "TURBO_GROWTH_FACTOR", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "WHEEL_BASE_COST", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "WHEEL_BASE_VELOCITY", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "WHEEL_GROWTH_FACTOR", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "approve", "inputs": [{ "name": "to", "type": "address", "internalType": "address" }, { "name": "tokenId", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "balanceOf", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "equippedParts", "inputs": [{ "name": "", "type": "address", "internalType": "address" }, { "name": "", "type": "uint8", "internalType": "enum CosmicParts.PartType" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "getApproved", "inputs": [{ "name": "tokenId", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" }, { "type": "function", "name": "getChassisCost", "inputs": [{ "name": "level", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "pure" }, { "type": "function", "name": "getChassisVelocity", "inputs": [{ "name": "level", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "pure" }, { "type": "function", "name": "getEngineCost", "inputs": [{ "name": "level", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "pure" }, { "type": "function", "name": "getEngineVelocity", "inputs": [{ "name": "level", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "pure" }, { "type": "function", "name": "getPartData", "inputs": [{ "name": "tokenId", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "tuple", "internalType": "struct CosmicParts.CosmicPart", "components": [{ "name": "partType", "type": "uint8", "internalType": "enum CosmicParts.PartType" }, { "name": "level", "type": "uint256", "internalType": "uint256" }] }], "stateMutability": "view" }, { "type": "function", "name": "getTotalBoost", "inputs": [{ "name": "player", "type": "address", "internalType": "address" }], "outputs": [{ "name": "totalPower", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "getTurboCost", "inputs": [{ "name": "level", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "pure" }, { "type": "function", "name": "getTurboVelocity", "inputs": [{ "name": "level", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "pure" }, { "type": "function", "name": "getWheelCost", "inputs": [{ "name": "level", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "pure" }, { "type": "function", "name": "getWheelVelocity", "inputs": [{ "name": "level", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "pure" }, { "type": "function", "name": "isApprovedForAll", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }, { "name": "operator", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "view" }, { "type": "function", "name": "mintedSupply", "inputs": [{ "name": "", "type": "uint8", "internalType": "enum CosmicParts.PartType" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "name", "inputs": [], "outputs": [{ "name": "", "type": "string", "internalType": "string" }], "stateMutability": "view" }, { "type": "function", "name": "owner", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" }, { "type": "function", "name": "ownerOf", "inputs": [{ "name": "tokenId", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" }, { "type": "function", "name": "registry", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "contract IRegistry" }], "stateMutability": "view" }, { "type": "function", "name": "renounceOwnership", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "safeTransferFrom", "inputs": [{ "name": "from", "type": "address", "internalType": "address" }, { "name": "to", "type": "address", "internalType": "address" }, { "name": "tokenId", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "safeTransferFrom", "inputs": [{ "name": "from", "type": "address", "internalType": "address" }, { "name": "to", "type": "address", "internalType": "address" }, { "name": "tokenId", "type": "uint256", "internalType": "uint256" }, { "name": "data", "type": "bytes", "internalType": "bytes" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "setApprovalForAll", "inputs": [{ "name": "operator", "type": "address", "internalType": "address" }, { "name": "approved", "type": "bool", "internalType": "bool" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "setBaseURI", "inputs": [{ "name": "uri", "type": "string", "internalType": "string" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "supportsInterface", "inputs": [{ "name": "interfaceId", "type": "bytes4", "internalType": "bytes4" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "view" }, { "type": "function", "name": "symbol", "inputs": [], "outputs": [{ "name": "", "type": "string", "internalType": "string" }], "stateMutability": "view" }, { "type": "function", "name": "tokenURI", "inputs": [{ "name": "tokenId", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "string", "internalType": "string" }], "stateMutability": "view" }, { "type": "function", "name": "transferFrom", "inputs": [{ "name": "from", "type": "address", "internalType": "address" }, { "name": "to", "type": "address", "internalType": "address" }, { "name": "tokenId", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "transferOwnership", "inputs": [{ "name": "newOwner", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "upgradePart", "inputs": [{ "name": "partType", "type": "uint8", "internalType": "enum CosmicParts.PartType" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "withdrawCrystals", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }, { "type": "event", "name": "Approval", "inputs": [{ "name": "owner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "approved", "type": "address", "indexed": true, "internalType": "address" }, { "name": "tokenId", "type": "uint256", "indexed": true, "internalType": "uint256" }], "anonymous": false }, { "type": "event", "name": "ApprovalForAll", "inputs": [{ "name": "owner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "operator", "type": "address", "indexed": true, "internalType": "address" }, { "name": "approved", "type": "bool", "indexed": false, "internalType": "bool" }], "anonymous": false }, { "type": "event", "name": "BatchMetadataUpdate", "inputs": [{ "name": "_fromTokenId", "type": "uint256", "indexed": false, "internalType": "uint256" }, { "name": "_toTokenId", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false }, { "type": "event", "name": "MetadataUpdate", "inputs": [{ "name": "_tokenId", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false }, { "type": "event", "name": "OwnershipTransferred", "inputs": [{ "name": "previousOwner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "newOwner", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false }, { "type": "event", "name": "PartMinted", "inputs": [{ "name": "owner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "tokenId", "type": "uint256", "indexed": true, "internalType": "uint256" }, { "name": "partType", "type": "uint8", "indexed": false, "internalType": "enum CosmicParts.PartType" }, { "name": "cost", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false }, { "type": "event", "name": "PartUpgraded", "inputs": [{ "name": "owner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "tokenId", "type": "uint256", "indexed": true, "internalType": "uint256" }, { "name": "partType", "type": "uint8", "indexed": false, "internalType": "enum CosmicParts.PartType" }, { "name": "newLevel", "type": "uint256", "indexed": false, "internalType": "uint256" }, { "name": "cost", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false }, { "type": "event", "name": "Transfer", "inputs": [{ "name": "from", "type": "address", "indexed": true, "internalType": "address" }, { "name": "to", "type": "address", "indexed": true, "internalType": "address" }, { "name": "tokenId", "type": "uint256", "indexed": true, "internalType": "uint256" }], "anonymous": false }, { "type": "error", "name": "ERC721IncorrectOwner", "inputs": [{ "name": "sender", "type": "address", "internalType": "address" }, { "name": "tokenId", "type": "uint256", "internalType": "uint256" }, { "name": "owner", "type": "address", "internalType": "address" }] }, { "type": "error", "name": "ERC721InsufficientApproval", "inputs": [{ "name": "operator", "type": "address", "internalType": "address" }, { "name": "tokenId", "type": "uint256", "internalType": "uint256" }] }, { "type": "error", "name": "ERC721InvalidApprover", "inputs": [{ "name": "approver", "type": "address", "internalType": "address" }] }, { "type": "error", "name": "ERC721InvalidOperator", "inputs": [{ "name": "operator", "type": "address", "internalType": "address" }] }, { "type": "error", "name": "ERC721InvalidOwner", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }] }, { "type": "error", "name": "ERC721InvalidReceiver", "inputs": [{ "name": "receiver", "type": "address", "internalType": "address" }] }, { "type": "error", "name": "ERC721InvalidSender", "inputs": [{ "name": "sender", "type": "address", "internalType": "address" }] }, { "type": "error", "name": "ERC721NonexistentToken", "inputs": [{ "name": "tokenId", "type": "uint256", "internalType": "uint256" }] }, { "type": "error", "name": "OwnableInvalidOwner", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }] }, { "type": "error", "name": "OwnableUnauthorizedAccount", "inputs": [{ "name": "account", "type": "address", "internalType": "address" }] }, { "type": "error", "name": "PRBMath_MulDiv18_Overflow", "inputs": [{ "name": "x", "type": "uint256", "internalType": "uint256" }, { "name": "y", "type": "uint256", "internalType": "uint256" }] }, { "type": "error", "name": "PRBMath_UD60x18_Convert_Overflow", "inputs": [{ "name": "x", "type": "uint256", "internalType": "uint256" }] }, { "type": "error", "name": "SafeERC20FailedOperation", "inputs": [{ "name": "token", "type": "address", "internalType": "address" }] }];

// Part type enum mapping (based on the CosmicParts.PartType enum in the contract)
export enum PartType {
    ENGINE = 0,
    CHASSIS = 1,
    WHEEL = 2,
    TURBO = 3
}

// Part data structure
export interface CosmicPart {
    partType: PartType;
    level: number;
}

// Helper to get Cosmic Parts Contract Instance
const getCosmicPartsContract = async (signerOrProvider?: ethers.Signer | ethers.Provider): Promise<ethers.Contract> => {
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
        // Fallback or server-side scenario
        throw new Error("Provider configuration missing.");
    }

    // If a signer is available, use it; otherwise, use the provider for read-only access
    const contract = new ethers.Contract(cosmicPartAddress, cosmicPartAbi, signer ?? provider);
    return contract;
};

/**
 * Get NFT name
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the token name
 */
export const getName = async (provider?: ethers.Provider): Promise<string> => {
    const contract = await getCosmicPartsContract(provider);
    return contract.name();
};

/**
 * Get NFT symbol
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the token symbol
 */
export const getSymbol = async (provider?: ethers.Provider): Promise<string> => {
    const contract = await getCosmicPartsContract(provider);
    return contract.symbol();
};

/**
 * Get balance of NFTs for an address
 * @param address The address to check
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the balance (as bigint)
 */
export const getBalance = async (address: string, provider?: ethers.Provider): Promise<bigint> => {
    const contract = await getCosmicPartsContract(provider);
    return contract.balanceOf(address);
};

/**
 * Get total boost/power for a player
 * @param address Player address
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the total boost (as bigint)
 */
export const getTotalBoost = async (address: string, provider?: ethers.Provider): Promise<bigint> => {
    const contract = await getCosmicPartsContract(provider);
    return contract.getTotalBoost(address);
};

/**
 * Get data for a specific part token
 * @param tokenId The token ID
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the part data
 */
export const getPartData = async (tokenId: bigint, provider?: ethers.Provider): Promise<CosmicPart> => {
    const contract = await getCosmicPartsContract(provider);
    const partData = await contract.getPartData(tokenId);
    return {
        partType: partData.partType,
        level: Number(partData.level)
    };
};

/**
 * Get equipped part for a given player and part type
 * @param address Player address
 * @param partType Part type (engine, chassis, wheel, turbo)
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the token ID of the equipped part (as bigint)
 */
export const getEquippedPart = async (
    address: string,
    partType: PartType,
    provider?: ethers.Provider
): Promise<bigint> => {
    const contract = await getCosmicPartsContract(provider);
    return contract.equippedParts(address, partType);
};

/**
 * Get cost for upgrading a chassis
 * @param level Current level
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the upgrade cost (as bigint)
 */
export const getChassisCost = async (level: number, provider?: ethers.Provider): Promise<bigint> => {
    const contract = await getCosmicPartsContract(provider);
    return contract.getChassisCost(level);
};

/**
 * Get velocity boost for a chassis level
 * @param level Chassis level
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the velocity boost (as bigint)
 */
export const getChassisVelocity = async (level: number, provider?: ethers.Provider): Promise<bigint> => {
    const contract = await getCosmicPartsContract(provider);
    return contract.getChassisVelocity(level);
};

/**
 * Get cost for upgrading an engine
 * @param level Current level
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the upgrade cost (as bigint)
 */
export const getEngineCost = async (level: number, provider?: ethers.Provider): Promise<bigint> => {
    const contract = await getCosmicPartsContract(provider);
    return contract.getEngineCost(level);
};

/**
 * Get velocity boost for an engine level
 * @param level Engine level
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the velocity boost (as bigint)
 */
export const getEngineVelocity = async (level: number, provider?: ethers.Provider): Promise<bigint> => {
    const contract = await getCosmicPartsContract(provider);
    return contract.getEngineVelocity(level);
};

/**
 * Get cost for upgrading wheels
 * @param level Current level
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the upgrade cost (as bigint)
 */
export const getWheelCost = async (level: number, provider?: ethers.Provider): Promise<bigint> => {
    const contract = await getCosmicPartsContract(provider);
    return contract.getWheelCost(level);
};

/**
 * Get velocity boost for a wheel level
 * @param level Wheel level
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the velocity boost (as bigint)
 */
export const getWheelVelocity = async (level: number, provider?: ethers.Provider): Promise<bigint> => {
    const contract = await getCosmicPartsContract(provider);
    return contract.getWheelVelocity(level);
};

/**
 * Get cost for upgrading a turbo
 * @param level Current level
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the upgrade cost (as bigint)
 */
export const getTurboCost = async (level: number, provider?: ethers.Provider): Promise<bigint> => {
    const contract = await getCosmicPartsContract(provider);
    return contract.getTurboCost(level);
};

/**
 * Get velocity boost for a turbo level
 * @param level Turbo level
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the velocity boost (as bigint)
 */
export const getTurboVelocity = async (level: number, provider?: ethers.Provider): Promise<bigint> => {
    const contract = await getCosmicPartsContract(provider);
    return contract.getTurboVelocity(level);
};

/**
 * Upgrade a part
 * @param signer The signer to send the transaction with
 * @param partType Type of part to upgrade
 * @returns A promise that resolves with the transaction response
 */
export const upgradePart = async (
    signer: ethers.Signer,
    partType: PartType
): Promise<ethers.ContractTransactionResponse> => {
    if (!signer.provider) {
        throw new Error("Signer must be connected to a Provider to send a transaction.");
    }

    const contract = await getCosmicPartsContract(signer);
    const tx = await contract.upgradePart(partType, { gasLimit: 300000 });

    // Track the transaction with a descriptive name
    trackTransaction(tx, `Upgrade ${getPartTypeName(partType)}`);

    return tx;
};

/**
 * Get the owner of a specific part token
 * @param tokenId Token ID
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the owner address
 */
export const getOwnerOf = async (tokenId: bigint, provider?: ethers.Provider): Promise<string> => {
    const contract = await getCosmicPartsContract(provider);
    return contract.ownerOf(tokenId);
};

/**
 * Get a human-readable name for a part type
 * @param partType The part type
 * @returns A human-readable name
 */
export const getPartTypeName = (partType: PartType): string => {
    switch (partType) {
        case PartType.ENGINE:
            return "Engine";
        case PartType.CHASSIS:
            return "Chassis";
        case PartType.WHEEL:
            return "Wheel";
        case PartType.TURBO:
            return "Turbo";
        default:
            return "Part";
    }
};
