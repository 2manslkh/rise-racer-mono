import IconButtonV2 from "../Shared/IconButtonV2";

const Menu = () => {
  return (
    <div className="fixed bottom-0 left-0 z-1 w-screen">
      <div
        className="relative h-[230px] mb-[-150px] flex items-start justify-between px-4"
        style={{
          background:
            "linear-gradient(to top, #29004D 73%, rgba(41, 0, 77, 0) 100%)",
        }}
      >
        <IconButtonV2
          icon={"/Shop.svg"}
          alt="Shop"
          handleClick={() => {}}
          highlightPosition="top-left"
        />
        <IconButtonV2
          icon={"/Leaderboard.svg"}
          alt="Leaderboard"
          handleClick={() => {}}
          highlightPosition="bottom-right"
        />
      </div>
    </div>
  );
};

export default Menu;
