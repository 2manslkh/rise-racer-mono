import Tier1 from "../assets/vehicle/tier1.svg";

export const GetVehicle = (tier: number = 1) => {
  switch (tier) {
    case 1:
      return Tier1;
    default:
      return Tier1;
  }
};
