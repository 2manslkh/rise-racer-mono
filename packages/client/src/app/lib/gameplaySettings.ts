import Tier1 from "../assets/vehicle/tier1.svg";
import Tier2 from "../assets/vehicle/tier2.svg";
import Tier3 from "../assets/vehicle/tier3.svg";
import Tier4 from "../assets/vehicle/tier4.svg";
import Tier5 from "../assets/vehicle/tier5.svg";
import { hexToRgba } from "../components/Gameplay/util";

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

export const GetRoad = (gradientCtx: CanvasGradient, level: number = 1) => {
  switch (level) {
    case 1:
    case 2:
      gradientCtx.addColorStop(0, "#673506");
      gradientCtx.addColorStop(1, "#AE9175");
      break;
    case 3:
    case 4:
    case 5:
    case 6:
      gradientCtx.addColorStop(0, "#5B4E68");
      gradientCtx.addColorStop(1, "#797687");
      break;
    case 7:
    case 8:
      gradientCtx.addColorStop(0, "#41007A");
      gradientCtx.addColorStop(1, "#230041");
      break;
    case 9:
    case 10:
      gradientCtx.addColorStop(0, hexToRgba("#A600ED", 0.5));
      gradientCtx.addColorStop(1, "#230041");
      break;
    case 11:
    case 12:
      gradientCtx.addColorStop(0, "#17002C");
      gradientCtx.addColorStop(0.15, hexToRgba("#5A00A9", 0.9));
      gradientCtx.addColorStop(0.42, hexToRgba("#0827AE", 0.8));
      gradientCtx.addColorStop(0.57, hexToRgba("#28B800", 0.8));
      gradientCtx.addColorStop(0.71, hexToRgba("#FF7958", 0.7));
      gradientCtx.addColorStop(0.86, hexToRgba("#FFFB00", 0.7));
      gradientCtx.addColorStop(1, hexToRgba("#FF0004", 0.7));
      break;
    default:
      gradientCtx.addColorStop(0, "#41008F");
      gradientCtx.addColorStop(0, "#6C00D3");
  }
};

export const GetBackground = (level: number = 1) => {
  const base = "./gameplay/background/";
  switch (level) {
    case 1:
    case 2:
      return base + "background1.png";
    case 3:
    case 4:
      return base + "background2.svg";
    case 5:
    case 6:
      return base + "background3.svg";
    case 7:
    case 8:
      return base + "background4.svg";
    case 9:
    case 10:
      return base + "background5.svg";
    case 11:
    case 12:
      return base + "background6.svg";
    default:
      return base + "background1.png";
  }
};

export const GetCenterDividerColor = (level: number = 1) => {
  switch (level) {
    case 1:
    case 2:
    case 9:
    case 10:
    case 11:
    case 12:
      return "#FFF";
    case 3:
    case 4:
      return "#F8E855";
    case 5:
    case 6:
    case 7:
    case 8:
      return "#FFF9C6";
    default:
      return "#FFF";
  }
};

export const GetLevelRequirement = (level: number = 1) => {
  switch (level) {
    case 1:
      return 50;
    case 2:
      return 75;
    // return 343;
    case 3:
      return 100;
    // return 1000;
    case 4:
      return 7800;
    case 5:
      return 11200;
    case 6:
      return 300_000;
    case 7:
      return 3_000_000;
    case 8:
      return 30_000_000;
    case 9:
      return 75_000_000;
    case 10:
      return 150_000_000;
    case 11:
      return 270_000_000;
    case 12:
      return 297_000_000;
    case 13:
      return 299_792_458;
    default:
      return 50;
  }
};

export const GetShouldUpdate = (current: number, next: number) => {
  if (current === 1 && next === 2) return false;
  if (current === 3 && next === 4) return false;
  if (current === 5 && next === 6) return false;
  if (current === 7 && next === 8) return false;
  if (current === 9 && next === 10) return false;
  if (current === 11 && next === 12) return false;
  return true;
};

export type SideObject = {
  y: number;
  spawnY: number;
  startX: number;
  endX: number;
  img: HTMLImageElement;
  depth: number;
  baseWidth: number;
  baseHeight: number;
};

export const LoadSideObjectImages = (level: number = 1): HTMLImageElement[] => {
  const base = "./gameplay/object/";

  switch (level) {
    case 1:
      const imgOne = new Image();
      imgOne.src = base + "level1_1.svg";
      const imgTwo = new Image();
      imgTwo.src = base + "level1_2.svg";
      const imgThree = new Image();
      imgThree.src = base + "level1_3.svg";
      const imgFour = new Image();
      imgFour.src = base + "level1_4.svg";
      const imgFive = new Image();
      imgFive.src = base + "level1_5.svg";
      const imgSix = new Image();
      imgSix.src = base + "level1_6.svg";

      return [imgOne, imgTwo, imgThree, imgFour, imgFive, imgSix];
    default:
      return [];
  }
};

export const GenerateSideObject = (
  assets: HTMLImageElement[],
  roadTopLeft: number,
  roadTopRight: number,
  roadBottomLeft: number,
  roadBottomRight: number
): SideObject => {
  const img = assets[Math.floor(Math.random() * assets.length)];
  const side = Math.random() < 0.5 ? "left" : "right";
  const depth = Math.ceil(Math.random() * 3);
  const objWidth = img.naturalWidth * 0.6 || 40;
  const objHeight = img.naturalHeight * 0.6 || 40;

  const startX = side === "left" ? roadTopLeft - 40 : roadTopRight + 10;
  const endX = side === "left" ? roadBottomLeft - 40 : roadBottomRight + 10;

  return {
    y: -objHeight,
    spawnY: -objHeight,
    startX,
    endX,
    img,
    depth,
    baseWidth: objWidth,
    baseHeight: objHeight,
  };
};

export const DrawSideObject = (
  ctx: CanvasRenderingContext2D,
  roadY: number,
  lastSpawn: number,
  spawnGap: number,
  width: number,
  height: number,
  roadWidthTop: number,
  sideObjects: SideObject[],
  assets: HTMLImageElement[],
  speed: number
) => {
  if (roadY - lastSpawn > spawnGap) {
    const buffer = 20;
    const topLeft = (width - roadWidthTop) / 2 - buffer;
    const topRight = (width + roadWidthTop) / 2 + buffer;
    const bottomLeft = -(buffer + 20);
    const bottomRight = width + buffer;
    sideObjects.push(
      GenerateSideObject(assets, topLeft, topRight, bottomLeft, bottomRight)
    );
    lastSpawn = roadY;
  }

  sideObjects.forEach((obj) => {
    obj.y += speed;
    const progress = Math.min(1, (obj.y - obj.spawnY) / height);
    const currentX = obj.startX + (obj.endX - obj.startX) * progress;
    ctx.drawImage(obj.img, currentX, obj.y, obj.baseWidth, obj.baseHeight);
  });

  sideObjects = sideObjects.filter(
    (obj) => obj.y <= height + obj.baseHeight + 50
  );
};
