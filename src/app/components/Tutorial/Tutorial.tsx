const Tutorial = ({
  open,
  toggleTutorial,
}: {
  open: boolean;
  toggleTutorial: () => void;
}) => {
  return (
    <>
      {open && (
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-1 h-screen md:max-h-[750px]"
          onClick={toggleTutorial}
        >
          <div className="absolute left-1/2 -translate-x-1/2 bottom-60 z-1 whitespace-nowrap">
            <p className="text-white font-semibold text-base">
              Tap anywhere to close this tab
            </p>
          </div>
        </div>
      )}

      <div
        className={`absolute bg-white shadow-xl rounded-[12px] transition-all duration-500 ease-in-out top-3 left-[14px] z-2 h-[350px] md:h-[300px] origin-top-left ${open ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
        style={{
          width: "calc(100% - 28px)",
        }}
      >
        <div className="relative w-full h-full py-2 px-3 flex flex-col gap-3 overflow-y-auto">
          <p
            className="font-zen text-white text-3xl relative text-end"
            style={{
              WebkitTextStroke: "1.5px #74007E",
            }}
          >
            HOW TO PLAY
          </p>

          <div className="relative w-full flex flex-col gap-2">
            <ul className="space-y-2 text-black text-inter text-lg">
              <li className="rise-list-marker">
                Tap on the screen to accelerate your racer.
              </li>
              <li className="rise-list-marker">
                Want to go faster? Acquire RiseCrystals by staking ETH.
              </li>
              <li className="rise-list-marker">
                Spend RiseCrystals to increase your acceleration power (Velocity
                per click).
              </li>
              <li className="rise-list-marker">
                Become the fastest racer alive (Leaderboards).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tutorial;
