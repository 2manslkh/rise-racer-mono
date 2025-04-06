import { cookieStorage, createStorage } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, defineChain } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { ENVIRONMENT } from "./environment";

export const projectId = ENVIRONMENT.REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

const riseTestnet = defineChain({
  id: 11155931,
  caipNetworkId: "eip155:11155931",
  chainNamespace: "eip155",
  name: "RISE Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.riselabs.xyz"],
      webSocket: ["wss://testnet.riselabs.xyz/ws"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://testnet.explorer.riselabs.xyz" },
  },
});

export const networks = [mainnet] as [AppKitNetwork, ...AppKitNetwork[]];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
