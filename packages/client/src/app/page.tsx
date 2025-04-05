"use client";

import { useEffect, useState } from "react";
import Gameplay from "./components/Gameplay";
import Navigation from "./components/Navigation";
import Menu from "./components/Menu";
import Login from "./components/Login";
import { useAppKitAccount } from "@reown/appkit/react";

export type User = {
  profilePicture: string;
  displayName: string;
  language: string;
  vehicle: number;
};

const user: User = {
  profilePicture: "",
  displayName: "Anthony Mega Storm",
  language: "EN",
  vehicle: 1,
};

enum Views {
  NULL,
  SETTINGS,
  SHOP,
  LEADERBOARD,
}

export default function Home() {
  const { address, isConnected, caipAddress, status, embeddedWalletInfo } =
    useAppKitAccount();
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<Views>(Views.NULL);

  useEffect(() => {
    if (window) {
      let lastTouchEnd = 0;
      document.addEventListener(
        "touchend",
        (event) => {
          const now = new Date().getTime();
          if (now - lastTouchEnd <= 300) {
            event.preventDefault();
          }
          lastTouchEnd = now;
        },
        false
      );
    }
  }, []);

  return (
    <div className="relative w-screen h-screen flex items-center justify-center">
      <div className="relative w-full h-full max-w-[414px] max-h-[896px] overflow-hidden">
        {isConnected ? (
          <div className="relative w-full h-full">
            <Navigation gameStarted={gameStarted} />
            <Menu
              gameStarted={gameStarted}
              handleStart={() => setGameStarted(true)}
            />
            <div className="relative w-full h-full">
              <Gameplay gameStarted={gameStarted} />
            </div>
          </div>
        ) : (
          <Login />
        )}
      </div>
    </div>
  );
}
