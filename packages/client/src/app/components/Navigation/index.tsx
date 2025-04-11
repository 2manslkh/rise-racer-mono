import Image from "next/image";
import IconButton from "../Shared/IconButton";
import Settings from "../Settings";

const Navigation = ({
  musicPlaying,
  toggleMusicPlaying,
  toggleSettings,
  isSettingsOpen,
  hotWallet,
}: {
  musicPlaying: boolean;
  toggleMusicPlaying: () => void;
  toggleSettings: () => void;
  isSettingsOpen: boolean;
  hotWallet: string;
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-3">
      <div
        className="relative h-[200px]"
        style={{
          background:
            "linear-gradient(to bottom, #29004D 35%, rgba(41, 0, 77, 0) 100%)",
        }}
      ></div>
      <nav className="absolute top-0 left-0 w-full flex items-center justify-center px-5 py-3 z-2">
        <div className="relative w-[183px] h-[48px]">
          <Image src={"/RiseRacerLogo.png"} alt="Rise Racer" fill />
        </div>

        <div className="absolute top-[18px] right-5 z-3">
          {/* {gameStarted ? (
            <IconButton
              icon={musicPlaying ? "/MusicPlaying.svg" : "/MusicMuted.svg"}
              alt="Music"
              colorStart={musicPlaying ? "#460082" : "#323232"}
              colorEnd={musicPlaying ? "#5700A3" : "#3E3E3E"}
              handleClick={handleToggleMusicPlaying}
            />
          ) : (
            <IconButton
              icon={"/Gear.svg"}
              alt="Settings"
              colorStart={"#460082"}
              colorEnd={"#5700A3"}
              handleClick={toggleSettings}
            />
          )} */}
          <IconButton
            icon={"/Gear.svg"}
            alt="Settings"
            colorStart={"#460082"}
            colorEnd={"#5700A3"}
            handleClick={toggleSettings}
          />
        </div>
        <Settings
          hotWallet={hotWallet}
          open={isSettingsOpen}
          toggleSettings={toggleSettings}
          musicPlaying={musicPlaying}
          toggleMusicPlaying={toggleMusicPlaying}
        />
      </nav>
    </div>
  );
};

export default Navigation;
