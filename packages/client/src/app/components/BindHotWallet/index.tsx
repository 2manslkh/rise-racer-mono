const BindHotWallet = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-3 h-screen md:max-h-[750px]"></div>
      <div className="fixed flex flex-col items-center justify-center w-[90%] max-w-[350px] h-content bg-white z-3 p-4 rounded-xl top-1/2 left-1/2 transform -translate-1/2 gap-2">
        <p
          className="font-zen text-white text-2xl relative text-center"
          style={{
            WebkitTextStroke: "1.5px #74007E",
          }}
        >
          Login to Rise Racers
        </p>
        {/* <p className="font-inter text-black">INSERT HOT WALLET ADDRESS</p> */}
        <p className="font-inter text-black text-center">
          Login to get your signature for signless transactions during gameplay
        </p>
        <button
          onClick={handleClick}
          className="w-full bg-[#5700A3] py-2 rounded-xl"
        >
          Login
        </button>
      </div>
    </>
  );
};

export default BindHotWallet;
