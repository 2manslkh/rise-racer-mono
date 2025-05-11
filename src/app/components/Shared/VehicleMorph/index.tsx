/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { GetVehicle, GetVehicleBodyPosition } from "@/app/lib/gameplaySettings";

const VehicleMorph = ({
  isMoving,
  vehicleTier = 1,
}: {
  isMoving: boolean;
  vehicleTier: number;
}) => {
  const [bounce, setBounce] = useState<boolean>(true);

  const [wheel, body] = GetVehicle(vehicleTier);
  const baseBottom = GetVehicleBodyPosition(vehicleTier);

  useEffect(() => {
    if (!isMoving) return;

    const interval = setInterval(() => {
      setBounce((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, [isMoving]);

  return (
    <div className="relative w-[140px] h-[100px]">
      <img
        src={body.src}
        alt={`${vehicleTier}_Body`}
        className={`absolute left-1/2 transform -translate-x-1/2 z-2 transition-all duration-500 ease-in-out`}
        style={{
          bottom: bounce ? `${baseBottom + 2}px` : `${baseBottom}px`,
        }}
      />
      {wheel && (
        <img
          src={wheel.src}
          alt={`${vehicleTier}_Wheel`}
          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 z-1`}
        />
      )}
    </div>
  );
};

export default VehicleMorph;
