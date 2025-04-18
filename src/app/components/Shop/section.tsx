import Image from "next/image";
import { useEffect, useState } from "react";
import { ItemType, ShopItem } from "./type";
import { GetSectionTitle, GetShopData } from "./data";

const RenderShopItem = (item: ShopItem) => {
  return (
    <div
      className="relative w-full flex flex-col gap-1"
      key={item.name}
      data-id={item.name}
    >
      <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-solid border-white">
        <Image src={item.image} alt={item.name} fill />
        <div className="absolute top-1 right-1 flex items-center gap-0.5">
          <p className="font-inter font-bold text-white text-xs">
            {item.price}
          </p>
          <div className="relative h-[14px] w-[14px]">
            <Image src={"./USDT.svg"} alt="USDT" fill />
          </div>
        </div>
      </div>
      <p
        className="font-inter font-bold text-white text-xs"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {item.name}
      </p>
    </div>
  );
};

const ShopSection = ({
  itemType,
  showItemPreview,
}: {
  itemType: ItemType;
  showItemPreview: (item: ShopItem) => void;
}) => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const [data, setData] = useState<ShopItem[]>([]);

  useEffect(() => {
    setData(GetShopData(itemType));
  }, [itemType]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const item = target.closest("[data-id]") as HTMLElement | null;
    const id = item?.getAttribute("data-id");

    if (id) {
      const shopItem = data.find((item) => item.name === id);
      if (shopItem) {
        showItemPreview(shopItem);
      }
    }
  };

  return (
    <div className="relative w-full flex flex-col gap-2">
      <div className="relative w-full flex items-center justify-between">
        <div
          className="flex items-center gap-2"
          onClick={() => setShowAll((prevState) => !prevState)}
        >
          <p className="font-inter font-bold text-xl text-white">
            {GetSectionTitle(itemType)}
          </p>
          {data.length > 4 && (
            <div className={`${showAll ? "rotate-90" : ""}`}>
              <svg
                width="11"
                height="14"
                viewBox="0 0 11 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.5 7.86602C11.1667 7.48112 11.1667 6.51888 10.5 6.13397L1.5 0.937821C0.833333 0.552921 0 1.03405 0 1.80385V12.1962C0 12.966 0.833333 13.4471 1.5 13.0622L10.5 7.86602Z"
                  fill="white"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      <div
        className="relative w-full grid grid-cols-4 gap-2"
        onClick={handleClick}
      >
        {showAll
          ? data.map((item) => RenderShopItem(item))
          : data.slice(0, 4).map((item) => RenderShopItem(item))}
      </div>
    </div>
  );
};

export default ShopSection;
