"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  DrawRoad,
  DrawSideDivider,
  DrawCenterDivider,
  DrawLaneDividers,
  DrawAdditionalSideDividers,
  DrawBackgroundObjectImage,
} from "./canvas";
import {
  GenerateFixedSideObject,
  GenerateOverlayObjects,
  GenerateRandomSideObject,
  GetBackground,
  GetCenterDividerColor,
  GetLevelRequirement,
  GetShouldUpdateCanvas,
  GetVehicle,
  LoadSideObjectImages,
  OverlayObject,
  SideObject,
} from "@/app/lib/gameplaySettings";
import Speedometer from "../Speedometer";
import { MINIMUM_GAS, useHotWallet } from "@/app/context/HotWalletContext";
import { ethers } from "ethers";
import { logError } from "@/app/lib/error";
import { useToast } from "@/app/hooks/useToast";

const CLICK_CONTRACT_ADDRESS = "0x4f5cB26b05373EeC10702bDe7896317b69BeB29B";
const CLICK_CONTRACT_ABI = [
  {
    inputs: [],
    name: "click",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

interface GameplayProps {
  gameStarted: boolean;
  heightPercentage?: number;
  vehicleTier?: number;
  level: number;
  progress: number;
  handleNextLevel: () => void;
}

const Gameplay: React.FC<GameplayProps> = ({
  vehicleTier = 1,
  gameStarted,
  level = 1,
  progress = 1,
  handleNextLevel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { hotWallet, balance } = useHotWallet();
  const toast = useToast();
  const incrementalSpeed = 1;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const roadSpeedRef = useRef<number>(100);
  const [clickEffects, setClickEffects] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const previousLevelRef = useRef<number>(0);
  const [showLevelTransition, setShowLevelTransition] =
    useState<boolean>(false);
  const isPreloadingRef = useRef<boolean>(true);
  const { getNonce, incrementNonce } = useHotWallet();

  const vehicle = GetVehicle(vehicleTier);

  // Each click will increase the speed
  const handleClick = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!gameStarted || !hotWallet) return;
    if (balance < MINIMUM_GAS) {
      toast.error("Insufficient funds in burner wallet");
      return;
    }
    const clickContract = new ethers.Contract(
      CLICK_CONTRACT_ADDRESS,
      CLICK_CONTRACT_ABI,
      hotWallet
    );

    try {
      incrementNonce();
      const currentNonce = getNonce();
      console.log("🚀 | handleClick | currentNonce:", currentNonce)
      clickContract.click({ nonce: currentNonce, gasLimit: 105000 });
    } catch (error) {
      logError(error);
    }

    roadSpeedRef.current += incrementalSpeed;
    if (roadSpeedRef.current === GetLevelRequirement(level)) {
      previousLevelRef.current = level;
      handleNextLevel();
    }

    const rect = containerRef.current?.getBoundingClientRect();
    const newClick = {
      id: Date.now(),
      x: e.clientX - (rect?.left ?? 0),
      y: e.clientY - (rect?.top ?? 0),
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
        height: clientHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Drawing of canvas
  useEffect(() => {
    const shouldUpdate = GetShouldUpdateCanvas(previousLevelRef.current, level);
    if (!shouldUpdate) return;

    if (previousLevelRef.current !== 0) {
      setShowLevelTransition(true);
      setTimeout(() => setShowLevelTransition(false), 2_000);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let roadY = 0;
    const bg: HTMLImageElement = new window.Image();
    bg.src = GetBackground(level);

    const { width, height } = dimensions;
    const assets = LoadSideObjectImages(level);

    let sideObjects: SideObject[] = [];
    let overlayObjects: OverlayObject[] = [];

    const roadWidthTop = width * 0.3;
    const roadWidthBottom = width * 1.1;

    const spawnGap = 80;
    let lastSpawn = 0;

    if (level >= 7) {
      // For Shooting Stars
      setInterval(() => {
        const count = Math.random() < 0.3 ? 2 : 1; // 30% chance of spawning 2

        for (let i = 0; i < count; i++) {
          overlayObjects.push(GenerateOverlayObjects(assets[0], width, height));
        }
      }, 3_000);
    }
    // End Init

    const draw = () => {
      ctx.drawImage(bg, 0, 0, width, height);
      // ctx.clearRect(0, 0, width, height);

      if ([1, 2].includes(level)) {
        const buffer = 20;
        const topLeft = (width - roadWidthTop) / 2 - buffer;
        const topRight = (width + roadWidthTop) / 2 + buffer;
        const bottomLeft = -(buffer + 50);
        const bottomRight = width + buffer;

        if (roadY - lastSpawn > spawnGap) {
          // Problematic object return null
          const _obj = GenerateRandomSideObject(
            assets,
            topLeft,
            topRight,
            bottomLeft,
            bottomRight
          );
          if (_obj) {
            sideObjects.push(_obj);
            lastSpawn = roadY;
          }
        }

        sideObjects.forEach((obj) => {
          obj.y += roadSpeedRef.current / 10;

          const distanceFromTop = obj.y - obj.spawnY;
          const maxDistance = height - obj.spawnY;

          const minScale = 0.4;
          const maxScale = 1;

          const progress = Math.min(
            Math.max(distanceFromTop / maxDistance, 0),
            1
          );
          const scale = minScale + (maxScale - minScale) * progress;
          const cappedScale = Math.min(scale, 0.8);

          const scaledWidth = obj.baseWidth * cappedScale;
          const scaledHeight = obj.baseHeight * cappedScale;

          const currentX = obj.startX + (obj.endX - obj.startX) * progress;

          ctx.drawImage(obj.img, currentX, obj.y, scaledWidth, scaledHeight);
        });

        sideObjects = sideObjects.filter(
          (obj) => obj.y <= height + obj.baseHeight + 50
        );
      } else if (level >= 7) {
        overlayObjects.forEach((obj) => {
          obj.x -= obj.dx ?? 5;
          obj.y += obj.dy ?? 1;
          ctx.drawImage(obj.image, obj.x, obj.y, obj.width, obj.height);
        });

        overlayObjects = overlayObjects.filter(
          (object) => object.x + object.width > 0
        );
      }

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
      DrawAdditionalSideDividers(
        ctx,
        width,
        height,
        roadWidthTop,
        roadWidthBottom,
        level
      );
      DrawBackgroundObjectImage(ctx, width, height, level);

      if ([3, 4].includes(level)) {
        const topLeft = (width - roadWidthTop) / 2 + 27;
        const topRight = (width + roadWidthTop) / 2 - 47;
        const bottomLeft = -103;
        const bottomRight = width + 50;

        if (roadY - lastSpawn > spawnGap * 1.5) {
          sideObjects.push(
            ...GenerateFixedSideObject(
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

          const distanceFromTop = obj.y - obj.spawnY;
          const maxDistance = height - obj.spawnY;
          const progress = distanceFromTop / maxDistance;
          const clampedProgress = Math.min(Math.max(progress, 0), 1);

          const minScale = 0.4;
          const maxScale = 1;
          const scale = Math.min(
            minScale + (maxScale - minScale) * clampedProgress,
            1
          );
          const scaledWidth = obj.baseWidth * scale;
          const scaledHeight = obj.baseHeight * scale;

          const currentX =
            obj.startX + (obj.endX - obj.startX) * clampedProgress;

          ctx.drawImage(obj.img, currentX, obj.y, scaledWidth, scaledHeight);
        });

        sideObjects = sideObjects.filter(
          (obj) => obj.y <= height + obj.baseHeight + 10
        );
      } else if ([5, 6].includes(level)) {
        const topLeft = (width - roadWidthTop) / 2 + 7;
        const topRight = (width + roadWidthTop) / 2 - 22;
        const bottomLeft = -62.5;
        const bottomRight = width + 28.5;

        if (roadY - lastSpawn > 35) {
          sideObjects.push(
            ...GenerateFixedSideObject(
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

          const distanceFromTop = obj.y - obj.spawnY;
          const maxDistance = height - obj.spawnY;
          const progress = distanceFromTop / maxDistance;

          const minScale = 0.4;
          const maxScale = 1;
          const scale = minScale + (maxScale - minScale) * progress;

          const scaledWidth = obj.baseWidth * scale;
          const scaledHeight = obj.baseHeight * scale;

          const currentX = obj.startX + (obj.endX - obj.startX) * progress;

          ctx.drawImage(obj.img, currentX, obj.y, scaledWidth, scaledHeight);
        });

        sideObjects = sideObjects.filter(
          (obj) => obj.y <= height + obj.baseHeight + 10
        );
      }

      roadY += roadSpeedRef.current / 10;

      if (isPreloadingRef.current && roadY >= 1_000) {
        isPreloadingRef.current = false;
        roadSpeedRef.current = 0;
      }

      requestAnimationFrame(draw);
    };

    bg.onload = () => {
      draw();
    };

    if (bg.complete) {
      draw();
    }
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
          className="absolute text-white font-bold text-2xl animate-pop pointer-events-none select-none z-1"
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
