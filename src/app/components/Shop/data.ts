import { ItemType, ShopItem } from "./type";

export const GetSectionTitle = (type: ItemType) => {
  switch (type) {
    case ItemType.ENGINE:
      return "Engine";
    case ItemType.CHASSIS:
      return "Chassis";
    case ItemType.TURBO:
      return "Turbo";
    case ItemType.WHEELS:
      return "Wheels";
    default:
      return "";
  }
};

export const GetShopData = (type: ItemType) => {
  switch (type) {
    case ItemType.ENGINE:
      return ENGINE_SHOP_DATA;
    case ItemType.CHASSIS:
      return CHASSIS_SHOP_DATA;
    case ItemType.TURBO:
      return TURBO_SHOP_DATA;
    case ItemType.WHEELS:
      return WHEELS_SHOP_DATA;
    default:
      return [];
  }
};

export const ENGINE_SHOP_DATA: ShopItem[] = [
  {
    price: 1,
    name: "Common Engine",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
  {
    price: 2,
    name: "Rare Engine",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
  {
    price: 3,
    name: "Epic Engine",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
  {
    price: 4,
    name: "Legendary Engine",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
];

export const TURBO_SHOP_DATA: ShopItem[] = [
  {
    price: 1,
    name: "Common Turbo",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
  {
    price: 2,
    name: "Rare Turbo",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
  {
    price: 3,
    name: "Epic Turbo",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
  {
    price: 4,
    name: "Legendary Turbo",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
];

export const WHEELS_SHOP_DATA: ShopItem[] = [
  {
    price: 1,
    name: "Common Wheels",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
  {
    price: 2,
    name: "Rare Wheels",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
  {
    price: 3,
    name: "Epic Wheels",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
  {
    price: 4,
    name: "Legendary Wheels",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
];

export const CHASSIS_SHOP_DATA: ShopItem[] = [
  {
    price: 1,
    name: "Common Chassis",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
  {
    price: 2,
    name: "Rare Chassis",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
  {
    price: 3,
    name: "Epic Chassis",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
  {
    price: 4,
    name: "Legendary Chassis",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
];
