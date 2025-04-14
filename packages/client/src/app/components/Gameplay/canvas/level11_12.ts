import { GetHighestPointOfCanvas, hexToRgba } from "./util";

export const DrawRoadGradient = (
  ctx: CanvasRenderingContext2D,
  screenWidth: number,
  screenHeight: number,
  roadWidthTop: number,
  roadWidthBottom: number
) => {
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
};

export const DrawAdditionalSideDividersLevel11_12 = (
  ctx: CanvasRenderingContext2D,
  screenWidth: number,
  screenHeight: number,
  roadWidthTop: number,
  roadWidthBottom: number
) => {
  // Layer 1 - Start
  ctx.fillStyle = hexToRgba("#130025", 0.5);

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
  gradient.addColorStop(0.25, hexToRgba("#008CFF", 0.8));
  gradient.addColorStop(0.5, hexToRgba("#229BFF", 0.8));
  gradient.addColorStop(0.75, hexToRgba("#44ABFF", 0.8));
  gradient.addColorStop(1, hexToRgba("#66BAFF", 0.8));

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

  // Right Side Divider
  gradient = ctx.createLinearGradient(0, 0, 0, screenHeight);
  gradient.addColorStop(0, hexToRgba("#FFFFFF", 0.8));
  gradient.addColorStop(1, hexToRgba("#C2C2C2", 0.8));
  ctx.fillStyle = gradient;

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
};
