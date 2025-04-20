import { riseTestnet } from "../configuration/wagmi";

export enum LOOKUP_ENTITIES {
  TRANSACTION_HASH = "txn",
  ADDRESS = "address",
  BLOCK = "block",
  TOKEN = "token",
}

export const getBlockExplorerUrl = (
  hash: string,
  network: number,
  entity: LOOKUP_ENTITIES = LOOKUP_ENTITIES.TRANSACTION_HASH
) => {
  if (network === riseTestnet.id) {
    return `https://explorer.testnet.riselabs.xyz/${entity}/${hash}`;
  } else {
    // TODO: Update url to mainnet
    return `https://explorer.testnet.riselabs.xyz/${entity}/${hash}`;
  }
};
