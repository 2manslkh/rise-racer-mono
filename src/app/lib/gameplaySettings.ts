import Tier1 from "../assets/vehicle/tier1.svg";
import Tier2 from "../assets/vehicle/tier2.svg";
import Tier3 from "../assets/vehicle/tier3.svg";
import Tier4 from "../assets/vehicle/tier4.svg";
import Tier5 from "../assets/vehicle/tier5.svg";
import { hexToRgba } from "../components/Gameplay/canvas/util";

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
      gradientCtx.addColorStop(0, hexToRgba("#41007A", 0.5));
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
      return base + "background5.png";
    case 11:
    case 12:
      return base + "background6.svg";
    default:
      return base + "background1.png";
  }
};

export const GetBackgroundObjects = (level: number = 1): BackgroundObject[] => {
  const base = "./gameplay/background/object/";

  // The sequence of the object in the array determines the z index
  switch (level) {
    case 3:
    case 4:
      return [
        {
          image: base + "City.svg",
          width: 414,
          height: 90,
          y: 70,
          x: 0,
        },
      ];
    case 7:
    case 8:
      return [
        // {
        //   image: base + "World.svg",
        //   height: 550,
        //   width: 550,
        //   x: -100,
        //   y: -200,
        // },
      ];
    default:
      return [];
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
      return 343;
    case 3:
      return 1_000;
    case 4:
      return 7_800;
    case 5:
      return 11_200;
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

export const GetShouldUpdateCanvas = (current: number, next: number) => {
  if (current === 1 && next === 2) return false;
  if (current === 3 && next === 4) return false;
  if (current === 5 && next === 6) return false;
  if (current === 7 && next === 8) return false;
  if (current === 9 && next === 10) return false;
  if (current === 11 && next === 12) return false;
  if (current === 12 && next === 13) return false;
  return true;
};

export type SideObject = {
  y: number;
  spawnY: number;
  startX: number;
  endX: number;
  img: HTMLImageElement;
  baseWidth: number;
  baseHeight: number;
};

export const LoadSideObjectImages = (level: number = 1): HTMLImageElement[] => {
  const base = "./gameplay/object/";

  switch (level) {
    case 1:
    case 2:
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
    case 3:
    case 4:
      const imgLampPostLeft = new Image();
      imgLampPostLeft.src = base + "LamppostLeft.svg";
      const imgLampPostRight = new Image();
      imgLampPostRight.src = base + "LamppostRight.svg";
      return [imgLampPostLeft, imgLampPostRight];
    case 5:
    case 6:
      const imgLeftMarker = new Image();
      imgLeftMarker.src = base + "LeftMarker.svg";
      const imgRightMarker = new Image();
      imgRightMarker.src = base + "RightMarker.svg";
      return [imgLeftMarker, imgRightMarker];
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
      const imgShootingStar = new Image();
      imgShootingStar.src = base + "ShootingStar.svg";
      return [imgShootingStar];
    default:
      return [];
  }
};

export const GenerateRandomSideObject = (
  assets: HTMLImageElement[],
  roadTopLeft: number,
  roadTopRight: number,
  roadBottomLeft: number,
  roadBottomRight: number
): SideObject | null => {
  const img = assets[Math.floor(Math.random() * assets.length)];
  const side = Math.random() < 0.5 ? "left" : "right";
  const objWidth = img.naturalWidth || 40;
  const objHeight = img.naturalHeight || 40;

  const startX = side === "left" ? roadTopLeft - 40 : roadTopRight + 10;
  const endX = side === "left" ? roadBottomLeft - 40 : roadBottomRight + 10;

  if ((startX < 0 && endX < 0) || (startX < 50 && endX < 50)) {
    return null;
  }

  return {
    y: -objHeight,
    spawnY: -objHeight,
    startX,
    endX,
    img,
    baseWidth: objWidth,
    baseHeight: objHeight,
  };
};

export const GenerateFixedSideObject = (
  assets: HTMLImageElement[],
  roadTopLeft: number,
  roadTopRight: number,
  roadBottomLeft: number,
  roadBottomRight: number
): SideObject[] => {
  // Left Object
  const imgLeft = assets[0];
  const leftWidth = imgLeft.naturalWidth || 50;
  const leftHeight = imgLeft.naturalHeight || 136;
  const leftStartX = roadTopLeft;
  const leftEndX = roadBottomLeft;
  const leftObject: SideObject = {
    img: imgLeft,
    y: -leftHeight,
    spawnY: -leftHeight,
    startX: leftStartX,
    endX: leftEndX,
    baseWidth: leftWidth,
    baseHeight: leftHeight,
  };

  // Right Object
  const imgRight = assets[1];
  const rightWidth = imgRight.naturalWidth || 50;
  const rightHeight = imgRight.naturalHeight || 136;
  const rightStartX = roadTopRight;
  const rightEndX = roadBottomRight;
  const rightObject: SideObject = {
    img: imgRight,
    y: -rightHeight,
    spawnY: -rightHeight,
    startX: rightStartX,
    endX: rightEndX,
    baseWidth: rightWidth,
    baseHeight: rightHeight,
  };

  if (
    (leftObject.startX < 0 && leftObject.endX < 0) ||
    (rightObject.startX < 0 && rightObject.endX <= 50)
  ) {
    // For Level3,4
    return [];
  }

  return [leftObject, rightObject];
};

export type BackgroundObject = {
  image: string;
  width: number;
  height: number;
  x: number;
  y: number;
};

export type OverlayObject = {
  image: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  dx: number;
  dy: number;
};

export const GenerateOverlayObjects = (
  image: HTMLImageElement,
  screenWidth: number,
  screenHeight: number
): OverlayObject => {
  const scale = Math.random() * 0.5;
  const baseWidth = image.naturalWidth || 100;
  const baseHeight = image.naturalHeight || 50;

  const startY = Math.random() * (screenHeight * 0.6);
  // Normalize startY to a 0–1 range relative to max spawn height
  const verticalSpeedFactor = startY / (screenHeight * 0.6);

  return {
    image,
    x: screenWidth + 50,
    y: Math.random() * (screenHeight * 0.6),
    width: baseWidth * scale,
    height: baseHeight * scale,
    dx: Math.random() * 2 + 3, // 3–5px left
    dy: 0.5 + verticalSpeedFactor * 1.5, // base 0.5 + increase based on y
  };
};

export const GetCurrentLevel = (velocity: number) => {
  for (let level = 1; level <= 13; level++) {
    if (velocity < GetLevelRequirement(level)) {
      return level;
    }
  }
  return 13;
};
