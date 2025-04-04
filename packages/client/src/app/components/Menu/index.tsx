import IconButtonV2 from "../Shared/IconButtonV2";
import StartButton, { BUTTON_STYLES } from "../Shared/StartButton";

const Menu = ({
  gameStarted,
  handleStart,
}: {
  gameStarted: boolean;
  handleStart: () => void;
}) => {
  return (
    <div className="absolute bottom-0 left-0 z-1 right-0">
      <div
        className="relative h-[68px] flex items-start justify-between px-4"
        style={{
          background:
            "linear-gradient(to top, #29004D 4%, rgba(41, 0, 77, 0) 100%)",
        }}
      >
        <div className="absolute z-2 top-0 left-4">
          <IconButtonV2
            icon={"/Shop.svg"}
            alt="Shop"
            handleClick={() => {}}
            highlightPosition="top-left"
          />
        </div>

        <div
          className="absolute z-3"
          style={{
            top: gameStarted
              ? BUTTON_STYLES.DISABLED.top
              : BUTTON_STYLES.DEFAULT.top,
            left: gameStarted
              ? `calc(calc(100% - ${BUTTON_STYLES.DISABLED.width})/2)`
              : `calc(calc(100% - ${BUTTON_STYLES.DEFAULT.width})/2)`,
          }}
        >
          <StartButton disabled={gameStarted} handleClick={handleStart} />
        </div>

        <div className="absolute z-2 top-0 right-4">
          <IconButtonV2
            icon={"/Leaderboard.svg"}
            alt="Leaderboard"
            handleClick={() => {}}
            highlightPosition="bottom-right"
          />
        </div>
      </div>
    </div>
  );
};

export default Menu;

// 16 + 70 + 16
