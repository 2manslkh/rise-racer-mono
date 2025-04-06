"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  DrawRoad,
  DrawSideDivider,
  DrawCenterDivider,
  DrawLaneDividers,
} from "./util";
import {
  DrawSideObject,
  GenerateSideObject,
  GetBackground,
  GetCenterDividerColor,
  GetVehicle,
  LoadSideObjectImages,
  SideObject,
} from "@/app/lib/gameplaySettings";

interface GameplayProps {
  gameStarted: boolean;
  heightPercentage?: number;
  vehicleTier?: number;
  level?: number;
}

const Gameplay: React.FC<GameplayProps> = ({
  heightPercentage = 1,
  vehicleTier = 1,
  gameStarted,
  level = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const roadSpeedRef = useRef<number>(0);

  const vehicle = GetVehicle(vehicleTier);

  const handleClick = () => {
    if (!gameStarted) return;
    roadSpeedRef.current += 1;
  };

  useEffect(() => {
    if (gameStarted) {
      roadSpeedRef.current = 1;
    }
  }, [gameStarted]);

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;

      setDimensions({
        width: clientWidth,
        height: clientHeight * heightPercentage,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, [heightPercentage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let roadY = 0;
    const bg: HTMLImageElement = new window.Image();
    bg.src = GetBackground(level);

    bg.onload = () => {
      const assets = LoadSideObjectImages(level);
      let sideObjects: SideObject[] = [];

      let lastSpawn = 0;
      const spawnGap = 80;

      const draw = () => {
        const { width, height } = dimensions;

        ctx.drawImage(bg, 0, 0, width, height);
        // ctx.clearRect(0, 0, width, height);

        const roadWidthTop = width * 0.3;
        const roadWidthBottom = width * 1.1;

        DrawRoad(ctx, width, height, roadWidthTop, roadWidthBottom, level);
        DrawSideDivider(
          ctx,
          width,
          height,
          roadWidthTop,
          roadWidthBottom,
          "#FFF"
        );

        DrawCenterDivider(ctx, width, height, GetCenterDividerColor(level));
        DrawLaneDividers(
          ctx,
          width,
          height,
          roadWidthTop,
          roadWidthBottom,
          roadY,
          "#FFF"
        );

        if (level === 1) {
          if (roadY - lastSpawn > spawnGap) {
            const buffer = 20;
            const topLeft = (width - roadWidthTop) / 2 - buffer;
            const topRight = (width + roadWidthTop) / 2 + buffer;
            const bottomLeft = -(buffer + 20);
            const bottomRight = width + buffer;
            sideObjects.push(
              GenerateSideObject(
                assets,
                topLeft,
                topRight,
                bottomLeft,
                bottomRight
              )
            );
            lastSpawn = roadY;
          }

          sideObjects.forEach((obj) => {
            obj.y += roadSpeedRef.current;
            const progress = Math.min(1, (obj.y - obj.spawnY) / height);
            const currentX = obj.startX + (obj.endX - obj.startX) * progress;
            ctx.drawImage(
              obj.img,
              currentX,
              obj.y,
              obj.baseWidth,
              obj.baseHeight
            );
          });

          sideObjects = sideObjects.filter(
            (obj) => obj.y <= height + obj.baseHeight + 50
          );
        }

        roadY += roadSpeedRef.current;
        requestAnimationFrame(draw);
      };

      draw();
    };
  }, [dimensions]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onPointerDown={handleClick}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute left-0 top-0 bottom-0 bg-red"
      />
      <div className="absolute bottom-[150px] left-1/2 transform -translate-x-1/2 w-[140px]">
        <Image src={vehicle} alt="Car" />
      </div>
    </div>
  );
};

export default Gameplay;
