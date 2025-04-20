import { ethers } from 'ethers';
import { trackTransaction } from "./transaction-tracker";

// --- Staking Contract Address ---
const stakingContractAddress = "0x6988db999576447101676897E4c211eC49309036";

// --- Staking Contract ABI ---
const stakingAbi = [{ "type": "constructor", "inputs": [{ "name": "_registry", "type": "address", "internalType": "contract Registry" }], "stateMutability": "nonpayable" }, { "type": "function", "name": "CRYSTALS_PER_ETH", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "LOCKUP_DURATION", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "SECONDS_PER_HOUR", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "STAKING_FEE_PERCENT", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "calculateRiseCrystals", "inputs": [{ "name": "amount", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "pure" }, { "type": "function", "name": "distributePool", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "getStakeInfo", "inputs": [{ "name": "staker", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "tuple", "internalType": "struct IStaking.StakeInfo", "components": [{ "name": "amount", "type": "uint256", "internalType": "uint256" }, { "name": "startTime", "type": "uint256", "internalType": "uint256" }, { "name": "claimedCrystals", "type": "uint256", "internalType": "uint256" }, { "name": "lockEndTime", "type": "uint256", "internalType": "uint256" }] }], "stateMutability": "view" }, { "type": "function", "name": "getTotalStaked", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "lastDistributionTime", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "owner", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" }, { "type": "function", "name": "registry", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "contract Registry" }], "stateMutability": "view" }, { "type": "function", "name": "renounceOwnership", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "stakeETH", "inputs": [], "outputs": [], "stateMutability": "payable" }, { "type": "function", "name": "stakes", "inputs": [{ "name": "", "type": "address", "internalType": "address" }], "outputs": [{ "name": "amount", "type": "uint256", "internalType": "uint256" }, { "name": "startTime", "type": "uint256", "internalType": "uint256" }, { "name": "claimedCrystals", "type": "uint256", "internalType": "uint256" }, { "name": "lockEndTime", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "totalStaked", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "transferOwnership", "inputs": [{ "name": "newOwner", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "unstakeETH", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "withdrawFees", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }, { "type": "event", "name": "CrystalsClaimed", "inputs": [{ "name": "staker", "type": "address", "indexed": true, "internalType": "address" }, { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false }, { "type": "event", "name": "OwnershipTransferred", "inputs": [{ "name": "previousOwner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "newOwner", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false }, { "type": "event", "name": "RiseCrystalsTokenSet", "inputs": [{ "name": "tokenAddress", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false }, { "type": "event", "name": "Staked", "inputs": [{ "name": "staker", "type": "address", "indexed": true, "internalType": "address" }, { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }, { "name": "lockEndTime", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false }, { "type": "event", "name": "Unstaked", "inputs": [{ "name": "staker", "type": "address", "indexed": true, "internalType": "address" }, { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false }, { "type": "error", "name": "OwnableInvalidOwner", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }] }, { "type": "error", "name": "OwnableUnauthorizedAccount", "inputs": [{ "name": "account", "type": "address", "internalType": "address" }] }, { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] }]

// Interface for StakeInfo structure
export interface StakeInfo {
    amount: bigint;
    startTime: bigint;
    claimedCrystals: bigint;
    lockEndTime: bigint;
}

// Helper to get Staking Contract Instance
const getStakingContract = async (signerOrProvider?: ethers.Signer | ethers.Provider): Promise<ethers.Contract> => {
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
    const contract = new ethers.Contract(stakingContractAddress, stakingAbi, signer ?? provider);
    return contract;
};


/**
 * Get lockup duration in seconds
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the lockup duration (as bigint)
 */
export const getLockupDuration = async (provider?: ethers.Provider): Promise<bigint> => {
    const contract = await getStakingContract(provider);
    return contract.LOCKUP_DURATION();
};

/**
 * Get staking fee percentage
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the staking fee percentage (as bigint)
 */
export const getStakingFee = async (provider?: ethers.Provider): Promise<bigint> => {
    const contract = await getStakingContract(provider);
    return contract.STAKING_FEE_PERCENT();
};

/**
 * Get stake information for a specific address
 * @param address The address to get stake info for
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the stake information
 */
export const getStakeInfo = async (address: string, provider?: ethers.Provider): Promise<StakeInfo> => {
    const contract = await getStakingContract(provider);
    return contract.getStakeInfo(address);
};

/**
 * Calculate unclaimed Rise Crystals for a staker
 * @param address The staker's address
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the unclaimed crystals amount (as bigint)
 */
export const calculateRiseCrystals = async (address: string, provider?: ethers.Provider): Promise<bigint> => {
    const contract = await getStakingContract(provider);
    return contract.calculateRiseCrystals(address);
};

/**
 * Get total ETH staked in the contract
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the total staked amount (as bigint)
 */
export const getTotalStaked = async (provider?: ethers.Provider): Promise<bigint> => {
    const contract = await getStakingContract(provider);
    return contract.getTotalStaked();
};

/**
 * Stake ETH
 * @param signer The signer to send the transaction with
 * @param amount The amount of ETH to stake in wei
 * @returns A promise that resolves with the transaction response
 */
export const stakeETH = async (
    signer: ethers.Signer,
    amount: bigint
): Promise<ethers.ContractTransactionResponse> => {
    if (!signer.provider) {
        throw new Error("Signer must be connected to a Provider to send a transaction.");
    }

    const contract = await getStakingContract(signer);
    const tx = await contract.stakeETH({ value: amount, gasLimit: 250000 });

    // Track the transaction
    trackTransaction(tx, `Stake ${ethers.formatEther(amount)} ETH`);

    return tx;
};

/**
 * Unstake ETH
 * @param signer The signer to send the transaction with
 * @returns A promise that resolves with the transaction response
 */
export const unstakeETH = async (
    signer: ethers.Signer
): Promise<ethers.ContractTransactionResponse> => {
    if (!signer.provider) {
        throw new Error("Signer must be connected to a Provider to send a transaction.");
    }

    const contract = await getStakingContract(signer);
    const tx = await contract.unstakeETH({ gasLimit: 250000 });

    // Track the transaction
    trackTransaction(tx, "Unstake ETH");

    return tx;
}; 