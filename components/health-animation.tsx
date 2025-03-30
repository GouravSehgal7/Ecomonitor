"use client";

import { useEffect, useRef } from "react";

export function HealthAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctxRef.current = canvas.getContext("2d");
    if (!ctxRef.current) return;

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class HealthIcon {
      "x": number;
      "y": number;
      "size": number;
      "type": "heart" | "lungs" | "mask" | "pill" | "doctor";
      "speed": number;
      "opacity": number;
      "rotation": number;
      "rotationSpeed": number;

      constructor() {
        const canvas = canvasRef.current;
        if (!canvas) return;

        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 20 + 10;
        this.type = this.getRandomType();
        this.speed = Math.random() * 0.5 + 0.1;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      }

      getRandomType(): "heart" | "lungs" | "mask" | "pill" | "doctor" {
        const types: ("heart" | "lungs" | "mask" | "pill" | "doctor")[] = [
          "heart",
          "lungs",
          "mask",
          "pill",
          "doctor",
        ];
        return types[Math.floor(Math.random() * types.length)];
      }

      update() {
        const canvas = canvasRef.current;
        if (!canvas) return;

        this.y -= this.speed;
        this.x += Math.sin(this.y * 0.01) * 0.5;
        this.rotation += this.rotationSpeed;

        if (
          this.y < -this.size ||
          this.y > canvas.height + this.size ||
          this.x < -this.size ||
          this.x > canvas.width + this.size
        ) {
          this.x = Math.random() * canvas.width;
          this.y = canvas.height + this.size;
          this.opacity = Math.random() * 0.3 + 0.1;
        }
      }

      draw() {
        const ctx = ctxRef.current;
        if (!ctx) return;

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        switch (this.type) {
          case "heart":
            this.drawHeart(ctx);
            break;
          case "lungs":
            this.drawLungs(ctx);
            break;
          case "mask":
            this.drawMask(ctx);
            break;
          case "pill":
            this.drawPill(ctx);
            break;
          case "doctor":
            this.drawDoctor(ctx);
            break;
        }

        ctx.restore();
      }

      drawHeart(ctx: CanvasRenderingContext2D) {
        const s = this.size;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(s * 0.3, -s * 0.3, s, s * 0.3, 0, s);
        ctx.bezierCurveTo(-s, s * 0.3, -s * 0.3, -s * 0.3, 0, s * 0.3);
        ctx.fillStyle = "rgba(236, 72, 153, 0.8)"; // pink-500
        ctx.fill();
      }

      drawLungs(ctx: CanvasRenderingContext2D) {
        const s = this.size;
        ctx.beginPath();
        ctx.moveTo(-s * 0.2, -s * 0.5);
        ctx.bezierCurveTo(-s * 0.8, -s * 0.3, -s * 0.8, s * 0.5, -s * 0.2, s * 0.5);
        ctx.lineTo(-s * 0.2, -s * 0.5);
        ctx.fillStyle = "rgba(147, 51, 234, 0.8)"; // purple-600
        ctx.fill();
      }

      drawMask(ctx: CanvasRenderingContext2D) {
        const s = this.size;
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.8, s * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(96, 165, 250, 0.8)"; // blue-400
        ctx.fill();
      }

      drawPill(ctx: CanvasRenderingContext2D) {
        const s = this.size;
        ctx.beginPath();
        ctx.ellipse(-s * 0.3, 0, s * 0.3, s * 0.15, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(248, 113, 113, 0.8)"; // red-400
        ctx.fill();
      }

      drawDoctor(ctx: CanvasRenderingContext2D) {
        const s = this.size;
        ctx.beginPath();
        ctx.arc(0, -s * 0.5, s * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fill();
      }
    }

    const icons: HealthIcon[] = Array.from({ length: 30 }, () => new HealthIcon());

    const animate = () => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      icons.forEach((icon) => {
        icon.update();
        icon.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
}
