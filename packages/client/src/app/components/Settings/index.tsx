import Image from "next/image";
import Toggle from "../Shared/Toggle";
import { useAppKitAccount } from "@reown/appkit-controllers/react";
import { useDisconnect } from "@reown/appkit/react";
import { shortenAddress } from "@/app/lib/address";
import { copyToClipboard } from "@/app/lib/copy";

const Settings = ({
  hotWallet,
  open,
  toggleSettings,
  musicPlaying,
  toggleMusicPlaying,
}: {
  hotWallet: string;
  open: boolean;
  toggleSettings: () => void;
  musicPlaying: boolean;
  toggleMusicPlaying: () => void;
}) => {
  const { address } = useAppKitAccount();
  const { disconnect } = useDisconnect();

  const handleDisconnect = async () => {
    await disconnect();
  };

  return (
    <>
      {open && (
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-1 h-screen max-h-[896px]"
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
        className={`absolute bg-white shadow-xl rounded-[12px] transition-all duration-500 ease-in-out top-3 right-[14px] z-2 h-[253px] origin-top-right ${open ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
        style={{
          width: "calc(100% - 28px)",
        }}
      >
        <div className="relative w-full h-full py-2 px-3 flex flex-col gap-3">
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

            {/* Hot Wallet */}
            <div className="relative w-full flex flex-col gap-[0.5px]">
              <div className="relative w-full flex items-center gap-2 justify-between">
                <p className="text-black text-inter font-bold text-lg">
                  Burner{" "}
                  <span className="font-normal">
                    {shortenAddress(hotWallet || "")}
                  </span>
                </p>
                <button
                  className="relative w-6 h-6"
                  onClick={() => copyToClipboard(hotWallet)}
                >
                  <Image src={"./Copy.svg"} alt="Copy" fill />
                </button>
              </div>

              <p className="text-black text-inter text-sm">
                All gas used from interacting with the game will be consumed
                from this wallet. Please top up with RISE in RISE chain. Any top
                up in other chains will not be refunded.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
