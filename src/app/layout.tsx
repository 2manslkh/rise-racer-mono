import type { Metadata } from "next";
import { Geist, Geist_Mono, Zen_Dots, Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import ContextProvider from "./context/WagmiContext";
import { HotWalletProvider } from "./context/HotWalletContext";
import { Toaster } from "react-hot-toast";
import { TelegramAuthProvider, useTMA } from "./context/TelegramContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const zenDots = Zen_Dots({
  variable: "--font-zen-dots",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rise Racer",
  description:
    "Race on Rise Chain where every click fuels your vehicle! Speed up, trigger on-chain transactions, and accelerate to victory in this Web3-powered racing game.",
  authors: [{ name: "Rise Racer" }],
  keywords: [
    "Rise",
    "Racer",
    "Click",
    "Speed",
    "DeFi",
    "Cryptocurrency",
    "Blockchain",
    "L2",
  ],
  openGraph: {
    title: "Rise Racer",
    description:
      "Race on Rise Chain where every click fuels your vehicle! Speed up, trigger on-chain transactions, and accelerate to victory in this Web3-powered racing game.",
    url: "https://app.rise-racer.com",
    siteName: "Rise Racer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rise Racer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rise Racer",
    description:
      "Race on Rise Chain where every click fuels your vehicle! Speed up, trigger on-chain transactions, and accelerate to victory in this Web3-powered racing game.",
    images: ["/og-image.png"],
    creator: "@rise_racer",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = (await headers()).get("cookie");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${zenDots.variable} ${inter.variable} antialiased`}
      >
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Define default options
            className: "",
            duration: 10_000,
            removeDelay: 1000,
            style: {
              background: "#29004D",
              color: "#fff",
            },
            // Default options for specific types
            success: {
              duration: 3000,
              iconTheme: {
                primary: "green",
                secondary: "black",
              },
            },
          }}
        />
        <TelegramAuthProvider>
          <ContextProvider cookies={cookies}>
            <HotWalletProvider>{children}</HotWalletProvider>
          </ContextProvider>
        </TelegramAuthProvider>
      </body>
    </html>
  );
}
