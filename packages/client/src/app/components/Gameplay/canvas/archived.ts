import {
  BackgroundObject,
  GenerateSideObject,
  GetRoad,
  SideObject,
} from "@/app/lib/gameplaySettings";

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
