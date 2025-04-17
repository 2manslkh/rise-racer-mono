import Image from "next/image";
import { useAppKit } from "@reown/appkit/react";

const LoadingConnect = () => {
  return (
    <button className="relative w-[375px] aspect-[391/133]">
      <div className="relative w-full h-full ml-[-20px]">
        <Image src={"/WalletConnectBackground.svg"} alt="Wallet Connect" fill />
      </div>

      <div className="absolute z-1 top-[48px] left-[120px]">
        <p
          className="font-zen text-white text-[28px] relative"
          style={{
            WebkitTextStroke: "1.5px #f037ff",
          }}
        >
          Loading
        </p>

        <p
          className="font-zen text-transparent text-[28px] absolute inset-0 bg-clip-text pointer-events-none"
          style={{
            WebkitTextStroke: "1.5px transparent",
            WebkitTextFillColor: "transparent",
            backgroundImage:
              "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            backgroundRepeat: "no-repeat",
            animation: "mirror-sweep 1.5s linear infinite",
          }}
        >
          Loading
        </p>
      </div>
    </button>
  );
};

export default LoadingConnect;
