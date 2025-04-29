"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  DrawRoad,
  DrawSideDivider,
  DrawCenterDivider,
  DrawLaneDividers,
  DrawAdditionalSideDividers,
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
import { logError } from "@/app/lib/error";
import { clickRace } from "@/app/lib/rise-racer";
import { useToast } from "@/app/hooks/useToast";

import { useTransactionTracker } from "@/app/hooks/useTransactionTracker";
import TransactionLogs from "../TransactionLogs";
import { formatEther } from "ethers";

interface GameplayProps {
  gameStarted: boolean;
  heightPercentage?: number;
  vehicleTier?: number;
}

// Define a threshold for rapid clicks (in milliseconds)
const COMBO_THRESHOLD_MS = 1000; // 1 second

const Gameplay: React.FC<GameplayProps> = ({
  vehicleTier = 1,
  gameStarted,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    hotWallet,
    balance,
    velocityPerClick,
    user,
    address,
    getNonce,
    incrementNonce,
    refreshBalance,
    riseCrystalsBalance,
  } = useHotWallet();
  const toast = useToast();
  const { initiateTx, updateTx, removeTx, transactions } =
    useTransactionTracker();
  const incrementalSpeed = velocityPerClick;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const roadSpeedRef = useRef<number>(100);
  const [clickEffects, setClickEffects] = useState<
    { id: string; x: number; y: number }[]
  >([]);
  const previousLevelRef = useRef<number>(0);
  const [showLevelTransition, setShowLevelTransition] =
    useState<boolean>(false);
  const isPreloadingRef = useRef<boolean>(true);
  const [currentLevel, setCurrentLevel] = useState<number>(1);

  // Combo state
  const [comboCount, setComboCount] = useState<number>(0);
  const lastClickTimeRef = useRef<number>(0);
  const comboResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const vehicle = GetVehicle(vehicleTier);

  // Fetch Rise Crystals balance

  // Function to reset combo
  const resetCombo = () => {
    setComboCount(0);
    lastClickTimeRef.current = 0;
    if (comboResetTimeoutRef.current) {
      clearTimeout(comboResetTimeoutRef.current);
      comboResetTimeoutRef.current = null;
    }
  };

  // Each click will increase the speed
  const handleClick = async (e: React.PointerEvent<HTMLDivElement>) => {
    if (!gameStarted || !hotWallet) return;
    if (balance < MINIMUM_GAS) {
      toast.error("Insufficient funds in burner wallet");
      resetCombo();
      return;
    }

    const currentTime = Date.now();
    let placeholderHash: string | null = null; // To store the optimistic hash

    // Combo logic
    if (
      lastClickTimeRef.current &&
      currentTime - lastClickTimeRef.current <= COMBO_THRESHOLD_MS
    ) {
      setComboCount((prev) => prev + 1);
    } else {
      setComboCount(1);
    }
    if (comboResetTimeoutRef.current) {
      clearTimeout(comboResetTimeoutRef.current);
    }
    comboResetTimeoutRef.current = setTimeout(() => {
      resetCombo();
    }, COMBO_THRESHOLD_MS);
    lastClickTimeRef.current = currentTime;

    try {
      incrementNonce();
      const currentNonce = getNonce();
      // 1. Initiate optimistic transaction
      const description = `Race Click #${currentNonce}`;
      placeholderHash = initiateTx(description);

      // 2. Send the actual transaction
      clickRace(hotWallet, currentNonce).then(async (txResponse) => {
        // end timer

        // 3. Update the optimistic transaction with real hash
        // Note: updateTx handles attaching the .wait() listeners
        if (placeholderHash) {
          updateTx(placeholderHash, txResponse);
          placeholderHash = null; // Clear placeholder after successful update initiation
        }
      });

      // 4. Update the balance
      refreshBalance();
    } catch (error) {
      logError(error);
      toast.error("Click transaction failed. See console for details.");
      resetCombo();

      // 4. Remove the optimistic transaction if it exists and sending failed
      if (placeholderHash) {
        removeTx(placeholderHash);
      }
    }

    roadSpeedRef.current += Number(incrementalSpeed);
    if (roadSpeedRef.current === GetLevelRequirement(currentLevel)) {
      previousLevelRef.current = currentLevel;
      if (currentLevel === 13) {
        // Rebirth scenario
        // TODO: Maybe need to add a modal say congrats rebirth
        setCurrentLevel(1);
      } else {
        setCurrentLevel((prevState) => prevState + 1);
      }
    }

    const rect = containerRef.current?.getBoundingClientRect();
    const newClick = {
      id: `click-${Date.now()}-${Math.random()}`,
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
      roadSpeedRef.current = user.currentProgress;
    }
  }, [gameStarted]);

  useEffect(() => {
    setCurrentLevel(user.currentLevel);
  }, [user]);

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
    if (!address) return;

    const shouldUpdate = GetShouldUpdateCanvas(
      previousLevelRef.current,
      currentLevel
    );
    if (!shouldUpdate) return;

    if (previousLevelRef.current !== 0) {
      setShowLevelTransition(true);
      setTimeout(() => setShowLevelTransition(false), 2_000);
    }

    // To avoid having the canvas to render at the speed of 1_000_000
    const getVisualSpeed = () => {
      if (isPreloadingRef.current) return 100;
      return Math.min(roadSpeedRef.current, 10);
    };

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let roadY = 0;
    const bg: HTMLImageElement = new window.Image();
    bg.src = GetBackground(currentLevel);

    const { width, height } = dimensions;
    const assets = LoadSideObjectImages(currentLevel);

    let sideObjects: SideObject[] = [];
    let overlayObjects: OverlayObject[] = [];

    const roadWidthTop = width * 0.3;
    const roadWidthBottom = width * 1.1;

    const spawnGap = 80;
    let lastSpawn = 0;

    if (currentLevel >= 7) {
      // For Shooting Stars
      setInterval(() => {
        const count = Math.random() < 0.3 ? 2 : 1; // 30% chance of spawning 2

        if (overlayObjects.length < 3) {
          for (let i = 0; i < count; i++) {
            overlayObjects.push(
              GenerateOverlayObjects(assets[0], width, height)
            );
          }
        }
      }, 3_000);
    }
    // End Init

    const draw = () => {
      ctx.drawImage(bg, 0, 0, width, height);
      // ctx.clearRect(0, 0, width, height);

      if ([1, 2].includes(currentLevel)) {
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
          // obj.y += roadSpeedRef.current / 10;
          obj.y += getVisualSpeed() / 10;

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
      } else if (currentLevel >= 7) {
        overlayObjects.forEach((obj) => {
          obj.x -= obj.dx ?? 5;
          obj.y += obj.dy ?? 1;
          ctx.drawImage(obj.image, obj.x, obj.y, obj.width, obj.height);
        });

        overlayObjects = overlayObjects.filter(
          (object) => object.x + object.width > 0
        );
      }

      DrawRoad(ctx, width, height, roadWidthTop, roadWidthBottom, currentLevel);
      DrawSideDivider(
        ctx,
        width,
        height,
        roadWidthTop,
        roadWidthBottom,
        "#FFF"
      );
      DrawCenterDivider(
        ctx,
        width,
        height,
        GetCenterDividerColor(currentLevel)
      );
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
        currentLevel
      );
      // DrawBackgroundObjectImage(ctx, width, height, currentLevel);

      if ([3, 4].includes(currentLevel)) {
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
          obj.y += getVisualSpeed() / 10;
          // obj.y += roadSpeedRef.current / 10;

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
      } else if ([5, 6].includes(currentLevel)) {
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
          // obj.y += roadSpeedRef.current / 10;
          obj.y += getVisualSpeed() / 10;

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

      // roadY += roadSpeedRef.current / 10;
      roadY += getVisualSpeed() / 10;

      if (isPreloadingRef.current && roadY >= 1_000) {
        isPreloadingRef.current = false;
        roadSpeedRef.current = 0;
      }

      // Draw Combo Meter Text if combo > 1
      if (comboCount > 1) {
        ctx.font = "bold 30px Arial"; // Adjust font size and style as needed
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; // White text with slight transparency
        ctx.textAlign = "center";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 5;
        ctx.fillText(`Combo: ${comboCount}x`, width / 2, height * 0.15); // Position near top-center
        ctx.shadowBlur = 0; // Reset shadow blur
      }

      requestAnimationFrame(draw);
    };

    bg.onload = () => {
      draw();
    };

    if (bg.complete) {
      draw();
    }
  }, [dimensions, currentLevel, address]);

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

      {/* Transaction Log Component */}
      <TransactionLogs transactions={transactions} address={address} />

      <div className="absolute bottom-[80px] left-0">
        <Speedometer
          currentProgress={
            gameStarted
              ? roadSpeedRef.current || user.currentProgress
              : user.currentProgress
          }
          levelRequirement={GetLevelRequirement(currentLevel)}
          riseCrystals={Number(formatEther(riseCrystalsBalance))}
        />
      </div>
    </div>
  );
};

export default Gameplay;
