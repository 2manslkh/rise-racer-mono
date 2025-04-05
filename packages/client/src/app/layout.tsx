import type { Metadata } from "next";
import { Geist, Geist_Mono, Zen_Dots } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import ContextProvider from "./context/WagmiContext";

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

export const metadata: Metadata = {
  title: "Rise Racer",
  description: "Rise Racer",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
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
        className={`${geistSans.variable} ${geistMono.variable} ${zenDots.variable} antialiased`}
      >
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  );
}
