import Tier1 from "../assets/vehicle/tier1.svg";
import Tier2 from "../assets/vehicle/tier2.svg";
import Tier3 from "../assets/vehicle/tier3.svg";
import Tier4 from "../assets/vehicle/tier4.svg";
import Tier5 from "../assets/vehicle/tier5.svg";

export const GetVehicle = (tier: number = 1) => {
  switch (tier) {
    case 1:
      return Tier1;
    case 2:
      return Tier2;
    case 3:
      return Tier3;
    case 4:
      return Tier4;
    case 5:
      return Tier5;
    default:
      return Tier1;
  }
};
