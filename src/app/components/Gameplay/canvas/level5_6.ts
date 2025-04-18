import {
  GenerateFixedSideObject,
  SideObject,
} from "@/app/lib/gameplaySettings";
import { GetHighestPointOfCanvas } from "./util";

export const DrawAdditionalSideDividersLevel5_6 = (
  ctx: CanvasRenderingContext2D,
  screenWidth: number,
  screenHeight: number,
  roadWidthTop: number,
  roadWidthBottom: number
) => {
  // Layer 1 - Start
  let gradient = ctx.createLinearGradient(0, 0, 0, screenHeight);
  gradient.addColorStop(0, "#A6A6A6");
  gradient.addColorStop(1, "#F5E0A6");
  ctx.fillStyle = gradient;

  // Left Side Divider
  ctx.beginPath();
  ctx.moveTo((screenWidth - roadWidthBottom) / 2 - 7, screenHeight);
  ctx.lineTo((screenWidth - roadWidthBottom) / 2, screenHeight);
  ctx.lineTo(
    (screenWidth - roadWidthTop) / 2,
    GetHighestPointOfCanvas(screenHeight)
  );
  ctx.lineTo(
    (screenWidth - roadWidthTop) / 2 - 3,
    GetHighestPointOfCanvas(screenHeight)
  );
  ctx.closePath();
  ctx.fill();

  // Right Side Divider
  ctx.beginPath();
  ctx.moveTo((screenWidth + roadWidthBottom) / 2 + 7, screenHeight);
  ctx.lineTo((screenWidth + roadWidthBottom) / 2, screenHeight);
  ctx.lineTo(
    (screenWidth + roadWidthTop) / 2,
    GetHighestPointOfCanvas(screenHeight)
  );
  ctx.lineTo(
    (screenWidth + roadWidthTop) / 2 + 3,
    GetHighestPointOfCanvas(screenHeight)
  );
  ctx.closePath();
  ctx.fill();

  // Layer 1 - End

  // Layer 2 - Start
  ctx.fillStyle = "#F0F0F0";

  // Left Side Divider
  ctx.beginPath();
  ctx.moveTo((screenWidth - roadWidthBottom) / 2 - 37, screenHeight);
  ctx.lineTo((screenWidth - roadWidthBottom) / 2 - 7, screenHeight);
  ctx.lineTo(
    (screenWidth - roadWidthTop) / 2 - 3,
    GetHighestPointOfCanvas(screenHeight)
  );
  ctx.lineTo(
    (screenWidth - roadWidthTop) / 2 - 16,
    GetHighestPointOfCanvas(screenHeight)
  );
  ctx.closePath();
  ctx.fill();

  // Right Side Divider
  ctx.beginPath();
  ctx.moveTo((screenWidth + roadWidthBottom) / 2 + 37, screenHeight);
  ctx.lineTo((screenWidth + roadWidthBottom) / 2 + 7, screenHeight);
  ctx.lineTo(
    (screenWidth + roadWidthTop) / 2 + 3,
    GetHighestPointOfCanvas(screenHeight)
  );
  ctx.lineTo(
    (screenWidth + roadWidthTop) / 2 + 16,
    GetHighestPointOfCanvas(screenHeight)
  );
  ctx.closePath();
  ctx.fill();
  // Layer 2 - End

  // Layer 3 - Start
  gradient = ctx.createLinearGradient(0, 0, 0, screenHeight);
  gradient.addColorStop(0, "#736E81");
  gradient.addColorStop(1, "#665D74");
  ctx.fillStyle = gradient;

  // Left Side Divider
  ctx.beginPath();
  ctx.moveTo((screenWidth - roadWidthBottom) / 2 - 70, screenHeight);
  ctx.lineTo((screenWidth - roadWidthBottom) / 2 - 37, screenHeight);
  ctx.lineTo(
    (screenWidth - roadWidthTop) / 2 - 16,
    GetHighestPointOfCanvas(screenHeight)
  );
  ctx.lineTo(
    (screenWidth - roadWidthTop) / 2 - 25,
    GetHighestPointOfCanvas(screenHeight)
  );
  ctx.closePath();
  ctx.fill();

  // Right Side Divier
  ctx.beginPath();
  ctx.moveTo((screenWidth + roadWidthBottom) / 2 + 70, screenHeight);
  ctx.lineTo((screenWidth + roadWidthBottom) / 2 + 37, screenHeight);
  ctx.lineTo(
    (screenWidth + roadWidthTop) / 2 + 16,
    GetHighestPointOfCanvas(screenHeight)
  );
  ctx.lineTo(
    (screenWidth + roadWidthTop) / 2 + 25,
    GetHighestPointOfCanvas(screenHeight)
  );
  ctx.closePath();
  ctx.fill();
  // Layer 3 - End

  // Layer 4 - Start
  gradient = ctx.createLinearGradient(0, 0, 0, screenHeight);
  gradient.addColorStop(0, "#E4E4E4");
  gradient.addColorStop(1, "#C2C2C2");
  ctx.fillStyle = gradient;

  // Left Side Divider
  ctx.beginPath();
  ctx.moveTo((screenWidth - roadWidthBottom) / 2 - 75, screenHeight);
  ctx.lineTo((screenWidth - roadWidthBottom) / 2 - 70, screenHeight);
  ctx.lineTo(
    (screenWidth - roadWidthTop) / 2 - 25,
    GetHighestPointOfCanvas(screenHeight)
  );
  ctx.lineTo(
    (screenWidth - roadWidthTop) / 2 - 26,
    GetHighestPointOfCanvas(screenHeight)
  );
  ctx.closePath();
  ctx.fill();

  // Right Side Divier
  ctx.beginPath();
  ctx.moveTo((screenWidth + roadWidthBottom) / 2 + 75, screenHeight);
  ctx.lineTo((screenWidth + roadWidthBottom) / 2 + 70, screenHeight);
  ctx.lineTo(
    (screenWidth + roadWidthTop) / 2 + 25,
    GetHighestPointOfCanvas(screenHeight)
  );
  ctx.lineTo(
    (screenWidth + roadWidthTop) / 2 + 26,
    GetHighestPointOfCanvas(screenHeight)
  );
  ctx.closePath();
  ctx.fill();
  // Layer 4 - End
};

export const GenerateDefaultSideObject5_6 = (
  assets: HTMLImageElement[],
  width: number,
  height: number,
  roadWidthTop: number,
  sideObjects: SideObject[]
) => {
  const topLeft = (width - roadWidthTop) / 2 + 7;
  const topRight = (width + roadWidthTop) / 2 - 22;
  const bottomLeft = -63;
  const bottomRight = width + 29;

  // const spacing = height / 6;
  // const prepopulateCount = Math.ceil(height / spacing) + 1;

  // for (let i = 0; i < prepopulateCount; i++) {
  //   const fixedPair = GenerateFixedSideObject(
  //     assets,
  //     topLeft,
  //     topRight,
  //     bottomLeft,
  //     bottomRight
  //   );

  //   const yOffset = spacing * i;

  //   fixedPair.forEach((obj) => {
  //     obj.y = yOffset;
  //     obj.spawnY = -obj.baseHeight;
  //     sideObjects.push(obj);
  //   });
  // }

  const estimatedProgress = 0.4; // keep objects in mid-scaling zone
  const minScale = 0.4;
  const maxScale = 1;
  const estimatedScale = minScale + (maxScale - minScale) * estimatedProgress;

  const baseSpacing = 80; // approximate visual gap
  const scaledSpacing = baseSpacing * estimatedScale;

  let yOffset = 0;

  while (yOffset < height + 100) {
    const fixedPair = GenerateFixedSideObject(
      assets,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight
    );

    const spawnY = yOffset - estimatedScale * 100; // simulate spawn above
    const y = yOffset;

    fixedPair.forEach((obj) => {
      obj.spawnY = spawnY;
      obj.y = y;
      sideObjects.push(obj);
    });

    yOffset += scaledSpacing;
  }
};
