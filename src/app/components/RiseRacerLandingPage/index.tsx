"use client";

import { useTMA } from "@/app/context/TelegramContext";
import Image from "next/image";
import React from "react";
import Spinner from "../Shared/Loader/Spinner";

const RiseRacerLandingPage: React.FC = () => {
  const { isLoading } = useTMA();

  const handleOpenTelegramLink = () => {
    window.open("https://t.me/riseracer", "_blank", "noopener,noreferrer");
  };

  // For simple entrance animations - these classes would ideally trigger them.
  // In a real setup, you might use a library like Framer Motion or Tailwind animation plugins.
  // const entranceAnimation = "transition-all duration-1000 ease-out"; // Kept for reference, but not directly used
  // const initialFadeInUp = "opacity-0 transform translate-y-5"; // Kept for reference, but not directly used
  // const finalFadeInUp = "opacity-100 transform translate-y-0"; // Removed unused variable

  return (
    <div className="flex flex-col items-center w-full justify-between min-h-screen h-screen bg-gradient-to-br from-purple-800 via-purple-700 to-blue-700 text-white p-6 sm:p-8 overflow-x-hidden">
      <header
        className={`w-full max-w-3xl text-center mt-8 sm:mt-12 motion-safe:animate-fadeInUp actual-final-class`}
      >
        <style>
          {`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .motion-safe .animate-fadeInUp.actual-final-class {
              animation: fadeInUp 0.8s ease-out forwards;
            }
            .motion-safe .animate-fadeInUp-delay-200.actual-final-class {
              animation: fadeInUp 0.8s ease-out 0.2s forwards;
            }
            .motion-safe .animate-fadeInUp-delay-400.actual-final-class {
              animation: fadeInUp 0.8s ease-out 0.4s forwards;
            }
            .motion-safe .animate-fadeInUp-delay-600.actual-final-class {
              animation: fadeInUp 0.8s ease-out 0.6s forwards;
            }
            .motion-safe .animate-fadeIn.actual-final-class {
              animation: fadeIn 0.8s ease-out forwards;
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}
        </style>
        <div className="mb-8 motion-safe:animate-fadeInUp actual-final-class">
          <Image
            src="/rise-racer-logo-full.svg"
            alt="Rise Racer: Tap, Race, Earn!"
            width={373}
            height={111}
            priority
            className="mx-auto"
          />
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight drop-shadow-md motion-safe:animate-fadeInUp-delay-200 actual-final-class">
          Rise Racer: Tap, Race, Earn!
        </h1>
        <p className="text-lg sm:text-xl text-purple-200 mb-10 sm:mb-16 leading-relaxed max-w-2xl mx-auto motion-safe:animate-fadeInUp-delay-400 actual-final-class">
          Dive into the ultimate{" "}
          <strong className="font-semibold text-white">tap-to-earn</strong>{" "}
          racing game on Telegram, powered by the{" "}
          <strong className="font-semibold text-white">Rise Blockchain</strong>.
          Collect unique NFT cars, compete in thrilling races, and earn rewards
          with every tap!
        </p>
      </header>

      <main
        className="w-full max-w-sm text-center mb-12 sm:mb-16 motion-safe:animate-fadeInUp actual-final-class"
        style={{ animationDelay: "1.4s" }}
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <button
            onClick={handleOpenTelegramLink}
            className=" hover:cursor-pointer flex items-center justify-center w-full px-8 py-4 text-xl font-bold text-white bg-sky-500 rounded-xl shadow-xl hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-400 focus:ring-opacity-60 transition-all duration-200 ease-in-out transform hover:scale-105 group"
          >
            <Image
              src="/telegram-logo.svg"
              alt="Telegram Logo"
              width={32}
              height={32}
              className="mr-3  "
            />
            Play now on Telegram
          </button>
        )}
      </main>

      <footer
        className="w-full text-center py-6 sm:py-8 mt-auto motion-safe:animate-fadeIn actual-final-class"
        style={{ animationDelay: "1.6s" }}
      >
        <div className="flex flex-col items-center justify-center space-y-3 mb-4">
          <p className="text-sm text-purple-300">Built on</p>
          <Image
            src="/rise-logo.svg"
            alt="Rise Blockchain Logo"
            width={100}
            height={35}
            className="opacity-90 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
        <p className="text-xs text-purple-200 opacity-70">
          &copy; {new Date().getFullYear()} Rise Racer. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default RiseRacerLandingPage;
