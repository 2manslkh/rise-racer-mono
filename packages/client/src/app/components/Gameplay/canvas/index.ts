import { GetRoad } from "@/app/lib/gameplaySettings";
import {
  DrawAdditionalSideDividersLevel11_12,
  DrawRoadGradient,
} from "./level11_12";
import { GetHighestPointOfCanvas } from "./util";
import { DrawAdditionalSideDividersLevel3_4 } from "./level3_4";
import { DrawAdditionalSideDividersLevel7_8 } from "./level7_8";
import { DrawAdditionalSideDividersLevel9_10 } from "./level9_10";

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
