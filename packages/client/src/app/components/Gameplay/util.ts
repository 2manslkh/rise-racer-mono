export const DrawRoad = (
  ctx: CanvasRenderingContext2D,
  screenWidth: number,
  screenHeight: number,
  roadWidthTop: number,
  roadWidthBottom: number,
  color: string = "#555"
) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo((screenWidth - roadWidthBottom) / 2, screenHeight);
  ctx.lineTo((screenWidth + roadWidthBottom) / 2, screenHeight);
  ctx.lineTo((screenWidth + roadWidthTop) / 2, 0);
  ctx.lineTo((screenWidth - roadWidthTop) / 2, 0);
  ctx.closePath();
  ctx.fill();
};

export const DrawCenterDivider = (
  ctx: CanvasRenderingContext2D,
  screenWidth: number,
  screenHeight: number,
  color: string = "#FFF"
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.setLineDash([]); // No dashes for center line

  const centerX = screenWidth / 2;

  // First line (slightly left from center)
  ctx.beginPath();
  ctx.moveTo(centerX - 8, screenHeight);
  ctx.lineTo(centerX - 4, 0);
  ctx.stroke();

  // Second line (slightly right from center)
  ctx.beginPath();
  ctx.moveTo(centerX + 8, screenHeight);
  ctx.lineTo(centerX + 4, 0);
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
  ctx.lineWidth = 4;

  ctx.setLineDash([20, 20]);
  ctx.lineDashOffset = dashOffset;

  const xLeftTop = (screenWidth - roadWidthTop) / 2 + roadWidthTop / 4;
  const xLeftBottom = (screenWidth - roadWidthBottom) / 2 + roadWidthBottom / 4;

  const xRightTop = (screenWidth + roadWidthTop) / 2 - roadWidthTop / 4;
  const xRightBottom =
    (screenWidth + roadWidthBottom) / 2 - roadWidthBottom / 4;

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
