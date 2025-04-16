import { useState } from "react";
import Image from "next/image";
import { ItemType, ShopItem } from "./type";
import ShopSection from "./section";

const Shop = () => {
  const [selectedItemPreview, setSelectedItemPreview] = useState<ShopItem>();

  const handleItemPreview = (item: ShopItem | undefined) => {
    setSelectedItemPreview(item);
  };

  return (
    <div className="relative w-full h-full bg-[#2A004F] flex flex-col py-4 px-2 items-center gap-4">
      <div className="relative w-full flex items-center justify-center px-3">
        <p
          className="font-zen text-white text-[26px] relative"
          style={{
            WebkitTextStroke: "1.5px #74007E",
          }}
        >
          SHOPPING
        </p>
      </div>
      <div
        className="relative w-full bg-[#5700A3] rounded-xl p-4 overflow-y-auto gap-2 flex flex-col"
        style={{ height: `calc(100% - 68px - 50px)` }}
      >
        <ShopSection
          itemType={ItemType.ENGINE}
          showItemPreview={handleItemPreview}
        />
        <ShopSection
          itemType={ItemType.TURBO}
          showItemPreview={handleItemPreview}
        />
        <ShopSection
          itemType={ItemType.CHASSIS}
          showItemPreview={handleItemPreview}
        />
        <ShopSection
          itemType={ItemType.WHEELS}
          showItemPreview={handleItemPreview}
        />
      </div>

      {selectedItemPreview && (
        <>
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-1 h-screen md:max-h-[750px]"
            onClick={() => handleItemPreview(undefined)}
          ></div>

          <div className="fixed left-0 bottom-0 right-0 h-100 bg-white z-3 rounded-t-4xl flex flex-col gap-4 p-3">
            <div className="flex justify-between">
              <div className="relative w-[180px] h-[180px] rounded-3xl overflow-hidden">
                <Image
                  src={selectedItemPreview.image}
                  alt={selectedItemPreview.name}
                  fill
                />
              </div>
              <div className="flex flex-col gap-4 items-end flex-1">
                <div className="flex items-center gap-1">
                  <p className="font-inter font-bold text-xl text-[#5700A3]">
                    {selectedItemPreview.price}
                  </p>
                  <div className="relative h-9 w-9">
                    <Image src={"./USDT.svg"} alt="USDT" fill />
                  </div>
                </div>
                <p className="font-inter font-bold text-xl text-[#5700A3]">
                  {selectedItemPreview.name}
                </p>
                <button className="flex items-center gap-1 bg-[#53AE94] rounded-xl py-2 px-3">
                  <p className="font-inter font-bold text-lg text-white">Buy</p>
                  <div className="relative w-6 h-6">
                    <Image src={"./Shop.svg"} alt="Buy" fill />
                  </div>
                </button>
              </div>
            </div>

            <p className="font-inter font-semibold text-base text-[#5700A3]">
              {selectedItemPreview.description}
            </p>

            <div
              className="absolute top-2 left-2 h-9 w-9"
              onClick={() => handleItemPreview(undefined)}
            >
              <Image src={"./Close.svg"} alt="Close" fill />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Shop;
