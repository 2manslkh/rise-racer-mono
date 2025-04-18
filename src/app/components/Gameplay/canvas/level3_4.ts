import {
  GenerateFixedSideObject,
  SideObject,
} from "@/app/lib/gameplaySettings";
import { GetHighestPointOfCanvas } from "./util";

export const DrawAdditionalSideDividersLevel3_4 = (
  ctx: CanvasRenderingContext2D,
  screenWidth: number,
  screenHeight: number,
  roadWidthTop: number,
  roadWidthBottom: number
) => {
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
};

export const GenerateDefaultSideObject3_4 = (
  assets: HTMLImageElement[],
  width: number,
  height: number,
  roadWidthTop: number,
  roadWidthBottom: number,
  sideObjects: SideObject[]
) => {
  const topLeft = (width - roadWidthTop) / 2 + 27;
  const topRight = (width + roadWidthTop) / 2 - 47;
  const bottomLeft = -103;
  const bottomRight = width + 50;

  const prepopulateCount = 6;
  const spacing = (height * 1.5) / (prepopulateCount + 1);

  for (let i = 0; i < prepopulateCount; i++) {
    const fixedPair = GenerateFixedSideObject(
      assets,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight
    );

    const yOffset = spacing * (i + 1);

    fixedPair.forEach((obj) => {
      obj.y = yOffset;
      obj.spawnY = -obj.baseHeight;

      sideObjects.push(obj);
    });
  }

  sideObjects.push(
    ...GenerateFixedSideObject(
      assets,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight
    )
  );
};
