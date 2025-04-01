"use client";

import { useEffect } from "react";
import Gameplay from "./components/Gameplay";
import Navigation from "./components/Navigation";
import Menu from "./components/Menu";

export default function Home() {
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
    <div className="relative w-screen h-screen overflow-hidden">
      <Navigation />
      <Menu />
      <div className="relative w-full h-full">
        <Gameplay />
      </div>
    </div>
  );
}
