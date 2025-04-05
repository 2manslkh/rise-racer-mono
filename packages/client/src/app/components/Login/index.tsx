import Image from "next/image";
import WalletConnectButton from "../Shared/WalletConnectButton";

const Login = () => {
  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full">
        <Image src={"/LoginBackground.png"} alt="Login Background" fill />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 top-[10px] w-[270px] h-[71px]">
        <Image src={"/RiseRacerLogo.png"} alt="Rise Racer" fill />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
        <WalletConnectButton />
      </div>
    </div>
  );
};

export default Login;
