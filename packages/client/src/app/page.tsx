"use client";

import { useEffect, useRef, useState } from "react";
import Gameplay from "./components/Gameplay";
import Navigation from "./components/Navigation";
import Menu, { MenuAction } from "./components/Menu";
import Login from "./components/Login";
import { useAppKitAccount } from "@reown/appkit/react";
import Settings from "./components/Settings";
import Leaderboard from "./components/Leaderboard";
import Shop from "./components/Shop";

export type User = {
  profilePicture: string;
  displayName: string;
  language: string;
  vehicle: number;
};

const user: User = {
  profilePicture: "./PFP.svg",
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
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/music/night-racer.mp3");
    audioRef.current.loop = true;

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay failed:", err);
      });
    }

    setIsMusicPlaying(!isMusicPlaying);
  };

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

  const handleMenuClick = (_menuAction: MenuAction) => {
    switch (_menuAction) {
      case MenuAction.START_GAME:
        setActiveView(Views.NULL);
        togglePlayback();
        setGameStarted(true);
        break;
      case MenuAction.OPEN_LEADERBOARD:
        if (activeView === Views.LEADERBOARD) {
          setActiveView(Views.NULL);
          return;
        }
        setActiveView(Views.LEADERBOARD);
        setGameStarted(false);
        break;
      case MenuAction.OPEN_SHOP:
        if (activeView === Views.SHOP) {
          setActiveView(Views.NULL);
          return;
        }
        setActiveView(Views.SHOP);
        setGameStarted(false);
        break;
      default:
        setActiveView(Views.NULL);
    }
  };

  const handleSettingsClick = () => {
    setActiveView((prevState) =>
      prevState === Views.SETTINGS ? Views.NULL : Views.SETTINGS
    );
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center">
      <div className="relative w-full h-full max-w-[414px] max-h-[896px] overflow-hidden">
        {isConnected ? (
          <div className="relative w-full h-full">
            {[Views.NULL, Views.SETTINGS].includes(activeView) && (
              <Navigation
                gameStarted={gameStarted}
                musicPlaying={isMusicPlaying}
                handleToggleMusicPlaying={togglePlayback}
                toggleSettings={handleSettingsClick}
                isSettingsOpen={activeView === Views.SETTINGS}
                user={user}
              />
            )}
            <Menu
              gameStarted={gameStarted}
              handleClick={(_menuAction: MenuAction) =>
                handleMenuClick(_menuAction)
              }
            />
            {activeView === Views.NULL && (
              <div className="relative w-full h-full">
                <Gameplay gameStarted={gameStarted} />
              </div>
            )}
            {activeView === Views.LEADERBOARD && <Leaderboard user={user} />}
            {activeView === Views.SHOP && <Shop />}
          </div>
        ) : (
          <Login />
        )}
      </div>
    </div>
  );
}
