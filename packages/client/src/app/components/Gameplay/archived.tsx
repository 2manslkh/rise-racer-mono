"use client";
import { useEffect, useRef, useState } from "react";

const Gameplay = ({ heightPercentage = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight * heightPercentage,
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
    const roadSpeed = 5;
    const grassSpeed = roadSpeed / 2;

    // Generate initial random grass patches
    const grassPatches: { x: number; y: number }[] = Array.from({ length: 10 }, () => ({
      x: Math.random() < 0.5 ? Math.random() * 100 : dimensions.width - Math.random() * 100,
      y: Math.random() * dimensions.height,
    }));

    function draw() {
      if (!ctx) return;

      const { width, height } = dimensions;
      ctx.clearRect(0, 0, width, height);

      // === Grass Background ===
      ctx.fillStyle = "#228B22";
      ctx.fillRect(0, 0, width, height);

      // === Moving Grass Patches ===
      ctx.fillStyle = "#1A6F1A";
      for (const patch of grassPatches) {
        ctx.fillRect(patch.x, patch.y, 40, 20);
        patch.y += grassSpeed;
        if (patch.y > height) {
          patch.y = -20;
          patch.x = Math.random() < 0.5 ? Math.random() * 100 : width - Math.random() * 100;
        }
      }

      // === Road (Reduced Tilt) ===
      const roadWidthBottom = width * 0.6;
      const roadWidthTop = width * 0.35;  // Reduced tilt by increasing top road width
      ctx.fillStyle = "#555";
      ctx.beginPath();
      ctx.moveTo((width - roadWidthBottom) / 2, height);
      ctx.lineTo((width + roadWidthBottom) / 2, height);
      ctx.lineTo((width + roadWidthTop) / 2, 0);
      ctx.lineTo((width - roadWidthTop) / 2, 0);
      ctx.closePath();
      ctx.fill();

      // === Solid Yellow Side Dividers Following the Road Borders ===
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo((width - roadWidthBottom) / 2, height);
      ctx.lineTo((width - roadWidthTop) / 2, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo((width + roadWidthBottom) / 2, height);
      ctx.lineTo((width + roadWidthTop) / 2, 0);
      ctx.stroke();

      // === Lane Markings (Vertically Straight with 3D Effect) ===
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 4;
      const laneXStart = width / 2;
      for (let i = 0; i < height; i += 100) {
        const yOffset = (i + roadY) % height;
        const laneHeight = 20 + (yOffset / height) * 20; // Lines extend further down

        // Drawing a single lane line vertically centered
        ctx.beginPath();
        ctx.moveTo(laneXStart, yOffset); // Start at the center of the road
        ctx.lineTo(laneXStart, yOffset + laneHeight); // Extend down vertically
        ctx.stroke();
      }

      // === Car (Fixed at Bottom Center) ===
      ctx.fillStyle = "red";
      ctx.fillRect(width / 2 - 25, height * 0.8, 50, 30);

      // Move road
      roadY += roadSpeed;
      requestAnimationFrame(draw);
    }

    draw();
  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="absolute left-0 top-0 bg-gray-900"
    />
  );
}

export default Gameplay