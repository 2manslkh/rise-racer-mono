"use client";

import { useEffect, useState } from "react";
import Gameplay from "./components/Gameplay";
import Navigation from "./components/Navigation";
import Menu from "./components/Menu";
import Login from "./components/Login";

export default function Home() {
  const [connected, setConnected] = useState<boolean>(false);

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

  if (!connected) {
    return <Login handleClick={() => setConnected(true)} />;
  }

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
