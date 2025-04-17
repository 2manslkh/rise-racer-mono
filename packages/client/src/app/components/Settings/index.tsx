import Toggle from "../Shared/Toggle";
import { useAppKitAccount } from "@reown/appkit-controllers/react";
import { useDisconnect } from "@reown/appkit/react";
import { shortenAddress } from "@/app/lib/address";
import HotWalletManager from "../HotWalletManager";
import { useHotWallet } from "@/app/context/HotWalletContext";

const Settings = ({
  open,
  toggleSettings,
  musicPlaying,
  toggleMusicPlaying,
}: {
  open: boolean;
  toggleSettings: () => void;
  musicPlaying: boolean;
  toggleMusicPlaying: () => void;
}) => {
  const { address } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { disconnectHotWallet } = useHotWallet();

  const handleDisconnect = async () => {
    disconnectHotWallet();
    await disconnect();
  };

  return (
    <>
      {open && (
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-1 h-screen md:max-h-[750px]"
          onClick={toggleSettings}
        >
          <div className="absolute left-1/2 -translate-x-1/2 bottom-20 z-1 whitespace-nowrap">
            <p className="text-white font-semibold text-base">
              Tap anywhere to close this tab
            </p>
          </div>
        </div>
      )}

      <div
        className={`absolute bg-white shadow-xl rounded-[12px] transition-all duration-500 ease-in-out top-3 right-[14px] z-2 h-[310px] origin-top-right ${open ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
        style={{
          width: "calc(100% - 28px)",
        }}
      >
        <div className="relative w-full h-full py-2 px-3 flex flex-col gap-3 overflow-y-auto">
          <p
            className="font-zen text-white text-3xl relative"
            style={{
              WebkitTextStroke: "1.5px #74007E",
            }}
          >
            SETTINGS
          </p>

          <div className="relative w-full flex flex-col gap-2">
            {/* Sound */}
            <div className="relative w-full flex items-center gap-2 justify-between">
              <p className="text-black text-inter font-bold text-lg">Sound</p>
              <Toggle
                checked={musicPlaying}
                handleChange={toggleMusicPlaying}
              />
            </div>

            {/* Main Wallet */}
            <div className="relative w-full flex items-center gap-2 justify-between">
              <p className="text-black text-inter font-bold text-lg">
                Main{" "}
                <span className="font-normal">
                  {shortenAddress(address || "")}
                </span>
              </p>
              <button
                type="button"
                onClick={handleDisconnect}
                className="text-white bg-[#0F0F0F] rounded-full h-8 w-30"
              >
                Disconnect
              </button>
            </div>

            {/* Replace Hot Wallet display with the manager component */}
            <HotWalletManager />
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
