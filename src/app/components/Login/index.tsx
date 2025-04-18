import Image from "next/image";
import WalletConnectButton from "../Shared/WalletConnectButton";
import { useEffect, useState } from "react";
import LoadingConnect from "../Shared/LoadingConnect";
import { useAccount } from "wagmi";

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

const Login = () => {
  const { isConnected } = useAccount();
  const hasMounted = useHasMounted();

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full">
        <Image src={"/LoginBackground.png"} alt="Login Background" fill />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 top-[10px] w-[270px] h-[71px]">
        <Image src={"/RiseRacerLogo.png"} alt="Rise Racer" fill />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
        {hasMounted ? (
          <>{!isConnected ? <WalletConnectButton /> : <LoadingConnect />}</>
        ) : (
          <LoadingConnect />
        )}
      </div>
    </div>
  );
};

export default Login;
