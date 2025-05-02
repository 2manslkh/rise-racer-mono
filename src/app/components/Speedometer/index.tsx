import { formatToScientific } from "@/app/lib/speed";
import Image from "next/image";

const Speedometer = ({
  currentProgress,
  levelRequirement,
  riseCrystals,
}: {
  currentProgress: number;
  levelRequirement: number;
  riseCrystals: number;
}) => {
  return (
    <div className="w-[397px] h-[72px] bg-[linear-gradient(to_right,_#29004Dcc_28%,_#41007A00_81%)] flex items-center relative">
      <div className="flex gap-4">
        {/* Speedometer */}
        <div className="relative w-[204px] h-[68px]">
          <Image src={"./Speedometer.svg"} alt="Speedometer" fill />
        </div>
        <div className="absolute left-2 top-[2px] text-white font-zen flex items-center justify-between w-[85px]">
          <p className="text-[15px]">{formatToScientific(currentProgress)}</p>
          <p className="text-[7px]">m/s</p>
        </div>

        <div className="absolute left-2 top-[30px] w-[174px] h-[16.5px] clip-parallelogram overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#000000,#F75CFF)] opacity-50" />
          <div
            className="absolute inset-y-0 left-0 bg-[linear-gradient(to_right,#000000,#F75CFF)] transition-all duration-300"
            style={{ width: `${(currentProgress * 100) / levelRequirement}%` }}
          />
        </div>

        <div className="flex flex-col gap-0.5 top-[48px] ">
          {/* Rise Crystals */}
          <div className="gap-2 left-3  text-white font-zen flex h-full  items-center">
            {/* Rise Crystals Icon */}
            <Image
              src={"./rise_crystal.svg"}
              alt="Rise Crystal"
              width={14}
              height={14}
            />
            <p className="text-[14px]">{formatToScientific(riseCrystals)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Speedometer;
