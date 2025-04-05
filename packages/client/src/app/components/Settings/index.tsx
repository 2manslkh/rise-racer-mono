import Image from "next/image";
import Toggle from "../Shared/Toggle";
import { useAppKitAccount } from "@reown/appkit-controllers/react";
import { useDisconnect } from "@reown/appkit/react";
import { shortenAddress } from "@/app/lib/address";
import { User } from "@/app/page";

const Settings = ({
  open,
  toggleSettings,
  user,
}: {
  open: boolean;
  toggleSettings: () => void;
  user: User;
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
          className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-1 h-screen"
          onClick={toggleSettings}
        />
      )}

      <div
        className={`absolute bg-white shadow-xl rounded-[12px] transition-all duration-500 ease-in-out top-3 right-[14px] z-2 ${open ? "h-[510px] opacity-100" : "h-6 opacity-0"}`}
        style={{ width: open ? "calc(100% - 28px)" : "24px" }}
      >
        <div className="relative w-full p-2 flex flex-col gap-3">
          {/* PFP Image */}
          <div className="relative w-full aspect-square rounded-[12px] overflow-hidden pfp">
            <Image src={user.profilePicture} alt="PFP" fill />
            <div className="absolute top-2 left-2 w-6 aspect-square [filter:brightness(0)_saturate(100%)_invert(1)]">
              <Image src={"./Edit.svg"} alt="Edit PFP" fill />
            </div>

            <div className="absolute top-0 right-0 w-11 h-11 z-10">
              <div className="w-full h-full bg-white backdrop-blur-sm rounded-bl-[24px]" />
            </div>
          </div>

          <div className="relative w-full flex flex-col px-6 gap-2">
            {/* Name */}
            <div className="relative flex items-center gap-2">
              <p className="text-primary text-inter font-bold text-xl">
                {user.displayName}
              </p>
              <div className="relative w-6 aspect-square cursor-pointer">
                <Image src={"./Edit.svg"} alt="Edit Name" fill />
              </div>
            </div>

            {/* Sound */}
            <div className="relative w-full flex items-center gap-2 justify-between">
              <p className="text-black text-inter font-bold text-lg">Sound</p>
              <Toggle />
            </div>

            {/* Language */}
            <div className="relative w-full flex items-center gap-2 justify-between">
              <p className="text-black text-inter font-bold text-lg">
                Language
              </p>
            </div>

            {/* Wallet */}
            <div className="relative w-full flex items-center gap-2 justify-between">
              <p className="text-black text-inter">
                {shortenAddress(address || "")}
              </p>
              <button
                type="button"
                onClick={handleDisconnect}
                className="text-white bg-[#0F0F0F] rounded-full h-8 w-30"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
