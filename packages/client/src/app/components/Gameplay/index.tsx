"use client";
import { useEffect, useRef, useState } from "react";
import { GetVehicle } from "../../lib/vehicle";
import Image from "next/image";
import {
  DrawRoad,
  DrawSideDivider,
  DrawCenterDivider,
  DrawLaneDividers,
} from "./util";

interface GameplayProps {
  heightPercentage?: number;
  vehicleTier?: number;
}

const Gameplay: React.FC<GameplayProps> = ({
  heightPercentage = 1,
  vehicleTier = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [roadSpeed, setRoadSpeed] = useState<number>(1);

  const vehicle = GetVehicle(vehicleTier);

  const handleClick = () => {
    setRoadSpeed((prev) => prev + 1);
  };

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

    const draw = () => {
      const { width, height } = dimensions;
      ctx.clearRect(0, 0, width, height);

      // Example road drawing code:
      const roadWidthTop = width * 0.4;
      const roadWidthBottom = width * 1;

      DrawRoad(ctx, width, height, roadWidthTop, roadWidthBottom, "#555");
      DrawSideDivider(
        ctx,
        width,
        height,
        roadWidthTop,
        roadWidthBottom,
        "#FFF"
      );
      DrawCenterDivider(ctx, width, height, "#FFF");
      DrawLaneDividers(
        ctx,
        width,
        height,
        roadWidthTop,
        roadWidthBottom,
        roadY,
        "#FFF"
      );

      roadY += roadSpeed;
      requestAnimationFrame(draw);
    };

    draw();
  }, [dimensions, roadSpeed]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute left-0 top-0 bg-gray-900"
      />
      <div className="absolute bottom-[50px] left-1/2 transform -translate-x-1/2 w-[140px]">
        <Image src={vehicle} alt="Car" />
      </div>
    </div>
  );
};

export default Gameplay;
