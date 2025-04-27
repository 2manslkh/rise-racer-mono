import { cookieStorage, createStorage } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { defineChain } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { ENVIRONMENT } from "./environment";

export const projectId = ENVIRONMENT.REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const riseTestnet = defineChain({
  id: 11155008,
  caipNetworkId: "eip155:11155008",
  chainNamespace: "eip155",
  name: "RISE Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://staging.riselabs.xyz"],
      webSocket: ["wss://staging.riselabs.xyz/ws"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://staging.explorer.riselabs.xyz" },
  },
});

export const networks = [riseTestnet] as [AppKitNetwork, ...AppKitNetwork[]];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
