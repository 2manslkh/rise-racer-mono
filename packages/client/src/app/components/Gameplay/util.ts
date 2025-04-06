import { GetRoad } from "@/app/lib/gameplaySettings";

export const DrawRoad = (
  ctx: CanvasRenderingContext2D,
  screenWidth: number,
  screenHeight: number,
  roadWidthTop: number,
  roadWidthBottom: number,
  tier: number
) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, screenHeight);
  GetRoad(gradient, tier);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo((screenWidth - roadWidthBottom) / 2, screenHeight);
  ctx.lineTo((screenWidth + roadWidthBottom) / 2, screenHeight);
  ctx.lineTo((screenWidth + roadWidthTop) / 2, 0);
  ctx.lineTo((screenWidth - roadWidthTop) / 2, 0);
  ctx.closePath();
  ctx.fill();

  if (tier === 6) {
    // To only apply for tier 6
    const leftBottom = (screenWidth - roadWidthBottom) / 2;
    const rightBottom = (screenWidth + roadWidthBottom) / 2;
    const rightTop = (screenWidth + roadWidthTop) / 2;
    const leftTop = (screenWidth - roadWidthTop) / 2;

    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.moveTo(leftBottom, screenHeight);
    ctx.lineTo(rightBottom, screenHeight);
    ctx.lineTo(rightTop, 0);
    ctx.lineTo(leftTop, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
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
  ctx.lineTo(centerX - 2, 0);
  ctx.stroke();

  // Second line (slightly right from center)
  ctx.beginPath();
  ctx.moveTo(centerX + 4, screenHeight);
  ctx.lineTo(centerX + 2, 0);
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
  ctx.lineTo((screenWidth - roadWidthTop) / 2 + 10, 0);
  ctx.stroke();

  // Right Side Divider
  ctx.beginPath();
  ctx.moveTo((screenWidth + roadWidthBottom) / 2 - 10, screenHeight);
  ctx.lineTo((screenWidth + roadWidthTop) / 2 - 10, 0);
  ctx.stroke();
};

export const GenerateGrassPatches = (
  width: number,
  height: number
): { x: number; y: number }[] => {
  return Array.from({ length: 10 }, () => ({
    x: Math.random() < 0.5 ? Math.random() * 100 : width - Math.random() * 100,
    y: Math.random() * height,
  }));
};

export const DrawGrassPatches = (
  ctx: CanvasRenderingContext2D,
  screenWidth: number,
  screenHeight: number,
  grassPatches: { x: number; y: number }[],
  grassSpeed: number
) => {
  // === Grass Background ===
  ctx.fillStyle = "#228B22";
  ctx.fillRect(0, 0, screenWidth, screenHeight);

  // === Moving Grass Patches ===
  ctx.fillStyle = "#1A6F1A";
  for (const patch of grassPatches) {
    ctx.fillRect(patch.x, patch.y, 40, 20);
    patch.y += grassSpeed;
    if (patch.y > screenHeight) {
      patch.y = -20;
      patch.x =
        Math.random() < 0.5
          ? Math.random() * 100
          : screenWidth - Math.random() * 100;
    }
  }
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
  ctx.lineTo(xLeftTop, 0);
  ctx.stroke();

  // === Right lane ===
  ctx.beginPath();
  ctx.moveTo(xRightBottom, screenHeight);
  ctx.lineTo(xRightTop, 0);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.restore();
};

export const hexToRgba = (hex: string, alpha: number) => {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
