/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";

const IconButton = ({
  icon,
  alt,
  colorStart = "#460082",
  colorEnd = "#5700A3",
  handleClick,
}: {
  icon: any;
  alt: string;
  colorStart?: string;
  colorEnd?: string;
  handleClick: () => void;
}) => {
  return (
    <button
      className={`relative w-9 h-9 rounded-xl border border-solid border-[#FF8AEE] flex items-center justify-center`}
      onClick={handleClick}
      style={{
        background: `linear-gradient(to top right, ${colorStart} 50%, ${colorEnd} 50%)`,
      }}
    >
      <div className="relative w-6 h-6">
        <Image src={icon} alt={alt} fill />
      </div>
    </button>
  );
};

export default IconButton;
