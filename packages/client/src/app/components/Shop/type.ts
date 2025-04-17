export type ShopItem = {
  price: number;
  name: string;
  description: string;
  image: string;
};

export enum ItemType {
  ENGINE,
  TURBO,
  CHASSIS,
  WHEELS,
}
