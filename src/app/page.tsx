"use client";

import { useEffect, useRef, useState } from "react";
import Gameplay from "./components/Gameplay";
import Navigation from "./components/Navigation";
import Menu, { MenuAction } from "./components/Menu";
import Login from "./components/Login";
import Leaderboard from "./components/Leaderboard";
import Shop from "./components/Shop";
import BindHotWallet from "./components/BindHotWallet";
import { useHotWallet } from "./context/HotWalletContext";
import useViewportHeight from "./hooks/useViewportHeight";
import { Tutorial } from "./components/Tutorial";
import { useAccount } from "wagmi";

export type User = {
  vehicle: number;
  currentLevel: number;
  currentProgress: number;
};

enum Views {
  NULL,
  SETTINGS,
  SHOP,
  LEADERBOARD,
  TUTORIAL,
}

export default function Home() {
  const { address } = useAccount();
  const viewportHeight = useViewportHeight();
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<Views>(Views.NULL);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { user } = useHotWallet();
  const [currentLevel, setCurrentLevel] = useState<number>(user.currentLevel);
  const { hotWallet } = useHotWallet();

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
          if (now - lastTouchEnd <= 500) {
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
        break;
      case MenuAction.OPEN_SHOP:
        if (activeView === Views.SHOP) {
          setActiveView(Views.NULL);
          return;
        }
        setActiveView(Views.SHOP);
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

  const handleTutorialClick = () => {
    setActiveView((prevState) =>
      prevState === Views.TUTORIAL ? Views.NULL : Views.TUTORIAL
    );
  };

  const handleNextLevel = () => {
    setCurrentLevel((prevState) => prevState + 1);
  };

  return (
    <div
      className="relative w-screen flex items-center justify-center bg-[#29004D]"
      style={{ height: `${viewportHeight}px` }}
    >
      <div className="relative w-full h-full max-w-[430px] md:max-h-[750px] overflow-hidden">
        {address ? (
          <div className="relative w-full h-full">
            {[Views.NULL, Views.SETTINGS, Views.TUTORIAL].includes(
              activeView
            ) && (
              <Navigation
                musicPlaying={isMusicPlaying}
                toggleMusicPlaying={togglePlayback}
                toggleSettings={handleSettingsClick}
                isSettingsOpen={activeView === Views.SETTINGS}
                toggleTutorial={handleTutorialClick}
              />
            )}
            <Menu
              gameStarted={gameStarted}
              handleClick={(_menuAction: MenuAction) =>
                handleMenuClick(_menuAction)
              }
            />
            <div className="relative w-full h-full">
              <Gameplay
                level={currentLevel}
                // TODO: Update currentProgress to be fetched
                progress={user.currentProgress}
                gameStarted={gameStarted}
                handleNextLevel={handleNextLevel}
              />

              {activeView === Views.LEADERBOARD && (
                <div className="absolute top-0 left-0 right-0 bottom-0">
                  <Leaderboard />
                </div>
              )}
              {activeView === Views.SHOP && (
                <div className="absolute top-0 left-0 right-0 bottom-0">
                  <Shop />
                </div>
              )}
              {activeView === Views.TUTORIAL && (
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
                  <Tutorial />
                </div>
              )}
            </div>

            {!hotWallet && <BindHotWallet />}
          </div>
        ) : (
          <Login />
        )}
      </div>
    </div>
  );
}
