"use client";

import { useLayoutEffect, useRef } from "react";

export function WaterPollutionAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const c = canvasRef.current; // Reassign canvasRef to ensure it's not null
      if (!c) return;
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Pollutant {
      "x": number;
      "y": number;
      "size": number;
      "type": "oil" | "plastic" | "chemical" | "waste";
      "speed": number;
      "rotation": number;
      "rotationSpeed": number;
      "color": string;
      "opacity": number;

      constructor() {
        const c = canvasRef.current; // Ensure canvas is accessed safely
        if (!c) return;

        this.x = Math.random() * c.width;
        this.y = Math.random() * c.height;
        this.size = Math.random() * 15 + 5;
        this.type = this.getRandomType();
        this.speed = Math.random() * 0.5 + 0.1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.color = this.getColor();
        this.opacity = Math.random() * 0.7 + 0.3;
      }

      getRandomType(): "oil" | "plastic" | "chemical" | "waste" {
        const types: ("oil" | "plastic" | "chemical" | "waste")[] = [
          "oil",
          "plastic",
          "chemical",
          "waste",
        ];
        return types[Math.floor(Math.random() * types.length)];
      }

      getColor(): string {
        switch (this.type) {
          case "oil":
            return `rgba(30, 30, 30, ${this.opacity})`;
          case "plastic":
            return `rgba(255, 255, 255, ${this.opacity})`;
          case "chemical":
            return `rgba(0, 255, 0, ${this.opacity})`;
          case "waste":
            return `rgba(139, 69, 19, ${this.opacity})`;
          default:
            return `rgba(100, 100, 100, ${this.opacity})`;
        }
      }

      update() {
        const c = canvasRef.current;
        if (!c) return;

        this.y += Math.sin(this.x * 0.01) * 0.2;
        this.x += this.speed;
        this.rotation += this.rotationSpeed;

        if (this.x > c.width + this.size) {
          this.x = -this.size;
          this.y = Math.random() * c.height;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        switch (this.type) {
          case "oil":
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            break;
          case "plastic":
            ctx.beginPath();
            ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = "rgba(200, 200, 200, 0.5)";
            ctx.lineWidth = 1;
            ctx.stroke();
            break;
          case "chemical":
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
              const angle = (i / 5) * Math.PI * 2;
              const x = Math.cos(angle) * this.size;
              const y = Math.sin(angle) * this.size;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
            break;
          case "waste":
            ctx.beginPath();
            ctx.moveTo(-this.size / 2, -this.size / 2);
            ctx.lineTo(this.size / 2, -this.size / 2);
            ctx.lineTo(0, this.size / 2);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
            break;
        }

        ctx.restore();
      }
    }

    const pollutants: Pollutant[] = Array.from(
      { length: 50 },
      () => new Pollutant()
    ).filter((p) => p instanceof Pollutant); // Filter out nulls if any

    let animationFrameId: number;

    const animate = () => {
      const c = canvasRef.current;
      if (!ctx || !c) return;

      ctx.clearRect(0, 0, c.width, c.height);

      const gradient = ctx.createLinearGradient(0, 0, 0, c.height);
      gradient.addColorStop(0, "rgba(0, 50, 100, 0.5)");
      gradient.addColorStop(0.5, "rgba(0, 100, 150, 0.5)");
      gradient.addColorStop(1, "rgba(0, 150, 200, 0.5)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, c.width, c.height);

      pollutants.forEach((pollutant) => {
        pollutant.update();
        pollutant.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
}
