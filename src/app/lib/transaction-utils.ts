import { TransactionReceipt } from "ethers";
import { ethers } from "ethers";

/**
 * Wrapper function to call the rpc_sendRawTransactionSync RPC method
 * @param provider ethers.js provider with RPC capabilities
 * @param signedTransactionHex hex string of the signed transaction
 * @returns transaction hash
 */
export const sendRawTransactionSync = async (
    provider: ethers.JsonRpcProvider | ethers.WebSocketProvider,
    signedTransactionHex: string
): Promise<TransactionReceipt> => {
    const receipt = await provider.send("eth_sendRawTransactionSync", [signedTransactionHex]);
    return receipt; // Returns the transaction hash
}; 