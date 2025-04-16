import {
  GenerateRandomSideObject,
  SideObject,
} from "@/app/lib/gameplaySettings";

export const GenerateDefaultSideObject1_2 = (
  assets: HTMLImageElement[],
  width: number,
  height: number,
  roadWidthTop: number,
  sideObjects: SideObject[]
) => {
  const buffer = 20;
  const topLeft = (width - roadWidthTop) / 2 - buffer;
  const topRight = (width + roadWidthTop) / 2 + buffer;
  const bottomLeft = -(buffer + 50);
  const bottomRight = width + buffer;

  const prepopulateCount = 4;
  const spacing = height / (prepopulateCount + 1);

  for (let i = 0; i < prepopulateCount; i++) {
    const obj = GenerateRandomSideObject(
      assets,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight
    );

    const yOffset = spacing * (i + 1);

    obj.y = yOffset;
    obj.spawnY = 0;

    sideObjects.push(obj);
  }
};
