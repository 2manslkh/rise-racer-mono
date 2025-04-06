import Image from "next/image";

export type ShopItem = {
  price: number;
  name: string;
  description: string;
  image: string;
};

const MOCK_DATA: ShopItem[] = [
  {
    price: 20.45,
    name: "Item Number 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
  {
    price: 20.45,
    name: "Item Number 2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
  {
    price: 20.45,
    name: "Item Number 3",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
  {
    price: 20.45,
    name: "Item Number 4",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
  {
    price: 20.45,
    name: "Item Number 5",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "./PFP.svg",
  },
];

const ShopSection = ({
  sectionTitle,
  showItemPreview,
}: {
  sectionTitle: string;
  showItemPreview: (item: ShopItem) => void;
}) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const item = target.closest("[data-id]") as HTMLElement | null;
    const id = item?.getAttribute("data-id");

    if (id) {
      const shopItem = MOCK_DATA.find((item) => item.name === id);
      if (shopItem) {
        showItemPreview(shopItem);
      }
    }
  };

  return (
    <div className="relative w-full flex flex-col gap-2">
      <div className="relative w-full flex items-center justify-between">
        <div className="flex items-center gap-1">
          <p className="font-inter font-bold text-xl text-white">
            {sectionTitle}
          </p>
        </div>
        <p>Filter</p>
      </div>

      <div
        className="relative w-full grid grid-cols-4 gap-2"
        onClick={handleClick}
      >
        {MOCK_DATA.map((item) => (
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
        ))}
      </div>
    </div>
  );
};

export default ShopSection;
