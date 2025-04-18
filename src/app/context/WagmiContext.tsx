"use client";

import { wagmiAdapter, projectId, networks } from "../configuration/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

const queryClient = new QueryClient();

const metadata = {
  name: "Rise Racer",
  description: "Rise Racer",
  url: "https://github.com/0xonerb/next-reown-appkit-ssr",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata,
  themeMode: "dark",
  features: {
    analytics: false,
    swaps: false,
    onramp: false,
    socials: [],
    email: false,
  },
  defaultAccountTypes: { eip155: "eoa" },
  enableWalletGuide: true,
  allWallets: "SHOW",
  themeVariables: {
    "--w3m-color-mix": "#FD00CA",
    "--w3m-color-mix-strength": 20,
    "--w3m-font-family": "'Zen Dots', sans-serif",
  },
  // termsConditionsUrl: "https://www.google.com",
  // privacyPolicyUrl: "https://www.google.com",
});

const ContextProvider = ({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) => {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

export default ContextProvider;
