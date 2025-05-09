import IconButtonV2 from "../Shared/IconButtonV2";

export enum MenuAction {
  OPEN_SHOP,
  START_GAME,
  OPEN_LEADERBOARD,
  OPEN_STAKING,
  OPEN_RISE_CRYSTALS,
}

const Menu = ({
  handleClick,
}: {
  gameStarted: boolean;
  handleClick: (_menuAction: MenuAction) => void;
}) => {
  return (
    <div className="absolute bottom-0 left-0 z-1 right-0">
      <div
        className="relative h-[88px] flex items-center justify-around px-2 pt-2"
        style={{
          background:
            "linear-gradient(to top, #29004D 10%, rgba(41, 0, 77, 0) 100%)",
        }}
      >
        <div className="flex flex-col items-center">
          <IconButtonV2
            icon={"/Shop.svg"}
            alt="Shop"
            handleClick={() => handleClick(MenuAction.OPEN_SHOP)}
          />
          <p className="text-white text-xs mt-1">Shop</p>
        </div>

        <div className="flex flex-col items-center">
          <IconButtonV2
            icon={"/Staking.svg"}
            alt="Staking"
            handleClick={() => handleClick(MenuAction.OPEN_STAKING)}
          />
          <p className="text-white text-xs mt-1">Staking</p>
        </div>

        <div className="flex flex-col items-center">
          <IconButtonV2
            icon={"/Leaderboard.svg"}
            alt="Leaderboard"
            handleClick={() => handleClick(MenuAction.OPEN_LEADERBOARD)}
          />
          <p className="text-white text-xs mt-1">Leaderboard</p>
        </div>
      </div>
    </div>
  );
};

export default Menu;

// 16 + 70 + 16
