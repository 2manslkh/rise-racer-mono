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
  GetLevelRequirement,
  GetShouldUpdate,
  GetVehicle,
  LoadSideObjectImages,
  SideObject,
} from "@/app/lib/gameplaySettings";
import Speedometer from "../Speedometer";

interface GameplayProps {
  gameStarted: boolean;
  heightPercentage?: number;
  vehicleTier?: number;
  level: number;
  progress: number;
  handleNextLevel: () => void;
}

const Gameplay: React.FC<GameplayProps> = ({
  heightPercentage = 1,
  vehicleTier = 1,
  gameStarted,
  level = 1,
  progress = 1,
  handleNextLevel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const incrementalSpeed = 1;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const roadSpeedRef = useRef<number>(0);
  const [clickEffects, setClickEffects] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const previousLevelRef = useRef<number>(0);
  const [showLevelTransition, setShowLevelTransition] = useState(false);

  const vehicle = GetVehicle(vehicleTier);

  // Each click will increase the speed
  const handleClick = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!gameStarted) return;
    roadSpeedRef.current += incrementalSpeed;
    if (roadSpeedRef.current === GetLevelRequirement(level)) {
      previousLevelRef.current = level;
      handleNextLevel();
    }

    const newClick = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };

    setClickEffects((prev) => [...prev, newClick]);

    setTimeout(() => {
      setClickEffects((prev) => prev.filter((c) => c.id !== newClick.id));
    }, 800);
  };

  // When user clicks on START button, set the speed
  useEffect(() => {
    if (gameStarted) {
      roadSpeedRef.current = progress;
    }
  }, [gameStarted]);

  // For screen sizing
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

  // Drawing of canvas
  useEffect(() => {
    const shouldUpdate = GetShouldUpdate(previousLevelRef.current, level);
    if (!shouldUpdate) return;

    if (previousLevelRef.current !== 0) {
      setShowLevelTransition(true);
      setTimeout(() => setShowLevelTransition(false), 1_000);
    }

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

        if (level === 1 || level === 2) {
          const buffer = 20;
          const topLeft = (width - roadWidthTop) / 2 - buffer;
          const topRight = (width + roadWidthTop) / 2 + buffer;
          const bottomLeft = -(buffer + 20);
          const bottomRight = width + buffer;

          if (roadY - lastSpawn > spawnGap) {
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
            obj.y += roadSpeedRef.current / 10;
            // const progress = Math.min(1, (obj.y - obj.spawnY) / height);
            const progress = (obj.y - obj.spawnY) / height;
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

        roadY += roadSpeedRef.current / 10;
        requestAnimationFrame(draw);
      };

      draw();
    };
  }, [dimensions, level]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onPointerDown={handleClick}
    >
      {showLevelTransition && (
        <div className="absolute inset-0 bg-white animate-fade-out pointer-events-none z-20" />
      )}

      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute left-0 top-0 bottom-0 bg-red"
      />

      {clickEffects.map((click) => (
        <span
          key={click.id}
          className="absolute text-white font-bold text-lg animate-pop pointer-events-none select-none z-1"
          style={{
            left: click.x,
            top: click.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          +{incrementalSpeed}
        </span>
      ))}

      <div className="absolute bottom-[145px] left-1/2 transform -translate-x-1/2 w-[140px]">
        <Image src={vehicle} alt="Car" />
      </div>

      <div className="absolute bottom-[80px] left-0">
        <Speedometer
          currentProgress={
            gameStarted ? roadSpeedRef.current || progress : progress
          }
          levelRequirement={GetLevelRequirement(level)}
        />
      </div>
    </div>
  );
};

export default Gameplay;
