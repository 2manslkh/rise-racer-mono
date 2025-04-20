import { ethers } from 'ethers';
import { trackTransaction } from "./transaction-tracker";
import { ENVIRONMENT } from '../configuration/environment';

// --- Rise Crystals Contract Address ---
const riseCrystalsAddress = ENVIRONMENT.RISE_CRYSTALS_ADDRESS;

// --- Rise Crystals Contract ABI ---
const riseCrystalsAbi = [
    { "type": "constructor", "inputs": [{ "name": "_registryAddress", "type": "address", "internalType": "address" }], "stateMutability": "nonpayable" },
    { "type": "function", "name": "allowance", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }, { "name": "spender", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
    { "type": "function", "name": "approve", "inputs": [{ "name": "spender", "type": "address", "internalType": "address" }, { "name": "value", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "nonpayable" },
    { "type": "function", "name": "balanceOf", "inputs": [{ "name": "account", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
    { "type": "function", "name": "decimals", "inputs": [], "outputs": [{ "name": "", "type": "uint8", "internalType": "uint8" }], "stateMutability": "view" },
    { "type": "function", "name": "mint", "inputs": [{ "name": "account", "type": "address", "internalType": "address" }, { "name": "amount", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" },
    { "type": "function", "name": "name", "inputs": [], "outputs": [{ "name": "", "type": "string", "internalType": "string" }], "stateMutability": "view" },
    { "type": "function", "name": "pay", "inputs": [{ "name": "from", "type": "address", "internalType": "address" }, { "name": "to", "type": "address", "internalType": "address" }, { "name": "value", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "nonpayable" },
    { "type": "function", "name": "registry", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "contract IRegistry" }], "stateMutability": "view" },
    { "type": "function", "name": "symbol", "inputs": [], "outputs": [{ "name": "", "type": "string", "internalType": "string" }], "stateMutability": "view" },
    { "type": "function", "name": "totalSupply", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
    { "type": "function", "name": "transfer", "inputs": [{ "name": "to", "type": "address", "internalType": "address" }, { "name": "value", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "nonpayable" },
    { "type": "function", "name": "transferFrom", "inputs": [{ "name": "from", "type": "address", "internalType": "address" }, { "name": "to", "type": "address", "internalType": "address" }, { "name": "value", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "nonpayable" },
    { "type": "event", "name": "Approval", "inputs": [{ "name": "owner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "spender", "type": "address", "indexed": true, "internalType": "address" }, { "name": "value", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false },
    { "type": "event", "name": "Transfer", "inputs": [{ "name": "from", "type": "address", "indexed": true, "internalType": "address" }, { "name": "to", "type": "address", "indexed": true, "internalType": "address" }, { "name": "value", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false },
    { "type": "error", "name": "ERC20InsufficientAllowance", "inputs": [{ "name": "spender", "type": "address", "internalType": "address" }, { "name": "allowance", "type": "uint256", "internalType": "uint256" }, { "name": "needed", "type": "uint256", "internalType": "uint256" }] },
    { "type": "error", "name": "ERC20InsufficientBalance", "inputs": [{ "name": "sender", "type": "address", "internalType": "address" }, { "name": "balance", "type": "uint256", "internalType": "uint256" }, { "name": "needed", "type": "uint256", "internalType": "uint256" }] },
    { "type": "error", "name": "ERC20InvalidApprover", "inputs": [{ "name": "approver", "type": "address", "internalType": "address" }] },
    { "type": "error", "name": "ERC20InvalidReceiver", "inputs": [{ "name": "receiver", "type": "address", "internalType": "address" }] },
    { "type": "error", "name": "ERC20InvalidSender", "inputs": [{ "name": "sender", "type": "address", "internalType": "address" }] },
    { "type": "error", "name": "ERC20InvalidSpender", "inputs": [{ "name": "spender", "type": "address", "internalType": "address" }] }
];

// Helper to get Rise Crystals Contract Instance
const getRiseCrystalsContract = async (signerOrProvider?: ethers.Signer | ethers.Provider): Promise<ethers.Contract> => {
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
    const contract = new ethers.Contract(riseCrystalsAddress, riseCrystalsAbi, signer ?? provider);
    return contract;
};

/**
 * Get token name
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the token name
 */
export const getName = async (provider?: ethers.Provider): Promise<string> => {
    const contract = await getRiseCrystalsContract(provider);
    return contract.name();
};

/**
 * Get token symbol
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the token symbol
 */
export const getSymbol = async (provider?: ethers.Provider): Promise<string> => {
    const contract = await getRiseCrystalsContract(provider);
    return contract.symbol();
};

/**
 * Get token decimals
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the token decimals
 */
export const getDecimals = async (provider?: ethers.Provider): Promise<number> => {
    const contract = await getRiseCrystalsContract(provider);
    return contract.decimals();
};

/**
 * Get total token supply
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the total supply (as bigint)
 */
export const getTotalSupply = async (provider?: ethers.Provider): Promise<bigint> => {
    const contract = await getRiseCrystalsContract(provider);
    return contract.totalSupply();
};

/**
 * Get token balance of an address
 * @param address The address to check balance for
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the balance (as bigint)
 */
export const getBalance = async (address: string, provider?: ethers.Provider): Promise<bigint> => {
    const contract = await getRiseCrystalsContract(provider);
    return contract.balanceOf(address);
};

/**
 * Get allowance amount
 * @param owner The owner address
 * @param spender The spender address
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the allowance amount (as bigint)
 */
export const getAllowance = async (
    owner: string,
    spender: string,
    provider?: ethers.Provider
): Promise<bigint> => {
    const contract = await getRiseCrystalsContract(provider);
    return contract.allowance(owner, spender);
};

/**
 * Transfer tokens
 * @param signer The signer to send the transaction with
 * @param to Recipient address
 * @param amount Amount to transfer (as bigint)
 * @param description Optional description for the transaction
 * @returns A promise that resolves with the transaction response
 */
export const transfer = async (
    signer: ethers.Signer,
    to: string,
    amount: bigint,
    description: string = "Token Transfer"
): Promise<ethers.ContractTransactionResponse> => {
    if (!signer.provider) {
        throw new Error("Signer must be connected to a Provider to send a transaction.");
    }

    const contract = await getRiseCrystalsContract(signer);
    const tx = await contract.transfer(to, amount, { gasLimit: 200000 });

    // Track the transaction
    trackTransaction(tx, description);

    return tx;
};

/**
 * Approve tokens for spending by another address
 * @param signer The signer to send the transaction with
 * @param spender Spender address
 * @param amount Amount to approve (as bigint)
 * @returns A promise that resolves with the transaction response
 */
export const approve = async (
    signer: ethers.Signer,
    spender: string,
    amount: bigint
): Promise<ethers.ContractTransactionResponse> => {
    if (!signer.provider) {
        throw new Error("Signer must be connected to a Provider to send a transaction.");
    }

    const contract = await getRiseCrystalsContract(signer);
    return contract.approve(spender, amount, { gasLimit: 200000 });
};

/**
 * Format token amount for display
 * @param amount The raw token amount (as bigint)
 * @param provider Optional: An ethers Provider for read-only access
 * @returns A promise that resolves with the formatted amount as a string
 */
export const formatTokenAmount = async (amount: bigint, provider?: ethers.Provider): Promise<string> => {
    const decimals = await getDecimals(provider);
    return ethers.formatUnits(amount, decimals);
}; 