import { GetHighestPointOfCanvas, hexToRgba } from "./util";

export const DrawAdditionalSideDividersLevel9_10 = (
  ctx: CanvasRenderingContext2D,
  screenWidth: number,
  screenHeight: number,
  roadWidthTop: number,
  roadWidthBottom: number
) => {
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
  let gradient = ctx.createLinearGradient(0, 0, 0, screenHeight);
  gradient.addColorStop(0, hexToRgba("#28024B", 0.8));
  gradient.addColorStop(1, hexToRgba("#ACB7FF", 0.8));

  ctx.fillStyle = gradient;

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
  gradient = ctx.createLinearGradient(0, 0, 0, screenHeight);
  gradient.addColorStop(0, hexToRgba("#FFFFFF", 0.8));
  gradient.addColorStop(1, hexToRgba("#C2C2C2", 0.8));

  ctx.filter = "blur(4px)";
  ctx.fillStyle = gradient;

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
  ctx.filter = "none";
  // Layer 4 - End
};
