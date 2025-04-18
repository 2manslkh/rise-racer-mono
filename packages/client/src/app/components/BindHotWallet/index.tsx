import { useHotWallet } from "@/app/context/HotWalletContext";
import { useToast } from "@/app/hooks/useToast";
import { logError } from "@/app/lib/error";
import { useAppKitAccount } from "@reown/appkit-controllers/react";
import { useState } from "react";
import { useSignMessage } from "wagmi";

const BindHotWallet = () => {
  const toast = useToast();
  const { address } = useAppKitAccount();
  const { signMessage } = useSignMessage();
  const { loadHotWallet } = useHotWallet();
  const [loading, setLoading] = useState<boolean>(false);

  const handleBind = () => {
    if (loading) return;
    if (!address) {
      toast.error("Main wallet not connected.");
      return;
    }
    setLoading(true);
    signMessage(
      { message: "Login to Rise Racers" },
      {
        onSuccess: async (data) => {
          try {
            await loadHotWallet({
              address: address,
              message: "Login to Rise Racers",
              signature: data,
            });
            setLoading(false);
          } catch (error) {
            logError(error);
            toast.error("Error binding hot wallet");
          }
        },
      }
    );
  };

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
          onClick={handleBind}
          className="w-full bg-[#5700A3] py-2 rounded-xl"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
    </>
  );
};

export default BindHotWallet;
