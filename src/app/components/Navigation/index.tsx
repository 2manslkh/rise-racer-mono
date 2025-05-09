import Image from "next/image";
import IconButton from "../Shared/IconButton";
import Settings from "../Settings";
import { Tutorial } from "../Tutorial";

const Navigation = ({
  musicPlaying,
  toggleMusicPlaying,
  toggleSettings,
  isSettingsOpen,
  toggleTutorial,
  isTutorialOpen,
}: {
  musicPlaying: boolean;
  toggleMusicPlaying: () => void;
  toggleSettings: () => void;
  isSettingsOpen: boolean;
  toggleTutorial: () => void;
  isTutorialOpen: boolean;
}) => {
  return (
    <>
      <div
        className="absolute top-0 left-0 right-0 h-[225px] lg:[250px] pointer-events-none z-1"
        style={{
          background:
            "linear-gradient(to bottom, #29004D 35%, rgba(41, 0, 77, 0) 100%)",
        }}
      ></div>

      <div className="absolute top-0 left-0 right-0 z-3">
        <nav className="absolute top-0 left-0 w-full flex items-center justify-center px-5 py-3 z-2">
          <div className="absolute top-[18px] left-5 z-3 pointer-events-auto flex items-center gap-2">
            {!isSettingsOpen && (
              <IconButton
                icon={"/question_mark.svg"}
                alt="Tutorial"
                colorStart={"#460082"}
                colorEnd={"#5700A3"}
                handleClick={toggleTutorial}
              />
            )}
          </div>

          <div className="relative w-[183px] h-[48px]">
            <Image src={"/RiseRacerLogo.png"} alt="Rise Racer" fill />
          </div>

          <div className="absolute top-[18px] right-5 z-3 pointer-events-auto flex items-center gap-2">
            {!isTutorialOpen && (
              <IconButton
                icon={"/Gear.svg"}
                alt="Settings"
                colorStart={"#460082"}
                colorEnd={"#5700A3"}
                handleClick={toggleSettings}
              />
            )}
          </div>
          <Settings
            open={isSettingsOpen}
            toggleSettings={toggleSettings}
            musicPlaying={musicPlaying}
            toggleMusicPlaying={toggleMusicPlaying}
          />
          <Tutorial open={isTutorialOpen} toggleTutorial={toggleTutorial} />
        </nav>
      </div>
    </>
  );
};

export default Navigation;
