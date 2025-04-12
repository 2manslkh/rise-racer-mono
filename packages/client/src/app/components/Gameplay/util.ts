import {
  BackgroundObject,
  GenerateSideObject,
  GetRoad,
  SideObject,
} from "@/app/lib/gameplaySettings";

const GetHighestPointOfCanvas = (height: number) => {
  return height * 0.1;
};

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
    const leftBottom = (screenWidth - roadWidthBottom) / 2;
    const rightBottom = (screenWidth + roadWidthBottom) / 2;
    const rightTop = (screenWidth + roadWidthTop) / 2;
    const leftTop = (screenWidth - roadWidthTop) / 2;

    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.moveTo(leftBottom, screenHeight);
    ctx.lineTo(rightBottom, screenHeight);
    ctx.lineTo(rightTop, GetHighestPointOfCanvas(screenHeight));
    ctx.lineTo(leftTop, GetHighestPointOfCanvas(screenHeight));
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

export const hexToRgba = (hex: string, alpha: number) => {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const DrawAdditionalSideDividers = (
  level: number,
  ctx: CanvasRenderingContext2D,
  screenWidth: number,
  screenHeight: number,
  roadWidthTop: number,
  roadWidthBottom: number
) => {
  if (level === 3 || level === 4) {
    // Inner Layer - Start
    ctx.fillStyle = "#4F3F60";

    // Left Side Divider
    ctx.beginPath();
    ctx.moveTo((screenWidth - roadWidthBottom) / 2 - 40, screenHeight);
    ctx.lineTo((screenWidth - roadWidthBottom) / 2, screenHeight);
    ctx.lineTo(
      (screenWidth - roadWidthTop) / 2,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.lineTo(
      (screenWidth - roadWidthTop) / 2 - 10,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.closePath();
    ctx.fill();

    // Right Side Divier
    ctx.beginPath();
    ctx.moveTo((screenWidth + roadWidthBottom) / 2 + 40, screenHeight);
    ctx.lineTo((screenWidth + roadWidthBottom) / 2, screenHeight);
    ctx.lineTo(
      (screenWidth + roadWidthTop) / 2,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.lineTo(
      (screenWidth + roadWidthTop) / 2 + 10,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.closePath();
    ctx.fill();
    // Inner Layer - End

    // Outer Layer - Start
    ctx.fillStyle = "#D7D7D7";

    // Left Side Divider
    ctx.beginPath();
    ctx.moveTo((screenWidth - roadWidthBottom) / 2 - 50, screenHeight);
    ctx.lineTo((screenWidth - roadWidthBottom) / 2 - 40, screenHeight);
    ctx.lineTo(
      (screenWidth - roadWidthTop) / 2 - 10,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.lineTo(
      (screenWidth - roadWidthTop) / 2 - 12,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.closePath();
    ctx.fill();

    // Right Side Divider
    ctx.beginPath();
    ctx.moveTo((screenWidth + roadWidthBottom) / 2 + 50, screenHeight);
    ctx.lineTo((screenWidth + roadWidthBottom) / 2 + 40, screenHeight);
    ctx.lineTo(
      (screenWidth + roadWidthTop) / 2 + 10,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.lineTo(
      (screenWidth + roadWidthTop) / 2 + 12,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.closePath();
    ctx.fill();
    // Outer Layer - End

    return;
  }

  if (level === 5 || level === 6) {
    return;
  }

  if (level === 7 || level === 8) {
    // Layer 1 - Start
    ctx.fillStyle = "#130025";

    // Left Side Divider
    ctx.beginPath();
    ctx.moveTo((screenWidth - roadWidthBottom) / 2 - 40, screenHeight);
    ctx.lineTo((screenWidth - roadWidthBottom) / 2, screenHeight);
    ctx.lineTo(
      (screenWidth - roadWidthTop) / 2,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.lineTo(
      (screenWidth - roadWidthTop) / 2 - 10,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.closePath();
    ctx.fill();

    // Right Side Divier
    ctx.beginPath();
    ctx.moveTo((screenWidth + roadWidthBottom) / 2 + 40, screenHeight);
    ctx.lineTo((screenWidth + roadWidthBottom) / 2, screenHeight);
    ctx.lineTo(
      (screenWidth + roadWidthTop) / 2,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.lineTo(
      (screenWidth + roadWidthTop) / 2 + 10,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.closePath();
    ctx.fill();
    // Layer 1 - End

    // Layer 2 - Start
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    // Left Side Divider
    ctx.beginPath();
    ctx.moveTo((screenWidth - roadWidthBottom) / 2 - 40, screenHeight);
    ctx.lineTo(
      (screenWidth - roadWidthTop) / 2 - 10,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.stroke();

    // Right Side Divider
    ctx.beginPath();
    ctx.moveTo((screenWidth + roadWidthBottom) / 2 + 40, screenHeight);
    ctx.lineTo(
      (screenWidth + roadWidthTop) / 2 + 10,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.stroke();
    // Layer 2 - End

    // Layer 3 - Start
    ctx.fillStyle = "#450082";

    // Left Side Divider
    ctx.beginPath();
    ctx.moveTo((screenWidth - roadWidthBottom) / 2 - 70, screenHeight);
    ctx.lineTo((screenWidth - roadWidthBottom) / 2 - 42, screenHeight);
    ctx.lineTo(
      (screenWidth - roadWidthTop) / 2 - 12,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.lineTo(
      (screenWidth - roadWidthTop) / 2 - 20,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.closePath();
    ctx.fill();

    // Right Side Divier
    ctx.beginPath();
    ctx.moveTo((screenWidth + roadWidthBottom) / 2 + 70, screenHeight);
    ctx.lineTo((screenWidth + roadWidthBottom) / 2 + 42, screenHeight);
    ctx.lineTo(
      (screenWidth + roadWidthTop) / 2 + 12,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.lineTo(
      (screenWidth + roadWidthTop) / 2 + 20,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.closePath();
    ctx.fill();
    // Layer 3 - End

    // Layer 4 - Start
    ctx.fillStyle = "#FFFFFF";

    // Left Side Divider
    ctx.beginPath();
    ctx.moveTo((screenWidth - roadWidthBottom) / 2 - 75, screenHeight);
    ctx.lineTo((screenWidth - roadWidthBottom) / 2 - 70, screenHeight);
    ctx.lineTo(
      (screenWidth - roadWidthTop) / 2 - 20,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.lineTo(
      (screenWidth - roadWidthTop) / 2 - 21,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.closePath();
    ctx.fill();

    // Right Side Divier
    ctx.beginPath();
    ctx.moveTo((screenWidth + roadWidthBottom) / 2 + 75, screenHeight);
    ctx.lineTo((screenWidth + roadWidthBottom) / 2 + 70, screenHeight);
    ctx.lineTo(
      (screenWidth + roadWidthTop) / 2 + 20,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.lineTo(
      (screenWidth + roadWidthTop) / 2 + 21,
      GetHighestPointOfCanvas(screenHeight)
    );
    ctx.closePath();
    ctx.fill();
    // Layer 4 - End
    return;
  }
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

export const DrawObjects = (
  ctx: CanvasRenderingContext2D,
  objects: BackgroundObject[]
) => {
  objects.forEach((obj) => {
    const image: HTMLImageElement = new window.Image();
    image.src = obj.image;
    ctx.drawImage(image, obj.x, obj.y, obj.width, obj.height);
  });
};
