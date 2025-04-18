import {
  GetBackgroundObjects,
  GetRoad,
  SideObject,
} from "@/app/lib/gameplaySettings";
import {
  DrawAdditionalSideDividersLevel11_12,
  DrawRoadGradient,
} from "./level11_12";
import { GetHighestPointOfCanvas, hexToRgba } from "./util";
import {
  DrawAdditionalSideDividersLevel3_4,
  GenerateDefaultSideObject3_4,
} from "./level3_4";
import { DrawAdditionalSideDividersLevel7_8 } from "./level7_8";
import { DrawAdditionalSideDividersLevel9_10 } from "./level9_10";
import {
  DrawAdditionalSideDividersLevel5_6,
  GenerateDefaultSideObject5_6,
} from "./level5_6";
import { GenerateDefaultSideObject1_2 } from "./level1_2";

export const DrawRoad = (
  ctx: CanvasRenderingContext2D,
  screenWidth: number,
  screenHeight: number,
  roadWidthTop: number,
  roadWidthBottom: number,
  level: number
) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, screenHeight);
  GetRoad(gradient, level);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo((screenWidth - roadWidthBottom) / 2, screenHeight);
  ctx.lineTo((screenWidth + roadWidthBottom) / 2, screenHeight);
  ctx.lineTo(
    (screenWidth + roadWidthTop) / 2,
    GetHighestPointOfCanvas(screenHeight)
  );
  ctx.lineTo(
    (screenWidth - roadWidthTop) / 2,
    GetHighestPointOfCanvas(screenHeight)
  );
  ctx.closePath();
  ctx.fill();

  if (level === 11 || level === 12) {
    DrawRoadGradient(
      ctx,
      screenWidth,
      screenHeight,
      roadWidthTop,
      roadWidthBottom
    );
  }
};

export const DrawCenterDivider = (
  ctx: CanvasRenderingContext2D,
  screenWidth: number,
  screenHeight: number,
  color: string = "#FFF"
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.setLineDash([]); // No dashes for center line

  const centerX = screenWidth / 2;

  // First line (slightly left from center)
  ctx.beginPath();
  ctx.moveTo(centerX - 4, screenHeight);
  ctx.lineTo(centerX - 2, GetHighestPointOfCanvas(screenHeight));
  ctx.stroke();

  // Second line (slightly right from center)
  ctx.beginPath();
  ctx.moveTo(centerX + 4, screenHeight);
  ctx.lineTo(centerX + 2, GetHighestPointOfCanvas(screenHeight));
  ctx.stroke();

  return ctx;
};

export const DrawSideDivider = (
  ctx: CanvasRenderingContext2D,
  screenWidth: number,
  screenHeight: number,
  roadWidthTop: number,
  roadWidthBottom: number,
  color: string = "#FFD700"
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([]);

  // Left Side Divider
  ctx.beginPath();
  ctx.moveTo((screenWidth - roadWidthBottom) / 2 + 10, screenHeight);
  ctx.lineTo(
    (screenWidth - roadWidthTop) / 2 + 10,
    GetHighestPointOfCanvas(screenHeight)
  );
  ctx.stroke();

  // Right Side Divider
  ctx.beginPath();
  ctx.moveTo((screenWidth + roadWidthBottom) / 2 - 10, screenHeight);
  ctx.lineTo(
    (screenWidth + roadWidthTop) / 2 - 10,
    GetHighestPointOfCanvas(screenHeight)
  );
  ctx.stroke();
};

export const DrawLaneDividers = (
  ctx: CanvasRenderingContext2D,
  screenWidth: number,
  screenHeight: number,
  roadWidthTop: number,
  roadWidthBottom: number,
  dashOffset: number,
  color: string = "#FFF"
) => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;

  ctx.setLineDash([20, 20]);
  ctx.lineDashOffset = dashOffset;

  const xLeftTop = (screenWidth - roadWidthTop) / 2 + roadWidthTop / 4 + 5;
  const xLeftBottom =
    (screenWidth - roadWidthBottom) / 2 + roadWidthBottom / 4 + 5;

  const xRightTop = (screenWidth + roadWidthTop) / 2 - roadWidthTop / 4 - 5;
  const xRightBottom =
    (screenWidth + roadWidthBottom) / 2 - roadWidthBottom / 4 - 5;

  // === Left lane ===
  ctx.beginPath();
  ctx.moveTo(xLeftBottom, screenHeight);
  ctx.lineTo(xLeftTop, GetHighestPointOfCanvas(screenHeight));
  ctx.stroke();

  // === Right lane ===
  ctx.beginPath();
  ctx.moveTo(xRightBottom, screenHeight);
  ctx.lineTo(xRightTop, GetHighestPointOfCanvas(screenHeight));
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.restore();
};

export const DrawAdditionalSideDividers = (
  ctx: CanvasRenderingContext2D,
  screenWidth: number,
  screenHeight: number,
  roadWidthTop: number,
  roadWidthBottom: number,
  level: number
) => {
  if ([1, 2].includes(level)) {
    return;
  }

  if ([3, 4].includes(level)) {
    DrawAdditionalSideDividersLevel3_4(
      ctx,
      screenWidth,
      screenHeight,
      roadWidthTop,
      roadWidthBottom
    );
    return;
  }

  if ([5, 6].includes(level)) {
    DrawAdditionalSideDividersLevel5_6(
      ctx,
      screenWidth,
      screenHeight,
      roadWidthTop,
      roadWidthBottom
    );
    return;
  }

  if ([7, 8].includes(level)) {
    DrawAdditionalSideDividersLevel7_8(
      ctx,
      screenWidth,
      screenHeight,
      roadWidthTop,
      roadWidthBottom
    );
    return;
  }

  if ([9, 10].includes(level)) {
    DrawAdditionalSideDividersLevel9_10(
      ctx,
      screenWidth,
      screenHeight,
      roadWidthTop,
      roadWidthBottom
    );
    return;
  }

  if ([11, 12].includes(level)) {
    DrawAdditionalSideDividersLevel11_12(
      ctx,
      screenWidth,
      screenHeight,
      roadWidthTop,
      roadWidthBottom
    );
    return;
  }
};

// For image that are above the road
export const DrawBackgroundObjectImage = (
  ctx: CanvasRenderingContext2D,
  screenWidth: number,
  screenHeight: number,
  level: number
) => {
  const objects = GetBackgroundObjects(level);

  if ([3, 4].includes(level)) {
    const startY = GetHighestPointOfCanvas(screenHeight) - 25;
    const endY = screenHeight <= 650 ? startY + 125 : startY + 100;

    const gradient = ctx.createLinearGradient(0, startY, 0, endY);
    gradient.addColorStop(0, "#29004D");
    gradient.addColorStop(0.7, hexToRgba("#41007A", 0.9));
    gradient.addColorStop(1, hexToRgba("#41007A", 0.1));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, GetHighestPointOfCanvas(screenHeight) - 25);
    ctx.lineTo(screenWidth, GetHighestPointOfCanvas(screenHeight) - 25);
    ctx.lineTo(screenWidth, GetHighestPointOfCanvas(screenHeight) + 75);
    ctx.lineTo(0, GetHighestPointOfCanvas(screenHeight) + 75);
    ctx.closePath();
    ctx.fill();
  }

  objects.forEach((obj) => {
    const image: HTMLImageElement = new window.Image();
    image.src = obj.image;
    ctx.drawImage(image, obj.x, obj.y, obj.width, obj.height);
  });
};

export const GenerateDefaultSideObject = (
  level: number,
  assets: HTMLImageElement[],
  width: number,
  height: number,
  roadWidthTop: number,
  roadWidthBottom: number,
  sideObjects: SideObject[]
) => {
  if ([1, 2].includes(level)) {
    GenerateDefaultSideObject1_2(
      assets,
      width,
      height,
      roadWidthTop,
      sideObjects
    );
  } else if ([3, 4].includes(level)) {
    GenerateDefaultSideObject3_4(
      assets,
      width,
      height,
      roadWidthTop,
      roadWidthBottom,
      sideObjects
    );
  } else if ([5, 6].includes(level)) {
    GenerateDefaultSideObject5_6(
      assets,
      width,
      height,
      roadWidthTop,
      sideObjects
    );
  }
};
