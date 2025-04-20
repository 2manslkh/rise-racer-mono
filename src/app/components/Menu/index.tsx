import IconButtonV2 from "../Shared/IconButtonV2";
import StartButton, { BUTTON_STYLES } from "../Shared/StartButton";

export enum MenuAction {
  OPEN_SHOP,
  START_GAME,
  OPEN_LEADERBOARD,
  OPEN_STAKING,
  OPEN_RISE_CRYSTALS,
}

const Menu = ({
  gameStarted,
  handleClick,
}: {
  gameStarted: boolean;
  handleClick: (_menuAction: MenuAction) => void;
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
        <div className="absolute z-3 top-0 left-4">
          <IconButtonV2
            icon={"/Shop.svg"}
            alt="Shop"
            handleClick={() => handleClick(MenuAction.OPEN_SHOP)}
            highlightPosition="top-left"
          />
        </div>

        <div className="absolute z-3 top-0 left-[calc(25%_-_20px)]">
          <IconButtonV2
            icon={"/Staking.svg"}
            alt="Staking"
            handleClick={() => handleClick(MenuAction.OPEN_STAKING)}
            highlightPosition="top-left"
          />
        </div>

        <div
          className="absolute z-2"
          style={{
            top: gameStarted
              ? BUTTON_STYLES.DISABLED.top
              : BUTTON_STYLES.DEFAULT.top,
            left: gameStarted
              ? `calc(calc(100% - ${BUTTON_STYLES.DISABLED.width})/2)`
              : `calc(calc(100% - ${BUTTON_STYLES.DEFAULT.width})/2)`,
            display: gameStarted ? "none" : "block",
          }}
        >
          <StartButton
            disabled={gameStarted}
            handleClick={() => handleClick(MenuAction.START_GAME)}
          />
        </div>

        <div className="absolute z-3 top-0 right-4">
          <IconButtonV2
            icon={"/Leaderboard.svg"}
            alt="Leaderboard"
            handleClick={() => handleClick(MenuAction.OPEN_LEADERBOARD)}
            highlightPosition="bottom-right"
          />
        </div>
      </div>
    </div>
  );
};

export default Menu;

// 16 + 70 + 16
