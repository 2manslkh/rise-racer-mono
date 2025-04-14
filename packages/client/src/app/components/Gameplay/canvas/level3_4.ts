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
