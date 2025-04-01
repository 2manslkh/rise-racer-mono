import Image from "next/image";

const IconButtonV2 = ({
  icon,
  alt,
  colorStart = "#A82B7E",
  colorEnd = "#502289",
  handleClick,
  highlightPosition,
}: {
  icon: string;
  alt: string;
  colorStart?: string;
  colorEnd?: string;
  handleClick: () => void;
  highlightPosition?: "top-left" | "bottom-right";
}) => {
  return (
    <button
      className={`relative w-[70px] h-[42px] rounded-sm border-2 border-solid border-[#E833F8] flex items-center justify-center`}
      onClick={handleClick}
      style={{
        background: `linear-gradient(to right, ${colorStart} 0%, ${colorEnd} 100%)`,
      }}
    >
      <div className="relative w-[30px] h-[30px]">
        <Image src={icon} alt={alt} fill />
      </div>

      {highlightPosition === "top-left" && (
        <div className="absolute top-[-2px] left-[-2px] w-0 h-0 border-b-[20px] border-l-[20px] border-b-transparent border-l-[#FFFFBB]"></div>
      )}
      {highlightPosition === "bottom-right" && (
        <div className="absolute bottom-[-2px] right-[-2px] w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-[#FFFFBB]"></div>
      )}
    </button>
  );
};

export default IconButtonV2;
