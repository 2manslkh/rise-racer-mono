const BindHotWallet = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-3 h-screen max-h-[896px]"></div>
      <div className="fixed flex flex-col items-center justify-center w-[90%] max-w-[300px] h-content bg-white z-3 p-4 rounded-xl top-1/2 left-1/2 transform -translate-1/2">
        <p>Bind your hot wallet</p>
        <p>
          This is to allow you to top up gas into this wallet for
          transactionless interactions with our game!
        </p>
        <button onClick={handleClick}>Bind</button>
      </div>
    </>
  );
};

export default BindHotWallet;
