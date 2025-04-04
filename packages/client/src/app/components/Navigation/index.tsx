import Image from "next/image";
import IconButton from "../Shared/IconButton";
import { useState } from "react";

const Navigation = ({ gameStarted }: { gameStarted: boolean }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <div className="absolute top-0 left-0 right-0 z-1">
      <div
        className="relative h-[200px] mt-[-54px]"
        style={{
          background:
            "linear-gradient(to bottom, #29004D 35%, rgba(41, 0, 77, 0) 100%)",
        }}
      ></div>
      <nav className="absolute top-0 left-0 w-full flex items-center justify-between px-5 py-3 z-2">
        <div className="w-9 h-9"></div>
        <div className="relative w-[183px] h-[48px]">
          <Image src={"/RiseRacerLogo.png"} alt="Rise Racer" fill />
        </div>
        {gameStarted ? (
          <IconButton
            icon={isPlaying ? "/MusicPlaying.svg" : "/MusicMuted.svg"}
            alt="Music"
            colorStart={isPlaying ? "#460082" : "#323232"}
            colorEnd={isPlaying ? "#5700A3" : "#3E3E3E"}
            handleClick={() => setIsPlaying((prevState) => !prevState)}
          />
        ) : (
          <IconButton
            icon={"/Gear.svg"}
            alt="Settings"
            colorStart={"#460082"}
            colorEnd={"#5700A3"}
            handleClick={() => {}}
          />
        )}
      </nav>
    </div>
  );
};

export default Navigation;
